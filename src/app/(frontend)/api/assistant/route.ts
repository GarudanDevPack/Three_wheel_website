import Anthropic from '@anthropic-ai/sdk'
import { buildAssistantSystemPrompt } from '@/lib/assistantKnowledge'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MODEL = 'claude-opus-5-5'
const MAX_MESSAGES = 20
const MAX_CHARS = 1000
const languages = { en: 'English', si: 'Sinhala', ta: 'Tamil' } as const
type Locale = keyof typeof languages

// Basic per-IP limit (in-memory, per server instance): 10 requests per minute.
const RATE_LIMIT = 10
const RATE_WINDOW_MS = 60_000
const hits = new Map<string, number[]>()

const rateLimited = (ip: string) => {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((time) => now - time < RATE_WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > RATE_LIMIT
}

const json = (status: number, error: string) => Response.json({ error }, { status })

type ChatMessage = { role: 'user' | 'assistant'; content: string }

const parseBody = (body: unknown): { messages: ChatMessage[]; locale: Locale } | null => {
  if (!body || typeof body !== 'object') return null
  const { messages, locale } = body as { messages?: unknown; locale?: unknown }
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) return null
  if (typeof locale !== 'string' || !(locale in languages)) return null

  const valid = messages.every((message, index) => {
    if (!message || typeof message !== 'object') return false
    const { role, content } = message as { role?: unknown; content?: unknown }
    const expectedRole = index % 2 === 0 ? 'user' : 'assistant'
    return role === expectedRole && typeof content === 'string' && content.trim().length > 0 && content.length <= MAX_CHARS
  })
  // Must end on a visitor message.
  if (!valid || messages.length % 2 === 0) return null
  return { messages: messages as ChatMessage[], locale: locale as Locale }
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local'
  if (rateLimited(ip)) return json(429, 'rate_limited')

  let parsed: ReturnType<typeof parseBody>
  try {
    parsed = parseBody(await request.json())
  } catch {
    parsed = null
  }
  if (!parsed) return json(400, 'invalid_request')

  // The client adds ANTHROPIC_API_KEY to .env.local; until then the chat shows its offline state.
  if (!process.env.ANTHROPIC_API_KEY) return json(503, 'not_configured')

  const client = new Anthropic()
  const system = await buildAssistantSystemPrompt()

  // Language hint rides on the latest visitor turn so the system prompt stays byte-stable (cacheable).
  const history = parsed.messages.slice(0, -1)
  const latest = parsed.messages[parsed.messages.length - 1]
  const messages: Anthropic.Beta.BetaMessageParam[] = [
    ...history.map((message) => ({ role: message.role, content: message.content })),
    {
      role: 'user',
      content: [
        { type: 'text', text: latest.content },
        { type: 'text', text: `(Please reply in ${languages[parsed.locale]}.)` },
      ],
    },
  ]

  const stream = client.beta.messages.stream({
    model: MODEL,
    max_tokens: 2048,
    output_config: { effort: 'low' },
    system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
    messages,
    // Server-side refusal fallback: on a policy decline the API re-runs the turn on a fallback model.
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
  })

  const encoder = new TextEncoder()
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      stream.on('text', (text) => controller.enqueue(encoder.encode(text)))
      stream
        .finalMessage()
        .then((message) => {
          if (message.stop_reason === 'refusal') {
            controller.enqueue(
              encoder.encode("\n\nSorry, I can't help with that here — please chat with our team on WhatsApp."),
            )
          }
          controller.close()
        })
        .catch((error: unknown) => {
          logError(error)
          controller.error(error)
        })
    },
    cancel() {
      stream.abort()
    },
  })

  // Surface setup/API failures as status codes before any text has streamed.
  try {
    await stream.withResponse()
  } catch (error) {
    logError(error)
    if (error instanceof Anthropic.AuthenticationError) return json(503, 'not_configured')
    if (error instanceof Anthropic.RateLimitError) return json(429, 'rate_limited')
    if (error instanceof Anthropic.APIError) return json(502, 'upstream_error')
    return json(502, 'upstream_error')
  }

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
  })
}

const logError = (error: unknown) => {
  if (error instanceof Anthropic.APIError) console.error(`[assistant] API error ${error.status}: ${error.message}`)
  else console.error('[assistant]', error)
}
