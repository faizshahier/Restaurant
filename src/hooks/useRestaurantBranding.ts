import { useEffect, useState } from 'react'
import { isRestaurantOpenNow } from '../lib/hours'
import { SettingsService } from '../services'

export interface RestaurantBranding {
  restaurantName: string
  logo: string
  /** null until the settings load, so the badge can stay hidden until it is known. */
  isOpenNow: boolean | null
}

/**
 * Loads the pieces of the restaurant identity that every header needs: the name,
 * the logo, and whether the kitchen is open right now.
 *
 * Both the public Header and the AdminHeader use this, so the fetch, the fallback
 * name, and the open/closed calculation live in exactly one place.
 */
export function useRestaurantBranding(): RestaurantBranding {
  const [restaurantName, setRestaurantName] = useState('The Restaurant')
  const [logo, setLogo] = useState('')
  const [isOpenNow, setIsOpenNow] = useState<boolean | null>(null)

  useEffect(() => {
    // On failure the defaults stay in place and the badge stays hidden, rather than
    // throwing an unhandled rejection on every page load.
    SettingsService.getSettings()
      .then((settings) => {
        setRestaurantName(settings.restaurant_name)
        setLogo(settings.logo)
        setIsOpenNow(isRestaurantOpenNow(settings.opening_hours))
      })
      .catch((err: unknown) => console.error('Failed to load settings', err))
  }, [])

  return { restaurantName, logo, isOpenNow }
}
