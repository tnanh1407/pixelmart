import ImagePreviewDialog from '@/components/ui/image-preview-dialog'

interface ImagePreviewProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  src?: string
  alt?: string
}

export default function ImagePreview({
  open,
  onOpenChange,
  src,
  alt,
}: ImagePreviewProps) {
  return (
    <ImagePreviewDialog
      open={open}
      onOpenChange={onOpenChange}
      src={src}
      alt={alt}
    />
  )
}
