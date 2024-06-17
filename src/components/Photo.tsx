import Image from 'next/image'

export function Photo({ src, alt }: { src: string; alt: string }) {
  return (
    // <div className="max-w-screen-sm max-w-fit">
    <div className="max-w-fit m-auto">
      <Image
        src={src}
        alt={alt}
        sizes={`(max-width: 360px) 240px, (max-width: 720px) 540px, 540px`}
        // fill={true}
        width={240}
        height={240}
        // className="max-h-full min-w-full object-cover align-bottom"
        className="max-h-full min-w-full object-contain align-bottom"
      />
    </div>
  )
}
