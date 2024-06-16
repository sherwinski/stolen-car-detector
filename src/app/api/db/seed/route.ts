import fs from 'fs'
import path from 'path'

import { NextResponse } from 'next/server'

import { uploadImage } from '@/app/api/image/action' // TODO: change to 'actions'
import getOcrData from '@/lib/roboflow'
import { writeMetadataToVehiclesTable } from '@/app/api/vehicle/actions'

const directoryPath = 'src/app/api/db/seed/vehicle_images'

export async function GET() {
  try {
    const files = await fs.promises.readdir(directoryPath)

    const subFiles = files.slice(0, 1) // TODO: remove me

    await Promise.all(
      subFiles.map(async (file) => {
        // TODO: remove me
        // files.map(async (file) => {
        const filePath = path.join(directoryPath, file)

        const fileData = await fs.promises.readFile(filePath)
        const blob = new Blob([fileData])
        const uploadedImageBlob = await uploadImage({
          filename: 'test00-' + file, // TODO: remove 'test' prefix
          body: blob,
        })

        if (uploadedImageBlob.status === 200) {
          const data = await uploadedImageBlob.json()
          const uploadedImageUrl = data.blob.url

          console.log(
            'upload successful, getting ocr data...',
            uploadedImageUrl
          )
          const { OcrData } = await (await getOcrData({ fileData })).json()

          const processedOcrText = OcrData.result.replace(/\s/g, '')

          await writeMetadataToVehiclesTable({
            licensePlateText: processedOcrText,
            imageUrl: uploadedImageUrl,
          })
        }
      })
    )

    return NextResponse.json({ subFiles }, { status: 200 })
  } catch (error) {
    console.error('error uploading image', error)
    return NextResponse.json({ error }, { status: 500 })
  }
}
