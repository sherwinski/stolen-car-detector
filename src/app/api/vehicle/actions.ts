'use server'

import { Vehicle } from '@/lib/types'
import { generateRandomCoordinate, generateRandomDatatime } from '@/lib/utils'
import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'

// Write a row to the vehicles table for each image uploaded.
// Randomly generating latitude, longitude, and last seen datetime.
export async function writeMetadataToVehiclesTable({
  licensePlateText,
  imageUrl,
}: {
  licensePlateText: string
  imageUrl: string
}) {
  console.log('\tInserting row into vehicles table...', imageUrl)

  const { latitude, longitude } = generateRandomCoordinate()
  const lastSeen = generateRandomDatatime()
  try {
    const result = await sql`
  INSERT INTO vehicles (license_plate_text, image_url, latitude, longitude, last_seen) VALUES (${licensePlateText}, ${imageUrl}, ${latitude}, ${longitude}, ${lastSeen} );`

    console.log('\tSuccessfully inserted row\n')
    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('Error inserting row into vehicles table', error)
    return NextResponse.json({ error }, { status: 500 })
  }
}

export async function getVehicleByLicensePlate({
  licensePlateText,
}: {
  licensePlateText: string
}) {
  try {
    const licensePlateTextAsWildcard = `%${licensePlateText}%`
    const result = await sql`
  SELECT * FROM vehicles WHERE SIMILARITY(license_plate_text, ${licensePlateText}) > 0.4 OR license_plate_text LIKE ${licensePlateTextAsWildcard};`

    return result.rows
  } catch (error) {
    console.error('Error getting vehicle by license plate', error)
    return []
  }
}

export async function searchForVehicles(licensePlateText: string) {
  const vehiclesFound = await getVehicleByLicensePlate({
    licensePlateText,
  })
  const mappedVehicles = vehiclesFound.map((row) => ({
    id: row.id,
    license_plate_text: row.license_plate_text,
    image_url: row.image_url,
    latitude: row.latitude,
    longitude: row.longitude,
    last_seen: row.last_seen,
    created_at: row.created_at,
  })) as Vehicle[]

  return mappedVehicles
}

export async function getMostRecentVehicles(limit?: number) {
  try {
    const result = await sql`
  SELECT * FROM vehicles ORDER BY created_at DESC LIMIT ${limit || 10};`

    return result.rows
  } catch (error) {
    console.error('Error getting most recent vehicles', error)
    return []
  }
}
