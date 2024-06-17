import { Photo } from './Photo'
import { Vehicle } from '@/lib/types'

export function PhotoGrid({ vehicles }: { vehicles: Vehicle[] }) {
  if (vehicles.length === 0)
    return <p className="text-3xl text-orange-500">No results found</p>

  return (
    <ul className="flex flex-wrap w-[90%] m-auto gap-2">
      {!!vehicles &&
        vehicles.map((vehicle, idx) => (
          <li className="max-h-max flex-grow list-none" key={idx}>
            <Photo
              key={idx}
              src={vehicle.image_url}
              alt={`Vehicle with license plate ${vehicle.license_plate_text}`}
            />
          </li>
        ))}
      <li className="flex-auto"></li>
    </ul>
  )
}
