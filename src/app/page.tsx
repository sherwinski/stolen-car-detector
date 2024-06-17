'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import type { Vehicle } from '@/lib/types'
import { PhotoGrid } from '@/components/PhotoGrid'
import { Footer } from '@/components/Footer'
import { searchForVehicles } from './api/vehicle/actions'

export default function Home() {
  const [licensePlateText, setLicensePlateText] = useState<string>('')
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isSearched, setIsSearched] = useState<boolean>(false)

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 gap-24">
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
          <Button
            onClick={async () => {
              const foundVehicles = await searchForVehicles(licensePlateText)
              setVehicles(foundVehicles)
              setIsSearched(true)
            }}
          >
            Search
          </Button>
        </div>
      </div>

      {isSearched && (
        <div className="flex flex-col gap-8 w-full items-center">
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

      <Footer />
    </main>
  )
}
