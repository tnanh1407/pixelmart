import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Star,
  Store,
  Share2,
  Heart,
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
import ProductCard from '../../../components/ProductCard'
import { productDetails as productData, relatedProducts, trendingProducts } from '../../../data/products'
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN').format(price) + 'đ'

type DetailTab = 'detail' | 'review'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const productId = Number(id) || 1
  const product = productData[productId] || productData[1]

  const [, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<DetailTab>('detail')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null)


  return (
    <div className="w-full max-w-350 mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link>
        <span>/</span>
        <Link to="/store-list" className="hover:text-primary transition-colors">Gian hàng</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium truncate">{product.name}</span>
      </div>

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
              {product.images.map((img, i) => (
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
              {product.images.map((img, i) => (
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
                  <Star key={i} size={14} className={i < product.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300 fill-gray-300'} />
                ))}
              </div>
              <span className="text-base text-gray-500">{product.sold} lượt mua</span>
              <button className="text-base text-red-500 hover:text-secondary transition-colors flex items-center gap-1 cursor-pointer">
                <ShieldCheck size={16} />
                Báo cáo
              </button>
              <button className="ml-auto text-base text-primary hover:text-secondary flex items-center gap-1 cursor-pointer">
                <Share2 size={16} />
                Chia sẻ
              </button>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-5">
              <span className="text-3xl font-bold text-primary">{formatPrice(product.salePrice)}</span>
              {product.originalPrice > product.salePrice && (
                <>
                  <span className="text-lg text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                  <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">GIẢM {product.discount}%</span>
                </>
              )}
            </div>

            {/* Info Rows */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-4">
                <span className="w-36 text-base text-gray-500 shrink-0">Gửi từ</span>
                <span className="text-base font-medium text-gray-800">{product.origin}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-36 text-base text-gray-500 shrink-0">Khu vực giao hàng</span>
                <button className="text-base font-medium text-gray-800 hover:text-primary transition-colors">
                  {product.shippingArea}
                </button>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-36 text-base text-gray-500 shrink-0">Vận chuyển nhanh</span>
                <span className="text-base font-medium text-gray-800">{product.fastShipping}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-36 text-base text-gray-500 shrink-0">Hàng tồn kho</span>
                <span className="text-base font-medium text-gray-800">10000</span>
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="w-36 text-base text-gray-500 shrink-0">Số lượng:</span>
              <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <Minus size={16} />
                </button>
                <span className="w-14 h-10 flex items-center justify-center text-sm font-medium border-x border-gray-200 ">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button className="flex-1 py-3 border-2 border-primary text-primary font-bold text-base rounded-lg hover:bg-primary/5 transition-colors cursor-pointer">
                Thêm vào giỏ hàng
              </button>
              <button className="flex-1 py-3 bg-primary text-white font-bold text-base rounded-lg hover:bg-primary-hover transition-colors cursor-pointer">
                Mua ngay
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Shop Info */}
      <div className="bg-[url('/core/background.jpg')] rounded-2xl shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Shop Avatar + Name */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="relative">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md bg-gray-100">
                <img src={product.shop.avatar} alt={product.shop.name} className="w-full h-full object-cover" />
              </div>
              {product.shop.trusted && (
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                  <BadgeCheck size={18} className="text-primary fill-green-100" />
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{product.shop.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Link
                  to={`/store/${product.shop.name}`}
                  className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                >
                  <Store size={16} />
                  Xem cửa hàng
                </Link>
                <button className="cursor-pointer flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors cursor-pointers">
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
                  <Star key={i} size={14} className={i < product.shop.ratings.uyTin ? 'text-secondary fill-secondary' : 'text-gray-300'} />
                ))}
              </div>
            </div>
            <div>
              <p className="text-base font-medium text-gray-500 mb-1">Đúng mô tả</p>
              <p className="text-base font-medium text-primary">{product.shop.ratings.dungMoTa} điểm</p>
            </div>
            <div>
              <p className="text-base font-medium text-gray-500 mb-1">Thái độ</p>
              <p className="text-base font-bold text-primary">{product.shop.ratings.thaiDo} điểm</p>
            </div>
            <div>
              <p className="text-base font-medium text-gray-500 mb-1">Giao hàng</p>
              <p className="text-base font-bold text-primary">{product.shop.ratings.giaoHang} điểm</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Sidebar + Tabs */}
      <div className="flex gap-6 mb-6">
        {/* Left Sidebar: Đang được quan tâm */}
        <div className="w-90 shrink-0 hidden lg:block">
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Đang được quan tâm</h3>
            <div className="space-y-4">
              {trendingProducts.map((item) => (
                <Link key={item.id} to={`/product/${item.id}`} className="flex gap-3 group border border-gray-200 rounded-2xl p-2">
                  <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 line-clamp-2 mb-1 group-hover:text-primary transition-colors">{item.name}</p>
                    {item.discount && item.discount > 0 && (
                      <span className="inline-block bg-primary text-white text-[10px] font-bold px-1 py-0.5 rounded mb-1">Bán chạy</span>
                    )}
                    <p className="text-sm font-bold text-primary">{formatPrice(item.salePrice)}</p>
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
                Đánh giá(0)
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
                      {product.detailedDescription}
                    </div>
                  </div>

                  {/* Thông tin sản phẩm */}
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-2">Thông tin sản phẩm</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>- Xuất xứ: <b>{product.origin}</b></li>
                      <li>- Thương hiệu: <b>{product.shop.name}</b></li>
                      <li>- Danh mục: <b>OCOP - Đặc sản vùng miền</b></li>
                    </ul>
                  </div>

                  {/* Thành phần */}
                  {product.ingredients && (
                    <div>
                      <h3 className="text-base font-bold text-gray-900 mb-2">Thành phần</h3>
                      <p className="text-sm text-gray-700 leading-relaxed">{product.ingredients}</p>
                    </div>
                  )}

                  {/* Công dụng */}
                  {product.benefits && (
                    <div>
                      <h3 className="text-base font-bold text-gray-900 mb-2">Công dụng</h3>
                      <p className="text-sm text-gray-700 leading-relaxed">{product.benefits}</p>
                    </div>
                  )}

                  {/* Đối tượng sử dụng */}
                  {product.whoShouldUse && product.whoShouldUse.length > 0 && (
                    <div>
                      <h3 className="text-base font-bold text-gray-900 mb-2">Đối tượng sử dụng</h3>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {product.whoShouldUse.map((item, index) => (
                          <li key={index}>- {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

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
                    <p className="text-base text-gray-600">Bạn có thắc mắc về sản phẩm? <button className="text-primary font-medium hover:text-primary-hover transition-colors cursor-pointer"><i>Chat với shop</i></button> để được tư vấn chi tiết.</p>
                  </div>
                </div>
              )}

              {/* Đánh giá tab */}
              {activeTab === 'review' && (
                <div>
                  {/* Header */}
                  <h3 className="text-base font-bold text-gray-800 mb-6">Product Ratings</h3>

                  {/* Rating Summary Box */}
                  <div className="bg-[#aed3c1] rounded-xl p-5 mb-6 ">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">

                      {/* Rating Score */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-4xl font-medium text-red-500">{product.rating || 0}</span>
                        <div>
                          <p className="text-sm text-black font-medium">out of 5</p>
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={14} className={i < (product.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-gray-300 fill-gray-600'} />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Filter Buttons */}
                      <div className="flex flex-wrap gap-2 bg-red">
                        <button className="px-4 py-1.5 text-sm font-medium bg-white border border-red-400 text-red-500 cursor-pointer hover:bg-secondary hover:text-white">All</button>
                        <button className="px-4 py-1.5 text-sm font-medium bg-white border border-gray-200 text-gray-600 cursor-pointer hover:border-gray-300 hover:bg-secondary hover:text-white">5 Star ({product.ratingBreakdown?.[5] || 0})</button>
                        <button className="px-4 py-1.5 text-sm font-medium bg-white border border-gray-200 text-gray-600 cursor-pointer hover:border-gray-300 hover:bg-secondary hover:text-white">4 Star ({product.ratingBreakdown?.[4] || 0})</button>
                        <button className="px-4 py-1.5 text-sm font-medium bg-white border border-gray-200 text-gray-600 cursor-pointer hover:border-gray-300 hover:bg-secondary hover:text-white">3 Star ({product.ratingBreakdown?.[3] || 0})</button>
                        <button className="px-4 py-1.5 text-sm font-medium bg-white border border-gray-200 text-gray-600 cursor-pointer hover:border-gray-300 hover:bg-secondary hover:text-white">2 Star ({product.ratingBreakdown?.[2] || 0})</button>
                        <button className="px-4 py-1.5 text-sm font-medium bg-white border border-gray-200 text-gray-600 cursor-pointer hover:border-gray-300 hover:bg-secondary hover:text-white">1 Star ({product.ratingBreakdown?.[1] || 0})</button>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button className="px-4 py-1.5 text-sm font-medium bg-white border border-gray-200 text-gray-600 cursor-pointer hover:border-gray-300 hover:bg-secondary hover:text-white">With Comments ({product.totalReviews || 0})</button>
                      <button className="px-4 py-1.5 text-sm font-medium bg-white border border-gray-200 text-gray-600 cursor-pointer hover:border-gray-300 hover:bg-secondary hover:text-white">With Media</button>
                    </div>
                  </div>

                  {/* Reviews List */}
                  {product.reviews && product.reviews.length > 0 ? (
                    <div className="space-y-6">
                      {product.reviews.map((review) => (
                        <div key={review.id} className="pb-6 border-b border-gray-200 last:border-0 last:pb-0">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                              <img src={review.images?.[0] || ''} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.textContent = review.author.charAt(0) }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-base font-medium text-gray-800 mb-0.5">{review.author}</p>
                              <div className="flex items-center gap-1 mb-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} size={12} className={i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
                                ))}
                              </div>
                              <p className="text-sm text-gray-400 mb-2">{review.createdAt}{review.variant && ` | Variation: ${review.variant}`}</p>
                              <p className="text-base text-black leading-relaxed mb-3">{review.comment}</p>
                              {review.images && review.images.length > 0 && (
                                <div className="flex gap-2">
                                  {review.images.map((img, i) => (
                                    <div key={i} className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                                      <img src={img} alt="" className="w-full h-full object-cover" />
                                    </div>
                                  ))}
                                </div>
                              )}
                              <div className="flex items-center gap-4 mt-3">
                                <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary transition-colors">
                                  <Heart size={12} /> {review.likes}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-sm">Chưa có đánh giá nào</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4  gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={product.images.map((src) => ({ src }))}
        styles={{ container: { backgroundColor: "rgba(0, 0, 0, 0.5)" } }}
      />
    </div>
  )
}
