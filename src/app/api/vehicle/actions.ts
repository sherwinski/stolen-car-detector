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
