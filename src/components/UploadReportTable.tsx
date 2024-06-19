'use client'

import { useEffect, useState } from 'react'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { getMostRecentVehicles } from '@/app/api/vehicle/actions'
import { Vehicle } from '@/lib/types'
import MapLink from './MapLink'
import { PhotoLightbox } from './PhotoLightbox'
import { Photo } from './Photo'

export function UploadReportTable() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxVehicle, setLightboxVehicle] = useState<Vehicle | null>(null)
  const [recentVehicles, setRecentVehicles] = useState<Vehicle[]>([])

  useEffect(() => {
    const getVehicles = async () => {
      const vehicles = (await getMostRecentVehicles()) as Vehicle[]
      setRecentVehicles(vehicles)
    }
    getVehicles()
  }, [])

  return (
    <div className="border border-gray-200 rounded-lg p-6 dark:border-gray-800">
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
      <h2 className="text-2xl font-bold mb-4">Uploaded Files</h2>
      <div className="overflow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File Name</TableHead>
              <TableHead>Last Seen</TableHead>
              <TableHead>Last Location</TableHead>
              <TableHead>Upload Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentVehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell>
                  <a
                    onClick={() => {
                      setLightboxVehicle(vehicle)
                      setLightboxOpen(true)
                    }}
                    className="hover:text-orange-500"
                  >
                    {vehicle.image_url.split('/').slice(-1).join('/')}
                  </a>
                </TableCell>
                <TableCell>{vehicle.last_seen.toLocaleString()}</TableCell>
                <TableCell>
                  <MapLink
                    latitude={vehicle.latitude}
                    longitude={vehicle.longitude}
                  />{' '}
                </TableCell>
                <TableCell>{vehicle.created_at.toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
