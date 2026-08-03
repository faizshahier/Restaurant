interface BrandLogoProps {
  logo: string
  restaurantName: string
}

/**
 * The restaurant logo, or its name when no logo is set. Shared by the public header
 * and the admin header so the branding looks the same in both places.
 */
export function BrandLogo({ logo, restaurantName }: BrandLogoProps) {
  if (!logo) {
    return (
      <span className="font-display text-xl font-semibold tracking-wide text-primary-200">
        {restaurantName || 'The Restaurant'}
      </span>
    )
  }

  return (
    // object-contain (not cover) shows the whole logo without cropping; the white
    // chip keeps a light-background logo looking intentional on the dark header.
    <img
      src={logo}
      alt={restaurantName || 'Restaurant logo'}
      className="h-11 w-auto rounded-md bg-white object-contain p-1"
    />
  )
}
