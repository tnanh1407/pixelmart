import { Copy } from 'lucide-react'
import { toast } from 'sonner'

interface CopyButtonProps {
  text: string
}

export default function CopyButton({ text }: CopyButtonProps) {
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text)
        toast.success('Đã copy ID')
      }}
      className="shrink-0 p-1 hover:bg-gray-100 rounded transition-colors cursor-pointer"
      title="Copy ID"
    >
      <Copy size={12} />
    </button>
  )
}
