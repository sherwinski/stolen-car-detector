import { Vehicle } from '@/lib/types'
import MapLink from './MapLink'

export function PhotoCaption({ vehicleInfo }: { vehicleInfo?: Vehicle }) {
  if (!vehicleInfo) return <></>
  return (
    <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-75">
      <div className="text-slate-400 text-sm flex flex-col gap-1 mt-3 content-center">
        <p className="text-center">
          Extracted License Plate Text:{' '}
          <span className="text-slate-300">
            {vehicleInfo?.license_plate_text}
          </span>
        </p>

        <p className="text-center">
          Last seen date and time:{' '}
          <span className="text-slate-300">
            {vehicleInfo?.last_seen.toLocaleString()}
          </span>
        </p>

        <p className="text-center">
          Last seen location:{' '}
          <MapLink
            latitude={vehicleInfo.latitude}
            longitude={vehicleInfo.longitude}
          />
        </p>
      </div>
    </div>
  )
}
