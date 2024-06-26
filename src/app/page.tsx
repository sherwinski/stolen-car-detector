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
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        const foundVehicles = await searchForVehicles(licensePlateText)
        setVehicles(foundVehicles)
        setIsSearched(true)
      }}
    >
      <div className="flex flex-col pt-12 min-h-screen justify-between gap-12">
        <div className="flex flex-col gap-12 items-center justify-between">
          <div>
            <p className="text-4xl text-slate-300">
              Stolen Vehicle Search Database
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <Label htmlFor="licensePlate" className="text-lg text-slate-300">
              Enter a License Plate
            </Label>
            <div className="flex gap-4">
              <Input
                id="licensePlate"
                type="text"
                placeholder="Plate Number"
                value={licensePlateText}
                onChange={(e) => setLicensePlateText(e.target.value)}
              />
              <Button type="submit">Search</Button>
            </div>
          </div>
        </div>

        {isSearched && (
          <div className="flex flex-col gap-8 w-full items-center">
            <PhotoGrid vehicles={vehicles} />
          </div>
        )}

        <Footer />
      </div>
    </form>
  )
}
