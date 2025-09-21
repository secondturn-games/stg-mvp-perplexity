/**
 * Latvian cities for the board game marketplace
 * These cities will be available in the city dropdown
 */
export const LATVIAN_CITIES = [
  'Rīga',
  'Daugavpils',
  'Liepāja',
  'Jelgava',
  'Jūrmala',
  'Ventspils',
  'Rēzekne',
] as const

export type LatvianCity = typeof LATVIAN_CITIES[number]

/**
 * Check if a city is a valid Latvian city
 */
export function isValidLatvianCity(city: string): city is LatvianCity {
  return LATVIAN_CITIES.includes(city as LatvianCity)
}

/**
 * Get city options for forms/dropdowns
 */
export function getCityOptions() {
  return LATVIAN_CITIES.map(city => ({
    value: city,
    label: city,
  }))
}
