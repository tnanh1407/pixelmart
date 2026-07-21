import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { 
  Search, ChevronLeft, ChevronRight, 
  AlertCircle, AlertTriangle, CheckCircle, Info, 
  Package, Copy, Check 
} from 'lucide-react'
import { useState, type ReactNode } from 'react'

/* PageContainer */
export function PageContainer({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}

/* PageHeader */
export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

/* SearchToolbar */
export function SearchToolbar({ placeholder, value, onChange, onSearch }: {
  placeholder?: string; value: string; onChange: (v: string) => void; onSearch: () => void
}) {
  return (
    <div className="flex gap-2 mb-4">
      <Input
        placeholder={placeholder || 'Tìm kiếm...'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        className="max-w-sm"
      />
      <Button variant="outline" onClick={onSearch}><Search size={16} /></Button>
    </div>
  )
}

/* Pagination */
export function Pagination({ page, totalPages, onPageChange, total }: {
  page: number; totalPages: number; onPageChange: (p: number) => void; total?: number
}) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-between px-6 py-3 border-t">
      <span className="text-sm text-muted-foreground">
        Trang {page}/{totalPages} {total ? `(${total} mục)` : ''}
      </span>
      <div className="flex gap-1">
        <Button variant="outline" size="sm" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
          <ChevronLeft size={14} />
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <Button key={p} variant={p === page ? 'default' : 'outline'} size="sm" onClick={() => onPageChange(p)}>
            {p}
          </Button>
        ))}
        <Button variant="outline" size="sm" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
          <ChevronRight size={14} />
        </Button>
      </div>
    </div>
  )
}

/* ConfirmDialog */
export function ConfirmDialog({ open, onOpenChange, title, description, onConfirm }: {
  open: boolean; onOpenChange: (open: boolean) => void; title: string; description?: string; onConfirm: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
          <Button onClick={onConfirm}>Xác nhận</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* DeleteDialog */
export function DeleteDialog({ open, onOpenChange, entityLabel, onConfirm }: {
  open: boolean; onOpenChange: (open: boolean) => void; entityLabel: string; onConfirm: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xóa {entityLabel}?</DialogTitle>
          <DialogDescription>Hành động này không thể hoàn tác.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
          <Button variant="destructive" onClick={onConfirm}>Xóa</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* ImagePreview */
export function ImagePreview({ open, onOpenChange, src, alt }: {
  open: boolean; onOpenChange: (open: boolean) => void; src?: string; alt?: string
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0">
        {src && <img src={src} alt={alt || ''} className="w-full rounded-lg" />}
      </DialogContent>
    </Dialog>
  )
}

/* LoadingState */
export function LoadingState({ className = 'min-h-[400px]', type }: { className?: string; type?: string; rows?: number }) {
  return (
    <div className={`space-y-4 p-4 ${className}`}>
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-64 w-full rounded-xl" />
      <Skeleton className="h-32 w-full rounded-xl" />
    </div>
  )
}

/* EmptyState */
export function EmptyState({ icon: Icon, title, description }: {
  icon?: any; title?: string; description?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
      {Icon ? <Icon size={48} className="opacity-30 mb-3" /> : <Package size={48} className="opacity-30 mb-3" />}
      <h3 className="text-lg font-semibold">{title || 'Không có dữ liệu'}</h3>
      {description && <p className="text-sm mt-1">{description}</p>}
    </div>
  )
}

/* ErrorState */
export function ErrorState({ message = 'Đã có lỗi xảy ra' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
      <AlertCircle size={48} className="text-red-400 mb-3" />
      <h3 className="text-lg font-semibold">Lỗi</h3>
      <p className="text-sm mt-1">{message}</p>
    </div>
  )
}

/* SectionCard */
export function SectionCard({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div>
      {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
      <div className="rounded-xl border bg-card p-6">{children}</div>
    </div>
  )
}

/* CopyButton */
export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
      className="text-muted-foreground hover:text-foreground shrink-0 cursor-pointer">
      {copied ? <Check size={12} /> : <Copy size={12} />}
    </button>
  )
}

/* DetailCard */
export function DetailCard({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border bg-card">
      {title && <div className="px-6 py-4 border-b font-semibold">{title}</div>}
      <div className="p-6">{children}</div>
    </div>
  )
}

/* DetailField */
export function DetailField({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b last:border-b-0">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      <span className="text-sm text-right break-all font-medium">{value || '\u2014'}</span>
    </div>
  )
}
