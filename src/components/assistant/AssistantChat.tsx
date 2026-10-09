'use client'

import { useCallback, useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { trackEvent } from '@/lib/analytics'

type Message = { role: 'user' | 'assistant'; content: string }
type Status = 'idle' | 'loading' | 'offline' | 'error' | 'busy'

export type AssistantContacts = {
  whatsapp: string
  headOffice: string
  jaffna: string
}

const STORAGE_KEY = 'neptune-assistant-chat'
const MAX_HISTORY = 20
const MAX_INPUT = 500

const digits = (phone: string) => phone.replace(/\D/g, '')
const whatsappHref = (phone: string, text: string) =>
  `https://wa.me/94${digits(phone).replace(/^0/, '')}?text=${encodeURIComponent(text)}`

const loadHistory = (): Message[] => {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY)
    return saved ? (JSON.parse(saved) as Message[]) : []
  } catch {
    return []
  }
}

const AssistantChat = ({ contacts, onClose }: { contacts: AssistantContacts; onClose: () => void }) => {
  const t = useTranslations('Assistant')
  const locale = useLocale()
  const [messages, setMessages] = useState<Message[]>(loadHistory)
  const [input, setInput] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    } catch {
      // Storage unavailable (private mode etc.) — the chat still works for this view.
    }
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, status])

  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const send = useCallback(
    async (text: string) => {
      const question = text.trim()
      if (!question || status === 'loading') return

      // Send only answered question/reply pairs (unanswered questions, e.g. while offline, are skipped)
      // plus the new question, trimmed to the API's limit — it expects user/assistant alternation.
      const pairs: Message[] = []
      messages.forEach((message, index) => {
        const next = messages[index + 1]
        if (message.role === 'user' && next?.role === 'assistant' && next.content) pairs.push(message, next)
      })
      const payload = [...pairs.slice(-(MAX_HISTORY - 2)), { role: 'user' as const, content: question }]
      setMessages([...messages, { role: 'user', content: question }])
      setInput('')
      setStatus('loading')
      trackEvent('assistant_message')

      try {
        const response = await fetch('/api/assistant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: payload, locale }),
        })

        if (!response.ok || !response.body) {
          setStatus(response.status === 503 ? 'offline' : response.status === 429 ? 'busy' : 'error')
          return
        }

        setMessages((current) => [...current, { role: 'assistant', content: '' }])
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          setMessages((current) => {
            const next = [...current]
            const last = next[next.length - 1]
            next[next.length - 1] = { ...last, content: last.content + chunk }
            return next
          })
        }
        setStatus('idle')
      } catch {
        setStatus('error')
      } finally {
        // Drop an empty assistant bubble left by a failed stream.
        setMessages((current) =>
          current.length && current[current.length - 1].role === 'assistant' && !current[current.length - 1].content
            ? current.slice(0, -1)
            : current,
        )
      }
    },
    [locale, messages, status],
  )

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    void send(input)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      void send(input)
    }
  }

  const notice = status === 'offline' ? t('offline') : status === 'error' ? t('error') : status === 'busy' ? t('busy') : null
  const highlightHandoff = status === 'offline' || status === 'error'

  return (
    <motion.div
      role="dialog"
      aria-modal="false"
      aria-label={t('title')}
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 24, scale: 0.97 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="tw:pointer-events-auto tw:fixed tw:inset-0 tw:z-[80] tw:flex tw:flex-col tw:overflow-hidden tw:bg-surface tw:shadow-2xl tw:sm:inset-auto tw:sm:bottom-28 tw:sm:right-6 tw:sm:h-[560px] tw:sm:max-h-[calc(100vh-9rem)] tw:sm:w-[380px] tw:sm:rounded-3xl tw:sm:border tw:sm:border-brand-ink/10"
    >
      <header className="tw:flex tw:items-center tw:gap-3 tw:bg-brand-ink tw:px-4 tw:py-3 tw:text-white">
        <Image src="/images/assistant/neptune-assistant-192.webp" alt="" width={40} height={40} className="tw:rounded-full" />
        <div className="tw:min-w-0 tw:flex-1">
          <p className="tw:m-0 tw:text-sm tw:font-bold">{t('title')}</p>
          <p className="tw:m-0 tw:flex tw:items-center tw:gap-1.5 tw:text-xs tw:text-white/60">
            <span className="tw:h-2 tw:w-2 tw:rounded-full tw:bg-brand-green" aria-hidden="true" />
            {t('online')}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={t('close')}
          className="tw:flex tw:h-9 tw:w-9 tw:cursor-pointer tw:items-center tw:justify-center tw:rounded-full tw:border-0 tw:bg-white/10 tw:text-white tw:transition tw:hover:bg-white/20"
        >
          <svg viewBox="0 0 24 24" className="tw:h-4 tw:w-4" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      <div ref={listRef} className="tw:flex-1 tw:space-y-3 tw:overflow-y-auto tw:px-4 tw:py-4" aria-live="polite">
        <Bubble role="assistant">{t('welcome')}</Bubble>
        {messages.map((message, index) => (
          <Bubble key={index} role={message.role}>
            {message.content}
          </Bubble>
        ))}
        {status === 'loading' && messages[messages.length - 1]?.role === 'user' && (
          <div className="tw:flex tw:w-fit tw:gap-1 tw:rounded-2xl tw:rounded-bl-sm tw:bg-surface-raised tw:px-4 tw:py-3" aria-label={t('typing')}>
            {[0, 1, 2].map((dot) => (
              <span
                key={dot}
                className="tw:h-2 tw:w-2 tw:animate-bounce tw:rounded-full tw:bg-brand-ink/40"
                style={{ animationDelay: `${dot * 150}ms` }}
              />
            ))}
          </div>
        )}
        {notice && (
          <p className="tw:m-0 tw:rounded-xl tw:bg-amber-50 tw:px-3 tw:py-2 tw:text-xs tw:leading-relaxed tw:text-amber-800">{notice}</p>
        )}
      </div>

      <div className="tw:border-t tw:border-brand-ink/10 tw:px-4 tw:pb-4 tw:pt-3">
        <form onSubmit={onSubmit} className="tw:flex tw:items-end tw:gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value.slice(0, MAX_INPUT))}
            onKeyDown={onKeyDown}
            rows={1}
            placeholder={t('placeholder')}
            aria-label={t('placeholder')}
            className="tw:max-h-28 tw:min-h-11 tw:flex-1 tw:resize-none tw:rounded-2xl tw:border tw:border-brand-ink/10 tw:bg-surface-raised tw:px-4 tw:py-3 tw:text-sm tw:text-brand-ink tw:outline-none tw:focus:ring-2 tw:focus:ring-brand-blue-light"
          />
          <button
            type="submit"
            disabled={!input.trim() || status === 'loading'}
            aria-label={t('send')}
            className="tw:flex tw:h-11 tw:w-11 tw:shrink-0 tw:cursor-pointer tw:items-center tw:justify-center tw:rounded-full tw:border-0 tw:bg-brand-blue tw:text-white tw:transition tw:hover:bg-brand-blue-light tw:disabled:cursor-not-allowed tw:disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" className="tw:h-5 tw:w-5" fill="none" aria-hidden="true">
              <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>

        <div className={`tw:mt-3 tw:flex tw:flex-wrap tw:gap-2 tw:rounded-2xl tw:transition ${highlightHandoff ? 'tw:bg-brand-green/10 tw:p-2' : ''}`}>
          <a
            href={whatsappHref(contacts.whatsapp, t('whatsappText'))}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent('assistant_whatsapp')}
            className="tw:inline-flex tw:items-center tw:gap-1.5 tw:rounded-full tw:bg-[#25D366] tw:px-3 tw:py-1.5 tw:text-xs tw:font-semibold tw:text-white"
          >
            {t('whatsapp')}
          </a>
          {[
            { label: t('callHeadOffice'), phone: contacts.headOffice },
            { label: t('callJaffna'), phone: contacts.jaffna },
          ].map((contact) => (
            <a
              key={contact.phone}
              href={`tel:${digits(contact.phone)}`}
              onClick={() => trackEvent('assistant_call')}
              className="tw:inline-flex tw:items-center tw:gap-1.5 tw:rounded-full tw:border tw:border-brand-ink/15 tw:px-3 tw:py-1.5 tw:text-xs tw:font-semibold tw:text-brand-ink"
            >
              {t('call')} · {contact.label}
            </a>
          ))}
        </div>
        <p className="tw:m-0 tw:mt-2 tw:text-[10px] tw:leading-snug tw:text-brand-ink/40">{t('disclaimer')}</p>
      </div>
    </motion.div>
  )
}

const Bubble = ({ role, children }: { role: Message['role']; children: React.ReactNode }) => (
  <div
    className={`tw:max-w-[85%] tw:whitespace-pre-wrap tw:px-4 tw:py-2.5 tw:text-sm tw:leading-relaxed ${
      role === 'user'
        ? 'tw:ml-auto tw:rounded-2xl tw:rounded-br-sm tw:bg-brand-blue tw:text-white'
        : 'tw:rounded-2xl tw:rounded-bl-sm tw:bg-surface-raised tw:text-brand-ink'
    }`}
  >
    {children}
  </div>
)

export default AssistantChat
