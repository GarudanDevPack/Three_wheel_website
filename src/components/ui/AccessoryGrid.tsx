import Image from 'next/image'

export type Accessory = {
  id: string
  name: string
  description?: string | null
  image?: { url?: string | null; alt?: string | null } | null
}

const AccessoryGrid = ({ accessories }: { accessories: Accessory[] }) => {
  if (!accessories.length) return null

  return (
    <section className="tw:bg-surface-raised tw:py-20">
      <div className="tw:mx-auto tw:max-w-6xl tw:px-6">
        <h2 className="tw:text-3xl tw:font-bold tw:text-white">Accessories</h2>
        <div className="tw:mt-10 tw:grid tw:gap-6 tw:sm:grid-cols-2 tw:lg:grid-cols-3">
          {accessories.map((accessory) => (
            <div key={accessory.id} className="tw:overflow-hidden tw:rounded-2xl tw:bg-surface tw:border tw:border-white/10">
              {accessory.image?.url && (
                <div className="tw:relative tw:aspect-square">
                  <Image
                    src={accessory.image.url}
                    alt={accessory.image.alt || accessory.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="tw:object-contain tw:p-6"
                  />
                </div>
              )}
              <div className="tw:border-t tw:border-white/10 tw:p-5">
                <p className="tw:text-lg tw:font-semibold tw:text-white">{accessory.name}</p>
                {accessory.description && (
                  <p className="tw:mt-1 tw:text-sm tw:text-white/60">{accessory.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AccessoryGrid
