import { Dialog, DialogTrigger, DialogHeader, DialogContent } from './ui/dialog'

export function PhotoLightbox({
  lightboxOpen,
  setLightboxOpen,
  children,
}: {
  lightboxOpen: boolean
  setLightboxOpen: (isOpen: boolean) => void
  children?: React.ReactNode
}) {
  if (!children) return <></>
  return (
    <Dialog
      open={lightboxOpen}
      onOpenChange={(open) => setLightboxOpen(open)}
      modal
    >
      <DialogHeader>Hello</DialogHeader>

      <DialogContent>
        <DialogTrigger asChild>{children}</DialogTrigger>
      </DialogContent>
    </Dialog>
  )
}
