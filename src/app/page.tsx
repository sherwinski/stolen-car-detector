'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { getVehicleByLicensePlate } from './api/vehicle/actions'
import type { Vehicle } from '@/lib/types'
import { Photo } from '@/components/Photo'
import { PhotoGrid } from '@/components/PhotoGrid'

export default function Home() {
  const [licensePlateText, setLicensePlateText] = useState<string>('')
  const [vehicles, setVehicles] = useState<Vehicle[]>([])

  const searchForVehicles = async () => {
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
    setVehicles(mappedVehicles)
  }

  return (
    // <main className="flex min-h-screen flex-col items-center justify-between p-24">
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <p className="text-4xl">Stolen Vehicle Search Database</p>
      </div>

      <div className="flex flex-col gap-4">
        <Label htmlFor="licensePlate" className="text-lg">
          Search for a License Plate
        </Label>
        <div className="flex gap-4">
          <Input
            id="licensePlate"
            type="text"
            placeholder="Plate Number"
            value={licensePlateText}
            onChange={(e) => setLicensePlateText(e.target.value)}
          />
          <Button onClick={searchForVehicles}>Search</Button>
        </div>
      </div>

      {vehicles.length > 0 && (
        <div className="flex flex-col gap-8 w-full">
          <p className="text-2xl mt-8 items-center">Results</p>
          <PhotoGrid vehicles={vehicles} />
          {/* <ul className="mt-4">
            {vehicles.map((vehicle) => (
              <li key={vehicle.license_plate_text}>
                <p>{vehicle.license_plate_text}</p>
                <p>{vehicle.last_seen.toString()}</p>
                <p>{vehicle.latitude}</p>
                <p>{vehicle.longitude}</p>
                <Photo
                  src={vehicle.image_url}
                  alt={`Vehicle with license plate ${vehicle.license_plate_text}`}
                />
              </li>
            ))}
          </ul> */}
        </div>
      )}

      {vehicles.length === 0 && <p className="text-3xl">No results found</p>}
      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        Made with Roboflow 🤖
      </div>
    </main>
  )
}
