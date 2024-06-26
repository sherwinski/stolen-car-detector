'use client'

import { useRouter } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'

import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useToast } from '@/components/ui/use-toast'
import { Input } from './ui/input'
import { uploadAndProcessFile } from '@/app/api/upload/actions'

const MAX_FILE_SIZE = 10000000
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]
const ACCEPT_IMAGE_TYPES_STRING = ACCEPTED_IMAGE_TYPES.join(',')

const FormSchema = z.object({
  file: z // courtesy of https://medium.com/@damien_16960/input-file-x-shadcn-x-zod-88f0472c2b81
    .custom<FileList>((value) => value instanceof FileList)
    .refine((fileList) => fileList[0], { message: 'A file is required.' })
    .refine((fileList) => fileList[0]?.size <= MAX_FILE_SIZE, {
      message: `Max file size is 10MB.`,
    })
    .refine((fileList) => ACCEPTED_IMAGE_TYPES.includes(fileList[0]?.type), {
      message: '.jpg, .jpeg, .png and .webp files are accepted.',
    }),
  lastSeenDate: z.date().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
})

export function UploadForm() {
  /*
    set less aggressive caching, since we will want to refresh the page after
    uploading to see the new image in the table
  */
  noStore()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const fileRef = form.register('file')

  const { toast } = useToast()
  const router = useRouter()

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const formData = new FormData()
    formData.append('file', data.file[0])

    formData.append('lastSeenDate', data.lastSeenDate?.toISOString() || '')
    formData.append('latitude', data.latitude || '')
    formData.append('longitude', data.longitude || '')

    toast({
      title: 'Image is uploading',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <p className="text-pretty">
            Please give it a moment to finish processing...
          </p>
        </pre>
      ),
    })

    await uploadAndProcessFile(formData)
    router.push('/')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <FormLabel htmlFor="file">File</FormLabel>
              <Input
                id="file"
                type="file"
                accept={ACCEPT_IMAGE_TYPES_STRING}
                {...fileRef}
              />
              <FormMessage />
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="lastSeenDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Last Seen</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-[240px] pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date('1900-01-01')
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                When was the photo of this vehicle taken?
              </FormDescription>
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-2 items-center">
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="latitude"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel htmlFor="latitude">Latitude</FormLabel>
                  <Input
                    type="text"
                    id="latitude"
                    placeholder="-123.244"
                    {...field}
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="longitude"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel htmlFor="longitude">Longitude</FormLabel>
                  <Input
                    type="text"
                    id="longitude"
                    placeholder="40.4"
                    {...field}
                  />
                </FormItem>
              )}
            />
          </div>
          <FormDescription>
            What were the coordinates from this photo?
          </FormDescription>
        </div>
        <div className="flex justify-center">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  )
}
