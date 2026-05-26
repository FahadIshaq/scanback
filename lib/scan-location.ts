/**
 * Request the scanner's location from the browser and resolve to a readable place name.
 * Returns "unknown" only when geolocation is unavailable or denied.
 */
export async function getScannerLocation(): Promise<string> {
  if (typeof window === 'undefined' || !navigator.geolocation) {
    return 'unknown'
  }

  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 120000,
      })
    })

    const { latitude, longitude } = position.coords
    const address = await reverseGeocode(latitude, longitude)
    if (address) {
      return address
    }

    return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
  } catch {
    return 'unknown'
  }
}

async function reverseGeocode(latitude: number, longitude: number): Promise<string | null> {
  try {
    const url = new URL('https://nominatim.openstreetmap.org/reverse')
    url.searchParams.set('lat', String(latitude))
    url.searchParams.set('lon', String(longitude))
    url.searchParams.set('format', 'json')

    const response = await fetch(url.toString(), {
      headers: {
        Accept: 'application/json',
        'Accept-Language': 'en',
        'User-Agent': 'ScanBack/1.0 (qr-scan-location)',
      },
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return typeof data.display_name === 'string' ? data.display_name : null
  } catch {
    return null
  }
}
