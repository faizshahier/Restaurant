import { useEffect, useState } from 'react'

interface StaticMapProps {
  address: string
  /** Higher = more zoomed in. 15 shows the street and its neighbours. */
  zoom?: number
}

interface Point {
  lat: number
  lon: number
}

const TILE = 256
const GRID = [-1, 0, 1] // 3x3 tiles around the centre, so panning room exists on all sides

/** Slippy-map maths: turn a coordinate into a fractional tile position. */
function toTileCoords({ lat, lon }: Point, zoom: number) {
  const n = 2 ** zoom
  const latRad = (lat * Math.PI) / 180
  return {
    x: ((lon + 180) / 360) * n,
    y: ((1 - Math.asinh(Math.tan(latRad)) / Math.PI) / 2) * n,
  }
}

/**
 * A static map image built from OpenStreetMap tiles.
 *
 * OSM tiles need no API key, unlike Google or Mapbox static maps. The address is
 * turned into coordinates once with Nominatim (also keyless), then the tiles around
 * that point are drawn as plain <img> elements — so this stays a static picture with
 * no heavy mapping library in the bundle.
 */
export function StaticMap({ address, zoom = 15 }: StaticMapProps) {
  const [point, setPoint] = useState<Point | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'failed'>('loading')

  const query = address.trim()

  useEffect(() => {
    // An empty address is handled during render instead, so this effect never has
    // to set state just to report "nothing to look up".
    if (!query) return

    // `ignore` prevents a slow response for an old address overwriting a newer one.
    // State starts as 'loading', and the caller passes a `key` of the address so a
    // changed address remounts this component with fresh state.
    let ignore = false

    fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((results: Array<{ lat: string; lon: string }>) => {
        if (ignore) return
        if (!results.length) {
          setStatus('failed')
          return
        }
        setPoint({ lat: Number(results[0].lat), lon: Number(results[0].lon) })
        setStatus('ready')
      })
      .catch((err: unknown) => {
        if (ignore) return
        console.error('Failed to locate the address on the map', err)
        setStatus('failed')
      })

    return () => {
      ignore = true
    }
  }, [query])

  if (!query) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center gap-2 rounded-lg border border-charcoal-700 bg-charcoal-800 p-6 text-center">
        <p className="text-sm text-charcoal-100">No address has been set yet.</p>
        <p className="text-xs text-charcoal-400">Add the full street address in Admin → Settings.</p>
      </div>
    )
  }

  if (status === 'loading') {
    return (
      <div className="min-h-64 animate-pulse rounded-lg border border-charcoal-700 bg-charcoal-800" />
    )
  }

  if (status === 'failed' || !point) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center gap-2 rounded-lg border border-charcoal-700 bg-charcoal-800 p-6 text-center">
        <p className="text-sm text-charcoal-100">We could not place this address on the map.</p>
        <p className="text-xs text-charcoal-400">
          Check the full street address in Admin → Settings.
        </p>
      </div>
    )
  }

  const { x, y } = toTileCoords(point, zoom)
  const originX = Math.floor(x) - 1
  const originY = Math.floor(y) - 1
  // Where the address sits inside the 3x3 grid, in pixels from its top-left corner.
  const pinX = (x - originX) * TILE
  const pinY = (y - originY) * TILE

  const osmLink = `https://www.openstreetmap.org/?mlat=${point.lat}&mlon=${point.lon}#map=${zoom}/${point.lat}/${point.lon}`

  return (
    <div className="overflow-hidden rounded-lg border border-charcoal-700">
      <div className="relative h-64 w-full overflow-hidden bg-charcoal-800 sm:h-80">
        {/* The tile grid is shifted so the address lands exactly at the centre. */}
        <div
          className="absolute"
          style={{ left: `calc(50% - ${pinX}px)`, top: `calc(50% - ${pinY}px)` }}
        >
          {GRID.map((dy) => (
            <div key={dy} className="flex">
              {GRID.map((dx) => (
                <img
                  key={dx}
                  src={`https://tile.openstreetmap.org/${zoom}/${originX + dx + 1}/${originY + dy + 1}.png`}
                  alt=""
                  width={TILE}
                  height={TILE}
                  /* Deliberately NOT lazy: these tiles live in an absolutely
                     positioned, overflow-hidden box, and the browser's lazy-loading
                     check never fires for them — they would stay blank forever.
                     It is only 9 small tiles, so eager loading is the right call. */
                  decoding="async"
                  className="block max-w-none"
                />
              ))}
            </div>
          ))}
        </div>

        {/* Pin, centred over the address. */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
          <svg viewBox="0 0 24 24" className="h-9 w-9 drop-shadow-lg" aria-hidden="true">
            <path
              d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"
              className="fill-primary-400 stroke-charcoal-900"
              strokeWidth="1.5"
            />
            <circle cx="12" cy="10" r="2.6" className="fill-charcoal-900" />
          </svg>
        </div>
      </div>

      {/* OpenStreetMap's licence requires visible attribution. */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-charcoal-800 px-3 py-2 text-xs">
        <a href={osmLink} target="_blank" rel="noreferrer" className="text-primary-300 hover:underline">
          Open in maps →
        </a>
        <span className="text-charcoal-400">
          ©{' '}
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            OpenStreetMap
          </a>{' '}
          contributors
        </span>
      </div>
    </div>
  )
}
