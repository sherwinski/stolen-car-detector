'use server'

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

    console.log('\tSuccessfully got vehicle by license plate\n', result)
    return result.rows
  } catch (error) {
    console.error('Error getting vehicle by license plate', error)
    return []
  }
}
