import * as React from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UploadForm } from './UploadForm'

export function UploadCard() {
  return (
    <Card className="w-[350px] flex flex-col gap-4">
      <CardHeader>
        <CardTitle>Upload an Image</CardTitle>
      </CardHeader>
      <CardContent>
        <UploadForm />
      </CardContent>
    </Card>
  )
}
