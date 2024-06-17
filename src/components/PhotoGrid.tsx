import type Image from 'next/image'
import { Photo } from './Photo'
import { Vehicle } from '@/lib/types'

export function PhotoGrid({ vehicles }: { vehicles: Vehicle[] }) {
  console.log('vehicles', vehicles)
  return (
    <ul className="flex flex-wrap w-[90%] m-auto gap-2">
      {vehicles.map((vehicle, idx) => (
        // <li className="h-[40vh] flex-grow list-none">
        <li className="max-h-max flex-grow list-none">
          <Photo
            key={idx}
            src={vehicle.image_url}
            alt={`Vehicle with license plate ${vehicle.license_plate_text}`}
          />
        </li>
      ))}
      {/* <li className="flex-grow-[18]"></li> */}
      <li className="flex-auto"></li>
    </ul>
  )
}
