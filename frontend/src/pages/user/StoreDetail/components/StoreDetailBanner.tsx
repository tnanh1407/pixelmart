import type { IStore } from '@/types/store.types'

interface StoreDetailBannerProps {
  store: IStore
}

export default function StoreDetailBanner({ store }: StoreDetailBannerProps) {
  return (
    <div className="relative w-full h-52 rounded-b-2xl overflow-hidden">
      <img
        src="/homeLayout/homePage/banner/banner_1.webp"
        alt={store.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
    </div>
  )
}
