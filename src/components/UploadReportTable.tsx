'use client'

import { useState, useMemo } from 'react'
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

export async function UploadReportTable() {
  // const [file, setFiles] = useState([])
  // const handleFileChange = (event) => {
  //   if (event.target.files) {
  //     setFiles(Array.from(event.target.files))
  //   }
  // }
  // const uploadedFiles = useMemo(() => {
  //   return files.slice(0, 10).map((file) => ({
  //     name: file.name,
  //     size: file.size,
  //     uploadDate: new Date().toLocaleString(),
  //   }))
  // }, [files])

  const recentVehicles = (await getMostRecentVehicles()) as Vehicle[]
  return (
    <div className="border border-gray-200 rounded-lg p-6 dark:border-gray-800 w-[80%]">
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
            {recentVehicles.map(
              ({
                id,
                image_url,
                last_seen,
                latitude,
                longitude,
                created_at,
              }) => (
                <TableRow key={id}>
                  <a href={image_url} className="hover:text-orange-500">
                    <TableCell>
                      {image_url.split('/').slice(-1).join('/')}
                    </TableCell>
                  </a>
                  <TableCell>{last_seen.toLocaleString()}</TableCell>
                  <TableCell>
                    <MapLink latitude={latitude} longitude={longitude} />{' '}
                  </TableCell>
                  <TableCell>{created_at.toLocaleDateString()}</TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
