import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { adminService } from '@/services/admin/admin.service'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import StoreSearchBar from './StoreSearchBar'
import StoresTable from './StoresTable'
import StorePagination from './StorePagination'
import StoreFormModal from './StoreFormModal'

interface StoreForm {
  name: string
  logo?: string
  description?: string
  phone?: string
  email?: string
  address?: {
    street?: string
    ward?: string
    district?: string
    city?: string
  }
  isVerified: boolean
  isActive: boolean
  ownerId: any
}

export default function StoresPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')

  // Modal States
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<StoreForm>({
    name: '',
    logo: '',
    description: '',
    phone: '',
    email: '',
    address: {
      street: '',
      ward: '',
      district: '',
      city: '',
    },
    isVerified: false,
    isActive: true,
    ownerId: '',
  })

  // Navigation
  const navigate = useNavigate()

  const handleViewDetail = (store: any) => {
    navigate(`/admin/stores/${store._id}`)
  }

  // Queries
  const { data, isLoading } = useQuery({
    queryKey: ['admin-stores', page, search],
    queryFn: () => adminService.getStores({ page, limit: 10, search: search || undefined, all: true } as any),
    staleTime: 30 * 1000,
  })

  // Mutations
  const toggleVerifiedMutation = useMutation({
    mutationFn: (id: string) => {
      const store = data?.stores.find((s) => s._id === id)
      return adminService.updateStore(id, { isVerified: !store?.isVerified })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-stores'] })
      toast.success('Cập nhật trạng thái xác minh thành công')
    },
    onError: () => toast.error('Có lỗi xảy ra'),
  })

  const toggleActiveMutation = useMutation({
    mutationFn: (id: string) => {
      const store = data?.stores.find((s) => s._id === id)
      return adminService.updateStore(id, { isActive: !store?.isActive })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-stores'] })
      toast.success('Cập nhật trạng thái hoạt động thành công')
    },
    onError: () => toast.error('Có lỗi xảy ra'),
  })

  const createStoreMutation = useMutation({
    mutationFn: (payload: StoreForm) => adminService.createStore(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-stores'] })
      Swal.fire({
        title: 'Thành công!',
        text: 'Thêm mới cửa hàng thành công.',
        icon: 'success',
        confirmButtonColor: '#4f46e5',
        customClass: {
          popup: '!rounded-xl',
          confirmButton: '!rounded-lg !px-6',
        },
      })
      closeModal()
    },
    onError: (err: any) => {
      console.error(err)
      Swal.fire({
        title: 'Thất bại!',
        text: err?.response?.data?.message || 'Có lỗi xảy ra khi tạo cửa hàng.',
        icon: 'error',
        confirmButtonColor: '#4f46e5',
        customClass: {
          popup: '!rounded-xl',
          confirmButton: '!rounded-lg !px-6',
        },
      })
    },
  })

  const updateStoreMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: StoreForm }) =>
      adminService.updateStore(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-stores'] })
      Swal.fire({
        title: 'Thành công!',
        text: 'Cập nhật cửa hàng thành công.',
        icon: 'success',
        confirmButtonColor: '#4f46e5',
        customClass: {
          popup: '!rounded-xl',
          confirmButton: '!rounded-lg !px-6',
        },
      })
      closeModal()
    },
    onError: (err: any) => {
      console.error(err)
      Swal.fire({
        title: 'Thất bại!',
        text: err?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật cửa hàng.',
        icon: 'error',
        confirmButtonColor: '#4f46e5',
        customClass: {
          popup: '!rounded-xl',
          confirmButton: '!rounded-lg !px-6',
        },
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteStore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-stores'] })
      toast.success('Xóa cửa hàng thành công')
    },
    onError: () => toast.error('Không thể xóa cửa hàng'),
  })

  // Handlers
  const handleSearch = () => {
    setSearch(searchInput)
    setPage(1)
  }

  const openCreate = () => {
    setEditingId(null)
    setForm({
      name: '',
      logo: '',
      description: '',
      phone: '',
      email: '',
      address: {
        street: '',
        ward: '',
        district: '',
        city: '',
      },
      isVerified: false,
      isActive: true,
      ownerId: '',
    })
    setShowModal(true)
  }

  const openEdit = (store: any) => {
    setEditingId(store._id)
    setForm({
      name: store.name || '',
      logo: store.logo || '',
      description: store.description || '',
      phone: store.phone || '',
      email: store.email || '',
      address: {
        street: store.address?.street || '',
        ward: store.address?.ward || '',
        district: store.address?.district || '',
        city: store.address?.city || '',
      },
      isVerified: store.isVerified || false,
      isActive: store.isActive !== undefined ? store.isActive : true,
      ownerId: store.ownerId || '',
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingId(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.ownerId) {
      toast.error('Vui lòng nhập đầy đủ tên cửa hàng và chọn chủ sở hữu')
      return
    }

    const cleanOwnerId =
      typeof form.ownerId === 'object' && form.ownerId !== null
        ? (form.ownerId as any)._id
        : form.ownerId

    const cleanForm = {
      ...form,
      ownerId: cleanOwnerId,
    }

    if (editingId) {
      updateStoreMutation.mutate({ id: editingId, payload: cleanForm })
    } else {
      createStoreMutation.mutate(cleanForm)
    }
  }

  const stores = data?.stores || []
  const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý cửa hàng</h1>
          <p className="text-sm text-gray-500 mt-1">{pagination.total} cửa hàng</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus size={18} />
          Thêm cửa hàng
        </button>
      </div>

      <StoreSearchBar
        value={searchInput}
        onChange={setSearchInput}
        onSearch={handleSearch}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <StoresTable
          stores={stores}
          isLoading={isLoading}
          onToggleVerified={toggleVerifiedMutation.mutate}
          isToggleVerifiedPending={toggleVerifiedMutation.isPending}
          onToggleActive={toggleActiveMutation.mutate}
          isToggleActivePending={toggleActiveMutation.isPending}
          onDelete={deleteMutation.mutate}
          isDeletePending={deleteMutation.isPending}
          onViewDetail={handleViewDetail}
        />

        {!isLoading && stores.length > 0 && (
          <StorePagination
            page={page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        )}
      </div>

      {/* Form Modal */}
      <StoreFormModal
        showModal={showModal}
        editingId={editingId}
        form={form}
        setForm={setForm}
        handleSubmit={handleSubmit}
        closeModal={closeModal}
        isPending={createStoreMutation.isPending || updateStoreMutation.isPending}
      />
    </div>
  )
}
