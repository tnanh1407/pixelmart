import { X } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'

interface ImagePreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  src?: string
  alt?: string
}

export default function ImagePreviewDialog({ open, onOpenChange, src, alt }: ImagePreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="
          !fixed !inset-0 !left-0 !top-0
          !translate-x-0 !translate-y-0
          !w-screen !h-screen !max-w-none
          !rounded-none !border-0
          !bg-black/80 !p-0 !shadow-none !ring-0
          !grid-cols-1 !flex !items-center !justify-center
          !duration-0
        "
      >
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 z-50 h-10 w-10 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {src && (
          <img
            src={src}
            alt={alt || ''}
            className="max-w-[90vw] max-h-[90vh] object-contain"
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
