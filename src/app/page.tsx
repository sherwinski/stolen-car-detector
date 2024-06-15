'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
export default function Home() {
  const [licensePlate, setLicensePlate] = useState<string>('')

  return (
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
            value={licensePlate}
            onChange={(e) => setLicensePlate(e.target.value)}
          />
          <Button>Search</Button>
        </div>
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        Made with Roboflow 🤖
      </div>
    </main>
  )
}
