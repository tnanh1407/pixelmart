import { Link } from 'react-router-dom'
import { Store, Star, MessageSquare, Clock, BadgeCheck } from 'lucide-react'
import type { IStore } from '@/types/store.types'

interface StoreCardProps {
  store: IStore
}

const RESPONSE_TIME_LABELS: Record<string, string> = {
  minutes: 'within minutes',
  hours: 'within hours',
  day: 'within a day',
}


export default function StoreCard({ store }: StoreCardProps) {
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
          <p className="text-xs text-text-second mt-0.5 font-medium">{store.slug}</p>
          <div className="flex items-center gap-1 text-xs text-text-second mt-1 justify-center sm:justify-start">
            <span className="text-primary font-semibold">{store.followersCount ?? 0}</span>
            <span>Followers</span>
            <span className="mx-1">|</span>
            <span className="text-primary font-semibold">{store.followingCount ?? 0}</span>
            <span>Following</span>
          </div>
          <p className="text-xs text-text-second mt-0.5">Tham gia: {new Date(store.createdAt).toLocaleDateString('vi-VN')}</p>

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

          <div className="flex flex-col items-center gap-2 min-w-15">
            <div className=" rounded-full bg-orange-50 flex items-center justify-center">
              <MessageSquare size={22} className="text-primary" />
            </div>
            <span className="text-sm font-bold text-gray-900">{store.responseRate ?? 0}%</span>
            <span className="text-xs text-gray-400 ">Tỉ lệ phản hồi</span>
          </div>

          <div className="flex flex-col items-center gap-2 min-w-15">
            <div className=" rounded-full bg-orange-50 flex items-center justify-center">
              <Clock size={22} className="text-primary" />
            </div>
            <span className="text-sm font-bold text-gray-900">
              {RESPONSE_TIME_LABELS[store.responseTime || 'minutes']}
            </span>
            <span className="text-xs text-gray-400">Thời gian phản hồi</span>
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
          <button className="w-full text-center px-5 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition-colors">
            FOLLOW
          </button>
        </div>
      </div>
    </div>
  )
}
