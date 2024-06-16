import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function getRandomValue(min: number, max: number) {
  return Math.random() * (max - min) + min
}

export function generateRandomCoordinate() {
  const latMin = 37.224
  const latMax = 38.1139
  const lonMin = -123.017
  const lonMax = -121.517

  const latitude = getRandomValue(latMin, latMax)
  const longitude = getRandomValue(lonMin, lonMax)

  return { latitude, longitude }
}

export function generateRandomDatatime(): string {
  const now = new Date()
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(now.getMonth() - 6)

  // Get a random timestamp between now and six months ago
  const randomTimestamp = new Date(
    sixMonthsAgo.getTime() +
      Math.random() * (now.getTime() - sixMonthsAgo.getTime())
  )

  // Format the date to ISO 8601 string, which is compatible with PostgreSQL TIMESTAMPZ
  return randomTimestamp.toISOString()
}
