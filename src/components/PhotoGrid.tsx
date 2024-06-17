import { useState } from 'react'
import { Photo } from './Photo'
import { Vehicle } from '@/lib/types'
import { PhotoLightbox } from './PhotoLightbox'

export function PhotoGrid({ vehicles }: { vehicles: Vehicle[] }) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxVehicle, setLightboxVehicle] = useState<Vehicle | null>(null)

  if (vehicles.length === 0)
    return <p className="text-3xl text-orange-500">No results found</p>

  return (
    <>
      {/* Render a lightbox of the clicked-on image */}
      {lightboxOpen && lightboxVehicle && (
        <PhotoLightbox lightboxOpen setLightboxOpen={setLightboxOpen}>
          <Photo
            src={lightboxVehicle?.image_url || ''}
            alt={`lightboxVehicle with license plate ${lightboxVehicle?.license_plate_text}`}
            width={580}
            height={580}
            captionInfo={lightboxVehicle}
          />
        </PhotoLightbox>
      )}
      <ul className="flex flex-wrap gap-2">
        {!!vehicles &&
          vehicles.map((vehicle, idx) => (
            <li className="max-h-max flex-grow list-none" key={idx}>
              <Photo
                key={idx}
                src={vehicle.image_url}
                alt={`Vehicle with license plate ${vehicle.license_plate_text}`}
                width={240}
                height={240}
                onClick={() => {
                  setLightboxVehicle(vehicle)
                  setLightboxOpen(true)
                }}
              />
            </li>
          ))}
        <li className="flex flex-grow-[15]"></li>
      </ul>
    </>
  )
}
