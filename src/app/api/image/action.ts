'use server'

import { put, head, BlobNotFoundError } from '@vercel/blob'
import { NextResponse } from 'next/server'

export async function uploadImage({
  filename,
  body,
}: {
  filename: string
  body: any
}) {
  try {
    if (await checkFileExists(filename)) {
      console.log('file already exists, skipping upload')
      return
    }

    const blob = await put(filename, body, {
      access: 'public',
      addRandomSuffix: false,
    })

    return NextResponse.json({ blob }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}

async function checkFileExists(filename: string): Promise<boolean> {
  try {
    const bucketUrl = process.env.BLOB_BUCKET_URL
    await head(bucketUrl + filename)

    return true
  } catch (error) {
    if (error instanceof BlobNotFoundError) return false
    throw error
  }
}

// export async function POST(request: Request): Promise<NextResponse> {
//   const { searchParams } = new URL(request.url)
//   const filename = searchParams.get('filename')

//   const blob = await put(filename, request.body, {
//     access: 'public',
//   })

//   return NextResponse.json(blob)
// }
