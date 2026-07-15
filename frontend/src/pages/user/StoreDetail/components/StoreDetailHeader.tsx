import { useNavigate } from 'react-router-dom'
import {
  Star,
  BadgeCheck,
  MessageCircle,
  UserPlus,
  Clock,
  Package,
  MapPin,
  Calendar,
  Eye,
  UserCheck,
} from 'lucide-react'
import type { IStore } from '@/types/store.types'
import { useFollowStatus, useFollowStore, useUnfollowStore } from '@/hooks/store/useFollowStore'
import useUserStore from '@/stores/useUserStore'


interface StoreDetailHeaderProps {
  store: IStore
  productsCount: number
}

export default function StoreDetailHeader({ store, productsCount }: StoreDetailHeaderProps) {
  const navigate = useNavigate()
  const { isAuthenticated } = useUserStore()

  const { data: followData } = useFollowStatus(store._id)
  const isFollowing = followData?.isFollowing ?? false

  const followMutation = useFollowStore(store._id)
  const unfollowMutation = useUnfollowStore(store._id)

  const handleFollowToggle = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    if (isFollowing) {
      unfollowMutation.mutate()
    } else {
      followMutation.mutate()
    }
  }

  const isPending = followMutation.isPending || unfollowMutation.isPending

  return (
    <div className="relative bg-[url('/core/background.jpg')] rounded-2xl shadow-sm mx-6 -mt-16 z-10 p-6">
      <div className="flex items-start gap-10">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100">
            <img
              src={store.logo || '/homeLayout/homePage/banner/banner_1.webp'}
              alt={store.name}
              className="w-full h-full object-cover"
            />
          </div>
          {store.isVerified && (
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
              <BadgeCheck size={22} className="text-[#009b4d] fill-green-100" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">{store.name}</h1>
            {store.isVerified && (
              <span className="bg-primary text-white text-sm font-medium px-2.5 py-0.5 border border-gray-300">
                Preferred+
              </span>
            )}
          </div>
          <div className="flex justify-center text-base text-gray-500 flex-col font-medium">
            <span className="flex items-center gap-1"><Clock size={16} />Active 10 phút trước</span>
            {store.address && (
              <span className="flex items-center gap-1">
                <MapPin size={16} />
                {[store.address.street, store.address.ward, store.address.district, store.address.city].filter(Boolean).join(', ')}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={handleFollowToggle}
              disabled={isPending}
              className={`cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-lg text-base font-medium transition-all duration-200 disabled:opacity-50 ${isFollowing
                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                : 'bg-[#009b4d] text-white hover:bg-[#008a43]'
                }`}
            >
              {isFollowing ? <UserCheck size={16} /> : <UserPlus size={16} />}
              {isFollowing ? 'Đang theo dõi' : 'Theo Dõi'}
            </button>
            <button className="cursor-pointer flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <MessageCircle size={16} />
              Chat
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 shrink-0 text-base ml-40 flex-1 font-medium">
          <div className="flex items-center gap-2"><Package size={16} className="text-black shrink-0" /><span className="text-black">Products:</span> <span className="font-bold text-[#009b4d]">{productsCount}</span></div>
          <div className="flex items-center gap-2"><Eye size={16} className="text-black shrink-0" /><span className="text-black">Followers:</span> <span className="font-bold text-[#009b4d]">{(store.followersCount ?? 0).toLocaleString()}</span></div>
          <div className="flex items-center gap-2"><Star size={16} className="text-black shrink-0" /><span className="text-black">Rating:</span> <span className="font-bold text-[#009b4d]">{store.ratingsAverage} ({store.ratingsQuantity})</span></div>
          <div className="flex items-center gap-2"><Calendar size={16} className="text-black shrink-0" /><span className="text-black">Joined:</span> <span className="font-bold text-[#009b4d]">{new Date(store.createdAt).toLocaleDateString('vi-VN')}</span></div>
        </div>
      </div>
    </div>
  )
}
