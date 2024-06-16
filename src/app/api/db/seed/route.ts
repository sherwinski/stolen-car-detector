import fs from 'fs'
import path from 'path'

import { NextResponse } from 'next/server'

import { uploadImage } from '@/app/api/image/action' // TODO: change to 'actions'
import getOcrData from '@/lib/roboflow'
import { writeMetadataToVehiclesTable } from '@/app/api/vehicle/actions'

const directoryPath = 'src/app/api/db/seed/vehicle_images'
let count = 7 // TODO: remove me

async function readFilesFromDirectory(directoryPath: string) {
  return await fs.promises.readdir(directoryPath)
}

async function readFileData(filePath: string) {
  return await fs.promises.readFile(filePath)
}

async function uploadFile({
  fileData,
  filename,
}: {
  fileData: Buffer
  filename: string
}) {
  const blob = new Blob([fileData])
  return await uploadImage({
    filename: `test${count++}-` + filename, // TODO: remove 'test' prefix
    body: blob,
  })
}

async function getTextFromImage({ fileData }: { fileData: Buffer }) {
  const OcrData = await (await getOcrData({ fileData })).json()
  return OcrData.result.replace(/\s/g, '')
}

/**
 * Exposes a GET endpoint at /api/db/seed
 *
 * Loops over all image files in the vehicle_images directory, uploading each
 * to blog storage, extracting OCR data from the image using Roboflow, and
 * writing the metadata to the Postgres `vehicles` table.
 * */
export async function GET() {
  try {
    const files = await readFilesFromDirectory(directoryPath)

    const subFiles = files.slice(0, 3) // TODO: remove me

    const results = await Promise.all(
      // subFiles.map(async (filename) => {
      // TODO: remove me
      files.map(async (filename) => {
        const filePath = path.join(directoryPath, filename)
        const fileData = await readFileData(filePath)

        const uploadedImageBlob = await uploadFile({ fileData, filename })

        if (uploadedImageBlob.status === 200) {
          const uploadedImageUrl = (await uploadedImageBlob.json()).blob.url

          const processedOcrText = await getTextFromImage({ fileData })

          await (
            await writeMetadataToVehiclesTable({
              licensePlateText: processedOcrText,
              imageUrl: uploadedImageUrl,
            })
          ).json()

          return { success: `Uploaded and processed: ${filePath}` }
        } else if (uploadedImageBlob.status === 204) {
          return { warning: `Skipped uploading: ${filePath}` }
        } else {
          return { error: `There was an issue when uploading: ${filePath}` }
        }
      })
    )

    return NextResponse.json({ results }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
