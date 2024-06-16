import { sql } from '@vercel/postgres'
import { list, del } from '@vercel/blob'
async function main() {
  try {
    console.log('Deleting vehicles table...')
    await sql`DROP TABLE IF EXISTS vehicles`
    console.log('Deleted vehicles table\n')

    console.log('Deleting all items from Blob Storage...')
    const blobs = await (await list()).blobs
    await Promise.all(
      blobs.map((blob) => {
        console.log('\tDeleting blob at: ', blob.url)
        del(blob.url)
      })
    )
    console.log('Successfully deleted all items from Blob Storage')
  } catch (error) {
    console.error('Error when tearing down databases', error)
  }
}

main().catch((err) => {
  console.error('An error occurred while attempting to seed the database:', err)
})
