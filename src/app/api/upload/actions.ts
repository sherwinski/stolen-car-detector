'use server'

import { uploadImage } from '@/app/api/image/actions'
import { getTextFromImage } from '@/lib/utils'
import { writeMetadataToVehiclesTable } from '../vehicle/actions'

export async function uploadAndProcessFile(formData: FormData) {
  try {
    const { name: filename } = formData.get('file') as File
    const fileData = formData.get('file') as File

    const uploadedImage = await uploadImage({
      filename: filename,
      body: fileData,
      checkExists: false,
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
      result = {
        warning: filename,
      }
      // if there was an error uploading the image, log the error
    } else {
      result = { error: filename }
    }

    // log results based on successes, skips, and failures when seeding the database
    if (result.success) {
      console.log('Image uploaded successfully:', result.success)
    } else if (result.warning) {
      console.log('Image skipped:', result.warning)
    } else if (result.error) {
      console.log('Error uploading image:', result.error)
    }
  } catch (error) {
    console.error('An error occurred while uploading to the database:', error)
  }
}
