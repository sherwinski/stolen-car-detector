import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'
import { uploadImage } from '../../image/action'

const directoryPath = 'src/app/api/db/seed/vehicle_images'

function getRandomValue(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function generateRandomCoordinate() {
  const latMin = 37.224
  const latMax = 38.1139
  const lonMin = -123.017
  const lonMax = -121.517

  const latitude = getRandomValue(latMin, latMax)
  const longitude = getRandomValue(lonMin, lonMax)

  return { latitude, longitude }
}

export async function GET(request: Request) {
  try {
    const files = await fs.promises.readdir(directoryPath)

    const subFiles = files.slice(0, 1) // TODO: remove me

    await Promise.all(
      subFiles.map(async (file) => {
        // TODO: remove me
        // files.map(async (file) => {
        const filePath = path.join(directoryPath, file)

        const fileContents = await fs.promises.readFile(filePath)

        const blob = new Blob([fileContents])
        const uploadedImage = await uploadImage({
          filename: 'test4-' + file,
          body: blob,
        })

        if (uploadedImage) {
          const data = await uploadedImage.json()
          console.log('uploadedImage', data)
        }
      })
    )

    return NextResponse.json({ subFiles }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
