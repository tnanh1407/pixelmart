import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { adminService } from '@/services/admin/admin.service'
import { toast } from 'sonner'
import Swal from 'sweetalert2'
import BannerTable from './BannerTable'
import BannerFormModal from './BannerFormModal'

export default function BannersPage() {
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'basic' | 'cms' | 'sections'>('basic')
  const [form, setForm] = useState({
    title: '',
    shortDescription: '',
    image: '',
    startDate: '',
    endDate: '',
    order: 0,
    content: '',
    durationInDays: '',
    author: '',
    categoryName: '',
    sapo: '',
    highlightsTitle: '',
    highlights: '',
    quote: '',
    quoteAuthor: '',
    contentSections: [] as Array<{ title: string; content: string }>,
  })
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const toastId = toast.loading('Đang tải ảnh lên...')
    try {
      const imageUrl = await adminService.uploadBannerImage(file)
      setForm((prev) => ({ ...prev, image: imageUrl }))
      toast.success('Tải ảnh lên thành công', { id: toastId })
    } catch (err: any) {
      console.error(err)
      toast.error(err?.response?.data?.message || 'Tải ảnh lên thất bại', { id: toastId })
    } finally {
      setIsUploading(false)
    }
  }

  const { data, isLoading } = useQuery({
    queryKey: ['admin-banners'],
    queryFn: () => adminService.getBanners({ page: 1, limit: 50 }),
    staleTime: 30 * 1000,
  })

  const createMutation = useMutation({
    mutationFn: (payload: any) => adminService.createBanner(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] })
      Swal.fire({
        title: 'Thành công!',
        text: 'Thêm mới banner thành công.',
        icon: 'success',
        confirmButtonColor: '#4f46e5',
        customClass: {
          popup: '!rounded-xl',
          confirmButton: '!rounded-lg !px-6',
        }
      })
      closeModal()
    },
    onError: () => Swal.fire({
      title: 'Thất bại!',
      text: 'Có lỗi xảy ra khi tạo banner.',
      icon: 'error',
      confirmButtonColor: '#4f46e5',
      customClass: {
        popup: '!rounded-xl',
        confirmButton: '!rounded-lg !px-6',
      }
    }),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      adminService.updateBanner(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] })
      Swal.fire({
        title: 'Thành công!',
        text: 'Cập nhật banner thành công.',
        icon: 'success',
        confirmButtonColor: '#4f46e5',
        customClass: {
          popup: '!rounded-xl',
          confirmButton: '!rounded-lg !px-6',
        }
      })
      closeModal()
    },
    onError: () => Swal.fire({
      title: 'Thất bại!',
      text: 'Có lỗi xảy ra khi cập nhật banner.',
      icon: 'error',
      confirmButtonColor: '#4f46e5',
      customClass: {
        popup: '!rounded-xl',
        confirmButton: '!rounded-lg !px-6',
      }
    }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteBanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] })
      Swal.fire({
        title: 'Đã xóa!',
        text: 'Xóa banner thành công.',
        icon: 'success',
        confirmButtonColor: '#4f46e5',
        customClass: {
          popup: '!rounded-xl',
          confirmButton: '!rounded-lg !px-6',
        }
      })
    },
    onError: () => Swal.fire({
      title: 'Thất bại!',
      text: 'Không thể xóa banner.',
      icon: 'error',
      confirmButtonColor: '#4f46e5',
      customClass: {
        popup: '!rounded-xl',
        confirmButton: '!rounded-lg !px-6',
      }
    }),
  })

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      adminService.updateBanner(id, { isActive: !isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] })
      toast.success('Cập nhật thành công')
    },
    onError: () => toast.error('Có lỗi xảy ra'),
  })

  const openCreate = () => {
    setEditingId(null)
    setForm({
      title: '',
      shortDescription: '',
      image: '',
      startDate: '',
      endDate: '',
      order: 0,
      content: '',
      durationInDays: '',
      author: '',
      categoryName: '',
      sapo: '',
      highlightsTitle: '',
      highlights: '',
      quote: '',
      quoteAuthor: '',
      contentSections: [],
    })
    setActiveTab('basic')
    setShowModal(true)
  }

  const openEdit = (banner: any) => {
    setEditingId(banner._id)
    setForm({
      title: banner.title || '',
      shortDescription: banner.shortDescription || '',
      image: banner.image || '',
      startDate: banner.startDate ? banner.startDate.split('T')[0] : '',
      endDate: banner.endDate ? banner.endDate.split('T')[0] : '',
      order: banner.order || 0,
      content: banner.content || '',
      durationInDays: banner.durationInDays || '',
      author: banner.author || '',
      categoryName: banner.categoryName || '',
      sapo: banner.sapo || '',
      highlightsTitle: banner.highlightsTitle || '',
      highlights: banner.highlights ? banner.highlights.join('\n') : '',
      quote: banner.quote || '',
      quoteAuthor: banner.quoteAuthor || '',
      contentSections: banner.contentSections || [],
    })
    setActiveTab('basic')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingId(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return

    const parsedHighlights = form.highlights
      ? form.highlights.split('\n').map((h) => h.trim()).filter(Boolean)
      : []

    const payload = {
      ...form,
      highlights: parsedHighlights,
    }

    if (editingId) {
      Swal.fire({
        title: 'Xác nhận cập nhật?',
        text: 'Bạn có chắc chắn muốn lưu các thay đổi cho banner này?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#4f46e5',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy',
        customClass: {
          popup: '!rounded-xl',
          confirmButton: '!rounded-lg !px-6 !ml-2',
          cancelButton: '!rounded-lg !px-6',
          actions: '!gap-2',
        }
      }).then((result) => {
        if (result.isConfirmed) {
          updateMutation.mutate({ id: editingId, payload })
        }
      })
    } else {
      createMutation.mutate(payload)
    }
  }

  const banners = data?.banners || []

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý banner</h1>
          <p className="text-sm text-gray-500 mt-1">{banners.length} banner</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus size={18} />
          Thêm banner
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <BannerTable
          banners={banners}
          isLoading={isLoading}
          onEdit={openEdit}
          onDelete={(id) => deleteMutation.mutate(id)}
          onToggleActive={(id, isActive) => toggleActiveMutation.mutate({ id, isActive })}
          isDeleting={deleteMutation.isPending}
        />
      </div>

      <BannerFormModal
        showModal={showModal}
        editingId={editingId}
        form={form}
        setForm={setForm}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isUploading={isUploading}
        handleFileChange={handleFileChange}
        handleSubmit={handleSubmit}
        closeModal={closeModal}
        isPending={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  )
}
