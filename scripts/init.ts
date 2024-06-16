import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'

// Initialize the database with a table for vehicles
export async function createVehiclesTable() {
  console.log('\tCreating vehicle table...\n')
  try {
    await sql`CREATE EXTENSION pg_trgm;`
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`

    const result = await sql`CREATE TABLE IF NOT EXISTS vehicles (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        license_plate_text TEXT,
        image_url TEXT NOT NULL,
        latitude DECIMAL,
        longitude DECIMAL,
        last_seen TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW()
        )`

    console.log('\tCreated "vehicle" table\n')
    return NextResponse.json({ result }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
