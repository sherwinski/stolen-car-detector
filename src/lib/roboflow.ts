import { NextResponse } from 'next/server'

// Utilizing Roboflow's DocTR model, we can extract text from images
export default async function getOcrData({ fileData }: { fileData: Buffer }) {
  try {
    const ROBOFLOW_API_KEY = process.env.ROBOFLOW_API_KEY

    // Roboflow's OCR API requires the image to be base64 encoded
    const fileDataBase64 = fileData.toString('base64')

    const inferenceResponse = await fetch(
      `https://infer.roboflow.com/doctr/ocr?api_key=${ROBOFLOW_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: {
            value: fileDataBase64,
            type: 'base64',
          },
        }),
      }
    )
    const inferenceData = await inferenceResponse.json()
    return inferenceData
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
