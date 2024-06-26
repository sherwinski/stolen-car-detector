import { UploadCard } from '@/components/UploadCard'
import { UploadReportTable } from '@/components/UploadReportTable'

export default function UploadPage() {
  return (
    <div className="flex flex-col gap-12 items-center py-8">
      <UploadCard />
      <UploadReportTable />
    </div>
  )
}
