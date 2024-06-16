'use server'

import { generateRandomCoordinate, generateRandomDatatime } from '@/lib/utils'
import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'

export async function writeMetadataToVehiclesTable({
  licensePlateText,
  imageUrl,
}: {
  licensePlateText: string
  imageUrl: string
}) {
  console.log('Inserting row into vehicles table...')

  const { latitude, longitude } = generateRandomCoordinate()
  const lastSeen = generateRandomDatatime()
  try {
    const result = await sql`
  INSERT INTO vehicles (license_plate_text, image_url, latitude, longitude, last_seen) VALUES (${licensePlateText}, ${imageUrl}, ${latitude}, ${longitude}, ${lastSeen} );`

    return NextResponse.json({ result }, { status: 200 })
  } catch (error) {
    console.error('Error inserting row into vehicles table', error)
    return NextResponse.json({ error }, { status: 500 })
  }
}
