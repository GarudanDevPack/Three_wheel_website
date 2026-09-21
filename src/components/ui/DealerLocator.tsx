'use client'

import { useMemo, useState } from 'react'

export type Dealer = {
  id: string
  name: string
  address?: string | null
  city?: string | null
  pincode?: string | null
  phone?: string | null
  latitude?: number | null
  longitude?: number | null
}

const bboxOffset = 0.02
const earthRadiusKm = 6371

const mapEmbedUrl = (lat: number, lon: number) =>
  `https://www.openstreetmap.org/export/embed.html?bbox=${lon - bboxOffset}%2C${
    lat - bboxOffset
  }%2C${lon + bboxOffset}%2C${lat + bboxOffset}&marker=${lat}%2C${lon}&layer=mapnik`

const directionsUrl = (lat: number, lon: number) =>
  `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`

const toRad = (deg: number) => (deg * Math.PI) / 180

const haversineKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return earthRadiusKm * 2 * Math.asin(Math.sqrt(a))
}

const DealerLocator = ({ dealers }: { dealers: Dealer[] }) => {
  const [pincodeQuery, setPincodeQuery] = useState('')
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [locating, setLocating] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)

  const withCoords = dealers.filter((d) => d.latitude != null && d.longitude != null)
  const [selectedId, setSelectedId] = useState(withCoords[0]?.id ?? dealers[0]?.id)

  const distances = useMemo(() => {
    if (!userLocation) return null
    const map = new Map<string, number>()
    dealers.forEach((dealer) => {
      if (dealer.latitude != null && dealer.longitude != null) {
        map.set(
          dealer.id,
          haversineKm(userLocation.lat, userLocation.lon, dealer.latitude, dealer.longitude),
        )
      }
    })
    return map
  }, [dealers, userLocation])

  const visibleDealers = useMemo(() => {
    const query = pincodeQuery.trim()
    let list = query ? dealers.filter((d) => d.pincode?.includes(query)) : dealers
    if (distances) {
      list = [...list].sort(
        (a, b) => (distances.get(a.id) ?? Infinity) - (distances.get(b.id) ?? Infinity),
      )
    }
    return list
  }, [dealers, pincodeQuery, distances])

  const selected = dealers.find((d) => d.id === selectedId) ?? visibleDealers[0] ?? dealers[0]

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.')
      return
    }
    setLocating(true)
    setLocationError(null)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({ lat: position.coords.latitude, lon: position.coords.longitude })
        setLocating(false)
      },
      () => {
        setLocationError('Could not get your location. Please allow location access and try again.')
        setLocating(false)
      },
    )
  }

  return (
    <div>
      <div className="tw:mb-6 tw:flex tw:flex-wrap tw:items-center tw:gap-3">
        <input
          value={pincodeQuery}
          onChange={(e) => setPincodeQuery(e.target.value)}
          placeholder="Search by pincode"
          className="tw:rounded-full tw:border tw:border-white/20 tw:bg-surface-raised tw:px-4 tw:py-2 tw:text-sm tw:text-white tw:placeholder-white/40"
        />
        <button
          type="button"
          onClick={useMyLocation}
          disabled={locating}
          className="tw:rounded-full tw:bg-brand-blue-light tw:px-4 tw:py-2 tw:text-sm tw:font-semibold tw:text-white tw:disabled:opacity-60"
        >
          {locating ? 'Locating…' : 'Use my location'}
        </button>
        {locationError && <p className="tw:text-sm tw:text-red-500">{locationError}</p>}
      </div>
      <div className="tw:grid tw:gap-8 tw:lg:grid-cols-2">
        <div className="tw:grid tw:gap-4 tw:sm:grid-cols-2">
          {visibleDealers.length === 0 ? (
            <p className="tw:text-sm tw:text-white/50">No dealers match that pincode.</p>
          ) : (
            visibleDealers.map((dealer) => (
              <button
                key={dealer.id}
                type="button"
                onClick={() => setSelectedId(dealer.id)}
                className={`tw:rounded-2xl tw:border tw:border-white/10 tw:p-6 tw:text-left tw:transition ${
                  dealer.id === selected?.id
                    ? 'tw:bg-brand-blue-light tw:text-white'
                    : 'tw:bg-surface-raised tw:text-white'
                }`}
              >
                <p className="tw:text-lg tw:font-semibold">{dealer.name}</p>
                {dealer.city && <p className="tw:mt-1 tw:text-sm tw:opacity-80">{dealer.city}</p>}
                {dealer.address && (
                  <p className="tw:mt-3 tw:text-sm tw:opacity-80">{dealer.address}</p>
                )}
                {dealer.phone && <p className="tw:mt-3 tw:text-sm tw:font-semibold">{dealer.phone}</p>}
                {distances?.has(dealer.id) && (
                  <p className="tw:mt-2 tw:text-xs tw:font-semibold tw:uppercase tw:tracking-wide tw:opacity-70">
                    {distances.get(dealer.id)!.toFixed(1)} km away
                  </p>
                )}
                {dealer.latitude != null && dealer.longitude != null && (
                  <a
                    href={directionsUrl(dealer.latitude, dealer.longitude)}
                    onClick={(e) => e.stopPropagation()}
                    target="_blank"
                    rel="noreferrer"
                    className="tw:mt-4 tw:inline-block tw:text-sm tw:font-semibold tw:underline"
                  >
                    Get directions
                  </a>
                )}
              </button>
            ))
          )}
        </div>
        <div className="tw:overflow-hidden tw:rounded-2xl tw:border tw:border-white/10 tw:bg-surface-raised">
          {selected?.latitude != null && selected?.longitude != null ? (
            <iframe
              key={selected.id}
              title={`Map to ${selected.name}`}
              src={mapEmbedUrl(selected.latitude, selected.longitude)}
              className="tw:h-full tw:min-h-[320px] tw:w-full tw:border-0"
            />
          ) : (
            <div className="tw:flex tw:h-full tw:min-h-[320px] tw:items-center tw:justify-center tw:p-6 tw:text-center tw:text-sm tw:text-white/50">
              Add latitude/longitude to a dealer in /admin to show a map here.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DealerLocator
