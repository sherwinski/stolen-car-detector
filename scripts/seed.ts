import fs from 'fs'
import path from 'path'

import { createVehiclesTable } from './init'
import { uploadImage } from '@/app/api/image/actions'
import getOcrData from '@/lib/roboflow'
import { writeMetadataToVehiclesTable } from '@/app/api/vehicle/actions'

const directoryPath = 'scripts/vehicle_images'

// get all files from the directory that contains the seed images
async function readFilesFromDirectory(directoryPath: string) {
  return await fs.promises.readdir(directoryPath)
}

// read the data from the file as a Buffer
async function readFileData(filePath: string) {
  return await fs.promises.readFile(filePath)
}

// upload the file to the Blob Storage
async function uploadFile({
  fileData,
  filename,
}: {
  fileData: Buffer
  filename: string
}) {
  const fileDataAsBlob = new Blob([fileData])
  return await uploadImage({
    filename: filename,
    body: fileDataAsBlob,
  })
}

// extract text from the image using Roboflow Inference
async function getTextFromImage({ fileData }: { fileData: Buffer }) {
  const OcrData = await getOcrData({ fileData })

  // To help with fuzzy searching, we remove all white space from the text.
  // Note: There is a chance that text cannot be extracted so we will add a fallback.
  const textWithoutWhiteSpace = OcrData.result?.replace(/\s/g, '') || ''
  return textWithoutWhiteSpace
}

/**
 * Loops over all image files in the vehicle_images directory, uploading each
 * to blog storage, extracting OCR data from the image using Roboflow
 * Inference, and writing the metadata to the Postgres `vehicles` table.
 * */
async function seedDatabases() {
  console.log('Seeding databases...\n')

  try {
    const files = await readFilesFromDirectory(directoryPath)

    const results = await Promise.all(
      files.map(async (filename) => {
        console.log('Processing file: ', filename)

        const filePath = path.join(directoryPath, filename)
        const fileData = await readFileData(filePath)

        console.log('\tUploading file: ', filename)
        const uploadedImageBlob = await uploadFile({ fileData, filename })

        // if the image was uploaded successfully, extract the text from the image
        if (uploadedImageBlob.status === 200) {
          const uploadedImageUrl = (await uploadedImageBlob.json()).blob.url
          console.log(
            '\tUpload successful, getting text from image: ',
            uploadedImageUrl
          )

          const processedOcrText = await getTextFromImage({ fileData })
          console.log('\tText extracted: ', processedOcrText)

          await writeMetadataToVehiclesTable({
            licensePlateText: processedOcrText,
            imageUrl: uploadedImageUrl,
          })

          return {
            success: filePath,
          }
          // if the image already exists, skip the image
        } else if (uploadedImageBlob.status === 204) {
          return {
            warning: filePath,
          }
          // if there was an error uploading the image, log the error
        } else {
          return { error: filePath }
        }
      })
    )

    // log resultes based on successes, skips, and failures when seeding the database
    const addedImages = results.filter((result) => result.success)
    const skippedImages = results.filter((result) => result.warning)
    const erroredImages = results.filter((result) => result.error)

    console.log('\nFinished seeding databases\n')
    console.log('\tNew images add:', addedImages.length, '\n')

    console.log('\tExisting images skipped:', skippedImages.length)
    skippedImages.map((result) => console.log('\t\t', result.warning))
    console.log('\n')

    console.log('\tImages not added due to error:', erroredImages.length)
    erroredImages.map((result) => console.log('\t\t', result.error))
    console.log('\n')
  } catch (error) {
    console.error('An error occurred while seeding the database:', error)
  }
}

async function createTables() {
  console.log('Creating tables...')
  await createVehiclesTable()
  console.log('All tables created.\n\n')
}

async function main() {
  await createTables()
  await seedDatabases()
}

main().catch((err) => {
  console.error('An error occurred while attempting to seed the database:', err)
})
