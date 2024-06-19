'use server'

import { uploadImage } from '@/app/api/image/actions'
import { Vehicle } from '@/lib/types'
import { getTextFromImage } from '@/lib/utils'
import { Stream } from 'stream'
import { writeMetadataToVehiclesTable } from '../vehicle/actions'
import { revalidatePath } from 'next/cache'
import { NextRequest } from 'next/server'
import { redirect } from 'next/navigation'

// export async function uploadAndProcessFile({
//   file,
//   last_seen,
//   latitude,
//   longitude,
// }: Pick<Vehicle, 'latitude' | 'longitude' | 'last_seen'> & {
//   file: FileList
// }) {
export async function uploadAndProcessFile(formData: FormData) {
  try {
    const { name: filename } = formData.get('file') as File
    const fileData = formData.get('file') as File

    console.log('\nLets start: ', filename, fileData)
    // console.log('file: ', file, typeof file)
    // const fileStream = file?.item(0)?.stream()
    // console.log('file: ', file, typeof file)
    // const results = await Promise.all(
    //   files.map(async (filename) => {
    //     console.log('Processing file: ', filename)

    //     const filePath = path.join(directoryPath, filename)
    //     const fileData = await readFileData(filePath)

    //     console.log('\tUploading file: ', filename)

    console.log('\n\nlet try uploading')
    const uploadedImage = await uploadImage({
      filename: filename,
      body: fileData,
      //   checkExists: false,
    })

    let result
    // if the image was uploaded successfully, extract the text from the image
    if (uploadedImage.status === 200) {
      const uploadedImageUrl = (await uploadedImage.json()).blob.url
      console.log(
        '\tUpload successful, getting text from image: ',
        uploadedImageUrl
      )

      const fileBuffer = Buffer.from(await fileData.arrayBuffer())
      const processedOcrText = await getTextFromImage({ fileData: fileBuffer })
      console.log('\tText extracted: ', processedOcrText)

      await writeMetadataToVehiclesTable({
        licensePlateText: processedOcrText,
        imageUrl: uploadedImageUrl,
      })

      result = {
        success: filename,
      }
      // if the image already exists, skip the image
    } else if (uploadedImage.status === 204) {
      console.log('\n\n skipped')

      result = {
        warning: filename,
      }
      // if there was an error uploading the image, log the error
    } else {
      console.log('\n\n errored')

      result = { error: filename }
    }
    //   })
    // )

    // log results based on successes, skips, and failures when seeding the database

    if (result.success) {
      console.log('Image uploaded successfully:', result.success)
    } else if (result.warning) {
      console.log('Image skipped:', result.warning)
    } else if (result.error) {
      console.log('Error uploading image:', result.error)
    }
    // const addedImages = results.filter((result) => result.success)
    // const skippedImages = results.filter((result) => result.warning)
    // const erroredImages = results.filter((result) => result.error)
    // console.log('\tNew images add:', addedImages.length, '\n')

    // console.log('\tExisting images skipped:', skippedImages.length)
    // skippedImages.map((result) => console.log('\t\t', result.warning))
    // console.log('\n')
    // console.log('\tImages not added due to error:', erroredImages.length)
    // erroredImages.map((result) => console.log('\t\t', result.error))
    // console.log('\n')

    // const path = request.nextUrl.searchParams.get('path')
  } catch (error) {
    console.error('An error occurred while uploading to the database:', error)
  } finally {
    console.log('revalidating and redirecting')
    revalidatePath('/upload')
    redirect('/upload')
  }
}
