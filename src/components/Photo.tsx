import { Vehicle } from '@/lib/types'
import Image from 'next/image'
import { PhotoCaption } from './PhotoCaption'
import { cn } from '@/lib/utils'

export function Photo({
  src,
  alt,
  width,
  height,
  onClick,
  captionInfo,
  className,
}: {
  src: string
  alt: string
  width?: number
  height?: number
  onClick?: () => void
  captionInfo?: Vehicle
  className?: string
}) {
  const vehicleInfo = captionInfo
  return (
    <div className="max-w-fit m-auto relative">
      <Image
        src={src}
        alt={alt}
        sizes={`(max-width: 360px) 240px, (max-width: 720px) 540px, 540px`}
        width={width}
        height={height}
        className={cn(
          'max-h-full min-w-full object-cover overflow-hidden align-bottom',
          className
        )}
        onClick={onClick}
      />
      <PhotoCaption vehicleInfo={vehicleInfo} />
    </div>
  )
}
