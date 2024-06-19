'use server'

import { put, head, BlobNotFoundError } from '@vercel/blob'
import { NextResponse } from 'next/server'

// A server action responsible for uploading a single image to the Blob Storage
export async function uploadImage({
  filename,
  body,
  checkExists = true,
}: {
  filename: string
  body: Blob
  checkExists?: boolean
}) {
  try {
    // We can skip uploading if the file already exists
    if (checkExists && (await doesFileExist(filename))) {
      return new Response(null, { status: 204 })
    }

    // Upload without a random suffix to make it easy when checking for existence
    const blob = await put(filename, body, {
      access: 'public',
      addRandomSuffix: false,
    })

    return NextResponse.json({ blob }, { status: 200 })
  } catch (error) {
    console.error('error uploading image', error)
    return NextResponse.json({ error }, { status: 500 })
  }
}

// Checks if a file already exists in the Blob Storage by it's filename
async function doesFileExist(filename: string): Promise<boolean> {
  try {
    const bucketUrl = process.env.BLOB_BUCKET_URL
    await head(bucketUrl + filename)

    return true
  } catch (error) {
    if (error instanceof BlobNotFoundError) return false
    throw error
  }
}
