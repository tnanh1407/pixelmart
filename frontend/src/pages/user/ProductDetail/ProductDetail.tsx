import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Star,
  Store as StoreIcon,
  Share2,
  Minus,
  Plus,
  ShieldCheck,
  BadgeCheck,
  MessageSquareMore,
} from 'lucide-react'

import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Navigation, Thumbs } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'

import ProductCard from '@/components/common/ProductCard'
import { provinces } from '../../../data/products'
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"
import { useQuery } from '@tanstack/react-query'
import { useProduct } from '@/hooks/product/useProduct'
import { productService } from '@/services/product.service'
import AppBreadcrumb from '@/components/common/AppBreadcrumb'

const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN').format(price) + 'đ'

type DetailTab = 'detail' | 'review'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: product, isLoading, error } = useProduct(id)

  const [, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<DetailTab>('detail')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null)

  // Query real related products (same category)
  const { data: relatedResponse } = useQuery({
    queryKey: ['related-products', (product?.categoryId as any)?._id],
    queryFn: () => productService.getProducts({ categoryId: (product?.categoryId as any)?._id, limit: 4 }),
    enabled: !!(product?.categoryId as any)?._id,
  })
  const realRelatedProducts = relatedResponse?.products || []

  // Query real trending/top-selling products
  const { data: trendingResponse } = useQuery({
    queryKey: ['trending-products'],
    queryFn: () => productService.getProducts({ limit: 5, sort: 'sold' }),
  })
  const realTrendingProducts = trendingResponse?.products || []

  if (isLoading) {
    return (
      <div className="w-full max-w-350 mx-auto px-4 py-6 animate-pulse">
        {/* Breadcrumb Skeleton */}
        <div className="h-4 w-64 bg-gray-200 rounded mb-6" />

        {/* Main Content Skeleton */}
        <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left: Images Skeleton */}
            <div className="w-full md:w-120 shrink-0">
              <div className="aspect-square bg-gray-200 rounded-xl mb-3" />
              <div className="grid grid-cols-4 gap-2">
                <div className="h-18 bg-gray-200 rounded-lg" />
                <div className="h-18 bg-gray-200 rounded-lg" />
                <div className="h-18 bg-gray-200 rounded-lg" />
                <div className="h-18 bg-gray-200 rounded-lg" />
              </div>
            </div>

            {/* Right: Info Skeleton */}
            <div className="flex-1 space-y-4">
              <div className="h-8 w-3/4 bg-gray-200 rounded" />
              <div className="h-4 w-1/3 bg-gray-200 rounded" />
              <div className="h-10 w-1/2 bg-gray-200 rounded mt-6" />
              <div className="space-y-2 mt-6">
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-4 w-5/6 bg-gray-200 rounded" />
                <div className="h-4 w-4/5 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="w-full max-w-md mx-auto py-20 px-4 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy sản phẩm</h2>
        <p className="text-gray-500 text-sm mb-6">Sản phẩm này không tồn tại hoặc đã bị gỡ bỏ khỏi hệ thống.</p>
        <Link to="/" className="inline-flex items-center justify-center bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors">
          Quay lại trang chủ
        </Link>
      </div>
    )
  }

  const images = product.images.length > 0 ? product.images : ['https://picsum.photos/400/400']
  const salePrice = product.discountPrice || product.price
  const originalPrice = product.price
  const hasDiscount = !!product.discountPrice
  const discountPercent = hasDiscount ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) : 0

  // Calculate dynamic origin based on product name hash (matching Storelist style)
  const nameHash = product.name.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)
  const originProvince = provinces[nameHash % provinces.length]

  const store = product.storeId as any
  const category = product.categoryId as any

  return (
    <div className="w-full max-w-350 mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <AppBreadcrumb
        className="mb-4"
        items={[
          { label: 'Gian hàng', to: '/store-list' },
          { label: product.name }
        ]}
      />

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left: Images */}
          <div className="w-full md:w-120 shrink-0">
            {/* Main Image Swiper */}
            <Swiper
              spaceBetween={10}
              thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : undefined }}
              modules={[FreeMode, Navigation, Thumbs]}
              className="rounded-xl overflow-hidden border border-gray-100 mb-3 product-main-swiper"
              onSlideChange={(swiper) => setSelectedImage(swiper.activeIndex)}
            >
              {images.map((img, i) => (
                <SwiperSlide key={i}>
                  <div
                    className="aspect-square cursor-pointer"
                    onClick={() => {
                      setLightboxIndex(i)
                      setLightboxOpen(true)
                    }}
                  >
                    <img src={img} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Thumbnails Swiper */}
            <Swiper
              onSwiper={setThumbsSwiper}
              spaceBetween={8}
              slidesPerView={4}
              freeMode
              watchSlidesProgress
              modules={[FreeMode, Navigation, Thumbs]}
              className="product-thumbs-swiper"
            >
              {images.map((img, i) => (
                <SwiperSlide key={i}>
                  <button className="w-full h-18 rounded-lg overflow-hidden border-2 transition-colors border-gray-200 hover:border-gray-300 cursor-pointer">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Right: Info */}
          <div className="flex-1 min-w-0">
            {/* Title + Rating */}
            <h1 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={i < Math.round(product.ratingsAverage || 5.0) ? 'text-amber-400 fill-amber-400' : 'text-gray-300 fill-gray-300'} />
                ))}
              </div>
              <span className="text-base text-gray-500">{product.ratingsQuantity || 0} đánh giá</span>
              <button className="text-base text-red-500 hover:text-secondary transition-colors flex items-center gap-1 cursor-pointer border-none bg-transparent">
                <ShieldCheck size={16} />
                Báo cáo
              </button>
              <button className="ml-auto text-base text-primary hover:text-secondary flex items-center gap-1 cursor-pointer border-none bg-transparent">
                <Share2 size={16} />
                Chia sẻ
              </button>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-5">
              <span className="text-3xl font-bold text-primary">{formatPrice(salePrice)}</span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-gray-400 line-through">{formatPrice(originalPrice)}</span>
                  <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">GIẢM {discountPercent}%</span>
                </>
              )}
            </div>

            {/* Info Rows */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-4">
                <span className="w-36 text-base text-gray-500 shrink-0">Gửi từ</span>
                <span className="text-base font-medium text-gray-800">{originProvince}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-36 text-base text-gray-500 shrink-0">Khu vực giao hàng</span>
                <span className="text-base font-medium text-gray-800">Toàn quốc</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-36 text-base text-gray-500 shrink-0">Vận chuyển nhanh</span>
                <span className="text-base font-medium text-gray-800">24h - 48h</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-36 text-base text-gray-500 shrink-0">Hàng tồn kho</span>
                <span className="text-base font-medium text-gray-800">{product.stock || 100} sản phẩm</span>
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="w-36 text-base text-gray-500 shrink-0">Số lượng:</span>
              <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer border-none bg-transparent"
                >
                  <Minus size={16} />
                </button>
                <span className="w-14 h-10 flex items-center justify-center text-sm font-medium border-x border-gray-200 ">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer border-none bg-transparent"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button className="flex-1 py-3 border-2 border-primary text-primary font-bold text-base rounded-lg hover:bg-primary/5 transition-colors cursor-pointer bg-transparent">
                Thêm vào giỏ hàng
              </button>
              <button className="flex-1 py-3 bg-primary text-white font-bold text-base rounded-lg hover:bg-primary-hover transition-colors cursor-pointer border-none">
                Mua ngay
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Shop Info */}
      {store && (
        <div className="bg-[url('/core/background.jpg')] rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Shop Avatar + Name */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="relative">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md bg-gray-100">
                  <img src={store.logo || 'https://picsum.photos/100/100'} alt={store.name} className="w-full h-full object-cover" />
                </div>
                {store.isVerified && (
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                    <BadgeCheck size={18} className="text-primary fill-green-100" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{store.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Link
                    to={`/store/${store._id}`}
                    className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                  >
                    <StoreIcon size={16} />
                    Xem cửa hàng
                  </Link>
                  <button className="cursor-pointer flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors bg-white">
                    <MessageSquareMore size={16}/>
                    Nhắn tin
                  </button>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-16 bg-gray-200 shrink-0" />

            {/* Shop Ratings */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
              <div>
                <p className="text-base text-gray-500 font-medium mb-1">Uy tín</p>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < Math.round(store.ratingsAverage || 5.0) ? 'text-secondary fill-secondary' : 'text-gray-300'} />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-base font-medium text-gray-500 mb-1">Đúng mô tả</p>
                <p className="text-base font-medium text-primary">{(store.ratingsAverage || 4.8).toFixed(1)} điểm</p>
              </div>
              <div>
                <p className="text-base font-medium text-gray-500 mb-1">Thái độ</p>
                <p className="text-base font-bold text-primary">5.0 điểm</p>
              </div>
              <div>
                <p className="text-base font-medium text-gray-500 mb-1">Giao hàng</p>
                <p className="text-base font-bold text-primary">4.9 điểm</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Section: Sidebar + Tabs */}
      <div className="flex gap-6 mb-6">
        {/* Left Sidebar: Đang được quan tâm */}
        <div className="w-90 shrink-0 hidden lg:block">
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Đang được quan tâm</h3>
            <div className="space-y-4">
              {realTrendingProducts.map((item) => (
                <Link key={item._id} to={`/product/${item._id}`} className="flex gap-3 group border border-gray-200 rounded-2xl p-2">
                  <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    <img src={item.images?.[0] || 'https://picsum.photos/100/100'} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 line-clamp-2 mb-1 group-hover:text-primary transition-colors">{item.name}</p>
                    <p className="text-sm font-bold text-primary">{formatPrice(item.discountPrice || item.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Tabs Content */}
        <div className="flex-1 min-w-0">
          {/* Tabs */}
          <div className="rounded-2xl shadow-sm mb-6 ">
            <div className="flex items-center border-b border-gray-200 bg-[url('/core/background.jpg')] rounded-tr-2xl rounded-tl-2xl ">
              <button
                onClick={() => setActiveTab('detail')}
                className={`cursor-pointer px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'detail'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Chi tiết
              </button>
              <button
                onClick={() => setActiveTab('review')}
                className={`cursor-pointer px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'review'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Đánh giá ({product.ratingsQuantity || 0})
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Chi tiết tab */}
              {activeTab === 'detail' && (
                <div className="space-y-6">
                  {/* Mô tả sản phẩm */}
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-2">Mô tả sản phẩm</h3>
                    <div className="whitespace-pre-line text-sm text-gray-700 leading-relaxed">
                      {product.description}
                    </div>
                  </div>

                  {/* Thông tin sản phẩm */}
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-2">Thông tin sản phẩm</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>- Xuất xứ: <b>{originProvince}</b></li>
                      <li>- Thương hiệu: <b>{store?.name || 'PixelMart Vendor'}</b></li>
                      <li>- Danh mục: <b>{category?.name || 'OCOP - Đặc sản vùng miền'}</b></li>
                    </ul>
                  </div>

                  {/* Hướng dẫn sử dụng */}
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-2">Hướng dẫn sử dụng</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>- Liều lượng khuyên dùng: 1-2 lần/ngày, mỗi lần 1-2 thìa</li>
                      <li>- Dùng trực tiếp hoặc pha với nước ấm, mật ong</li>
                      <li>- Sử dụng đều đặn trong 2-4 tuần để cảm nhận hiệu quả tốt nhất</li>
                    </ul>
                  </div>

                  {/* Hướng dẫn bảo quản */}
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-2">Hướng dẫn bảo quản</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>- Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp</li>
                      <li>- Đóng kín nắp sau khi sử dụng</li>
                      <li>- Sử dụng trong vòng 12 tháng sau khi mở nắp</li>
                    </ul>
                  </div>

                  {/* Chính sách mua hàng */}
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-2">Chính sách mua hàng</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>- Đổi trả trong 7 ngày nếu sản phẩm bị lỗi hoặc hư hỏng</li>
                      <li>- Giao hàng toàn quốc, ship COD, thanh toán khi nhận hàng</li>
                      <li>- Sản phẩm đạt chứng nhận OCOP chất lượng quốc gia</li>
                    </ul>
                  </div>

                  {/* Liên hệ tư vấn */}
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-base text-gray-600">Bạn có thắc mắc về sản phẩm? <button className="text-primary font-medium hover:text-primary-hover transition-colors cursor-pointer border-none bg-transparent"><i>Chat với shop</i></button> để được tư vấn chi tiết.</p>
                  </div>
                </div>
              )}

              {/* Đánh giá tab */}
              {activeTab === 'review' && (
                <div>
                  {/* Header */}
                  <h3 className="text-base font-bold text-gray-800 mb-6">Đánh giá sản phẩm</h3>

                  {/* Rating Summary Box */}
                  <div className="bg-[#aed3c1] rounded-xl p-5 mb-6 ">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Rating Score */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-4xl font-medium text-red-500">{product.ratingsAverage || 5.0}</span>
                        <div>
                          <p className="text-sm text-black font-medium">trên 5</p>
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={14} className={i < Math.round(product.ratingsAverage || 5.0) ? 'text-amber-400 fill-amber-400' : 'text-gray-300 fill-gray-600'} />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="text-sm text-gray-700">
                        Có tổng cộng <b>{product.ratingsQuantity || 0}</b> đánh giá được ghi nhận từ người tiêu dùng.
                      </div>
                    </div>
                  </div>

                  <div className="text-center py-12">
                    <p className="text-gray-500 text-sm">Chưa có đánh giá chi tiết nào cho sản phẩm này.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Sản phẩm liên quan</h2>
            {realRelatedProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {realRelatedProducts.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Không có sản phẩm liên quan nào.</p>
            )}
          </div>
        </div>
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={images.map((src) => ({ src }))}
        styles={{ container: { backgroundColor: "rgba(0, 0, 0, 0.5)" } }}
      />
    </div>
  )
}
