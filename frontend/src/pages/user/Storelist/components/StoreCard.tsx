import { Link, useNavigate } from 'react-router-dom'
import { Store, Star, BadgeCheck } from 'lucide-react'
import type { IStore } from '@/types/store.types'
import { useFollowStatus, useFollowStore, useUnfollowStore } from '@/hooks/user/store/useFollowStore'
import useUserStore from '@/stores/useUserStore'
interface StoreCardProps {
  store: IStore
}

export default function StoreCard({ store }: StoreCardProps) {
  const navigate = useNavigate()
  const { isAuthenticated } = useUserStore()

  const { data: followData } = useFollowStatus(store._id)
  const isFollowing = followData?.isFollowing ?? false

  const followMutation = useFollowStore(store._id)
  const unfollowMutation = useUnfollowStore(store._id)

  const handleFollowToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
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
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5">
        {/* Logo */}
        <Link to={`/store/${store._id}`} className="shrink-0">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-100 group-hover:border-primary/30 transition-colors duration-300">
            <img
              src={store.logo || '/homeLayout/homePage/banner/banner_1.webp'}
              alt={store.name}
              className="w-full h-full object-cover"
            />
          </div>
        </Link>

        {/* Info */}
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <Link to={`/store/${store._id}`} className="text-lg font-bold text-gray-900 hover:text-primary transition-colors truncate">
              {store.name}
            </Link>
            {store.isVerified && (
              <BadgeCheck size={20} className="text-primary fill-emerald-100 shrink-0" />
            )}
          </div>
          <p className="text-xs text-text-muted mt-0.5 font-medium">{store.slug}</p>
          <div className="flex items-center gap-1 text-xs text-text-muted mt-1 justify-center sm:justify-start">
            <span className="text-primary font-semibold">{store.followersCount ?? 0}</span>
            <span>Followers</span>
          </div>
          <p className="text-xs text-text-muted mt-0.5">Tham gia: {new Date(store.createdAt).toLocaleDateString('vi-VN')}</p>

        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 sm:gap-5 shrink-0 flex-wrap justify-center">
          <div className="flex flex-col items-center gap-2 min-w-15">
            <div className=" rounded-full bg-orange-50 flex items-center justify-center">
              <Store size={22} className="text-primary" />
            </div>
            <span className="text-sm font-bold text-gray-900">{store.ratingsQuantity ?? 0}</span>
            <span className="text-xs text-gray-400">Sản phẩm</span>
          </div>

          <div className="flex flex-col items-center gap-2 min-w-15">
            <div className=" rounded-full bg-orange-50 flex items-center justify-center">
              <Star size={22} className="text-primary" />
            </div>
            <span className="text-sm font-bold text-gray-900">
              {store.ratingsQuantity ? store.ratingsAverage.toFixed(1) : 'N/A'}
            </span>
            <span className="text-xs text-gray-400">Đánh giá</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0 flex-col w-40">
          <Link
            to={`/store/${store._id}`}
            className="w-full text-center px-5 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:border-primary hover:text-primary transition-colors"
          >
            VIEW SHOP
          </Link>
          <button
            onClick={handleFollowToggle}
            disabled={isPending}
            className={`w-full text-center px-5 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-50 ${
              isFollowing
                ? 'bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-250 hover:text-gray-900'
                : 'bg-primary text-white hover:bg-primary-hover border-none'
            }`}
          >
            {isFollowing ? 'UNFOLLOW' : 'FOLLOW'}
          </button>
        </div>
      </div>
    </div>
  )
}
