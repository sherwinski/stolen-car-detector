import { Vehicle } from '@/lib/types'

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
          <a
            href={`https://www.google.com/maps?q=${vehicleInfo?.latitude},${vehicleInfo?.longitude}`}
          >
            <span className=" text-blue-500">Maps</span>
          </a>
        </p>
      </div>
    </div>
  )
}
