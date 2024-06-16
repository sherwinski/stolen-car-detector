import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'

// Initialize the database with a table for vehicles
export async function GET(request: Request) {
  console.log('Creating table...\n')
  try {
    const result = await sql`CREATE TABLE IF NOT EXISTS vehicles (
        id SERIAL PRIMARY KEY,
        license_plate TEXT,
        image_url TEXT NOT NULL,
        latitude DECIMAL,
        longitude DECIMAL,
        created_at TIMESTAMPTZ DEFAULT NOW()
        )`
    return NextResponse.json({ result }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
