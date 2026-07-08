import { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Star,
  BadgeCheck,
  MessageCircle,
  UserPlus,
  Store,
  TrendingUp,
  Sparkles,
  Clock,
  Package,
  Info,
  ChevronRight,
  MapPin,
  Calendar,
  MessageSquare,
  Eye,
} from 'lucide-react'
import ProductCard, { type Product } from '../../../components/ProductCard'

const storeData: Record<number, {
  id: number
  name: string
  avatar: string
  banner: string
  description: string
  address: string
  joinDate: string
  responseTime: string
  responseRate: number
  followers: number
  rating: number
  totalRating: number
  products: number
  following: number
  trusted: boolean
  isPreferred: boolean
  categories: string[]
}> = {
  1: {
    id: 1,
    name: 'Đặc Sản Hà Nội',
    avatar: '/homeLayout/homePage/banner/banner_1.webp',
    banner: '/homeLayout/homePage/banner/banner_1.webp',
    description: 'Chuyên cung cấp đặc sản Hà Nội và các vùng miền. cam kết 100% sản phẩm OCOP đạt tiêu chuẩn chất lượng. Chuyên cung cấp đặc sản Hà Nội và các vùng miền. cam kết 100% sản phẩm OCOP đạt tiêu chuẩn chất lượng. Chuyên cung cấp đặc sản Hà Nội và các vùng miền. cam kết 100% sản phẩm OCOP đạt tiêu chuẩn chất lượng.Chuyên cung cấp đặc sản Hà Nội và các vùng miền. cam kết 100% sản phẩm OCOP đạt tiêu chuẩn chất lượng.Chuyên cung cấp đặc sản Hà Nội và các vùng miền. cam kết 100% sản phẩm OCOP đạt tiêu chuẩn chất lượng.Chuyên cung cấp đặc sản Hà Nội và các vùng miền. cam kết 100% sản phẩm OCOP đạt tiêu chuẩn chất lượng.Chuyên cung cấp đặc sản Hà Nội và các vùng miền. cam kết 100% sản phẩm OCOP đạt tiêu chuẩn chất lượng.Chuyên cung cấp đặc sản Hà Nội và các vùng miền. cam kết 100% sản phẩm OCOP đạt tiêu chuẩn chất lượng.',
    address: 'Hà Nội, Việt Nam',
    joinDate: 'Tháng 3, 2022',
    responseTime: 'trong vài giờ',
    responseRate: 100,
    followers: 5200,
    rating: 4.8,
    totalRating: 18400,
    products: 99,
    following: 2,
    trusted: true,
    isPreferred: true,
    categories: ['OCOP', 'Nông sản', 'Thực phẩm'],
  },
  2: {
    id: 2,
    name: 'Nông Sản Sạch',
    avatar: '/homeLayout/homePage/banner/banner_2.webp',
    banner: '/homeLayout/homePage/banner/banner_2.webp',
    description: 'Nông sản sạch từ nông trại đến bàn ăn. An toàn thực phẩm là ưu tiên số 1.',
    address: 'Hồ Chí Minh, Việt Nam',
    joinDate: 'Tháng 6, 2023',
    responseTime: 'trong vài phút',
    responseRate: 98,
    followers: 3100,
    rating: 4.6,
    totalRating: 8200,
    products: 56,
    following: 5,
    trusted: true,
    isPreferred: false,
    categories: ['Rau củ', 'Trái cây', 'Thịt tươi'],
  },
  3: {
    id: 3,
    name: 'OCOP Premium',
    avatar: '/homeLayout/homePage/banner/banner_3.webp',
    banner: '/homeLayout/homePage/banner/banner_3.webp',
    description: 'Sản phẩm OCOP cao cấp, đạt chuẩn 4-5 sao. Đầy đủ chứng nhận chất lượng.',
    address: 'Đà Nẵng, Việt Nam',
    joinDate: 'Tháng 1, 2023',
    responseTime: 'trong vài giờ',
    responseRate: 95,
    followers: 7800,
    rating: 4.9,
    totalRating: 25600,
    products: 120,
    following: 3,
    trusted: true,
    isPreferred: true,
    categories: ['OCOP 5 sao', 'Quà tặng', 'Đồ khô'],
  },
  4: {
    id: 4,
    name: 'Thực Phẩm Organic',
    avatar: '/homeLayout/homePage/banner/banner_1.webp',
    banner: '/homeLayout/homePage/banner/banner_1.webp',
    description: 'Thực phẩm hữu cơ organic 100% tự nhiên. Không sử dụng hóa chất, phân bón hóa học.',
    address: 'Hải Phòng, Việt Nam',
    joinDate: 'Tháng 9, 2022',
    responseTime: 'trong vài giờ',
    responseRate: 92,
    followers: 4500,
    rating: 4.7,
    totalRating: 12300,
    products: 78,
    following: 8,
    trusted: true,
    isPreferred: false,
    categories: ['Organic', 'Hữu cơ', 'Sạch'],
  },
  5: {
    id: 5,
    name: 'Đặc Sản Miền Trung',
    avatar: '/homeLayout/homePage/banner/banner_2.webp',
    banner: '/homeLayout/homePage/banner/banner_2.webp',
    description: 'Đặc sản miền Trung chính hiệu. Mắm, khô, bánh tráng và nhiều sản phẩm đặc trưng.',
    address: 'Huế, Việt Nam',
    joinDate: 'Tháng 5, 2023',
    responseTime: 'trong vài phút',
    responseRate: 100,
    followers: 2800,
    rating: 4.5,
    totalRating: 6700,
    products: 45,
    following: 12,
    trusted: false,
    isPreferred: false,
    categories: ['Mắm', 'Khô', 'Bánh'],
  },
}

const allProducts: (Product & { isBestSeller: boolean; isNew: boolean; isFeatured: boolean })[] = [
  { id: 1, name: 'Bưởi Đoan Hùng Bưởi Cát Quế...', image: '/homeLayout/homePage/banner/banner_1.webp', originalPrice: 40000, salePrice: 28000, discount: 30, rating: 4.8, sold: 1200, isBestSeller: true, isNew: false, isFeatured: true },
  { id: 2, name: 'Cam Cao Phong Hòa Bình...', image: '/homeLayout/homePage/banner/banner_2.webp', originalPrice: null, salePrice: 45000, discount: 0, rating: 4.5, sold: 800, isBestSeller: true, isNew: false, isFeatured: false },
  { id: 3, name: 'Na dai Tả Van Lào Cai...', image: '/homeLayout/homePage/banner/banner_3.webp', originalPrice: 75000, salePrice: 60000, discount: 20, rating: 4.9, sold: 2100, isBestSeller: true, isNew: false, isFeatured: true },
  { id: 4, name: 'Gạo Séng Cù - Đặc Sản Lào Cai...', image: '/homeLayout/homePage/banner/banner_1.webp', originalPrice: null, salePrice: 175500, discount: 0, rating: 5, sold: 500, isBestSeller: false, isNew: true, isFeatured: true },
  { id: 5, name: 'Mật ong rừng天然...', image: '/homeLayout/homePage/banner/banner_2.webp', originalPrice: 400000, salePrice: 350000, discount: 12, rating: 4.7, sold: 350, isBestSeller: false, isNew: true, isFeatured: false },
  { id: 6, name: 'Thịt bò gác bếp Sơn La...', image: '/homeLayout/homePage/banner/banner_3.webp', originalPrice: 420000, salePrice: 350000, discount: 17, rating: 4.8, sold: 950, isBestSeller: true, isNew: false, isFeatured: true },
  { id: 7, name: 'Rượu ngô Na Hang...', image: '/homeLayout/homePage/banner/banner_1.webp', originalPrice: null, salePrice: 120000, discount: 0, rating: 4.6, sold: 430, isBestSeller: false, isNew: true, isFeatured: false },
  { id: 8, name: 'Miến dong Bình Liêu...', image: '/homeLayout/homePage/banner/banner_2.webp', originalPrice: 106000, salePrice: 85000, discount: 20, rating: 4.9, sold: 1800, isBestSeller: true, isNew: false, isFeatured: true },
  { id: 9, name: 'Măng ớt Tuyên Quang...', image: '/homeLayout/homePage/banner/banner_3.webp', originalPrice: null, salePrice: 45000, discount: 0, rating: 4.4, sold: 600, isBestSeller: false, isNew: true, isFeatured: false },
  { id: 10, name: 'Tinh bột nghệ Yên Bái...', image: '/homeLayout/homePage/banner/banner_1.webp', originalPrice: 120000, salePrice: 90000, discount: 25, rating: 4.7, sold: 720, isBestSeller: true, isNew: false, isFeatured: true },
  { id: 11, name: 'Vải thiều Lục Ngạn...', image: '/homeLayout/homePage/banner/banner_2.webp', originalPrice: null, salePrice: 65000, discount: 0, rating: 4.3, sold: 280, isBestSeller: false, isNew: true, isFeatured: false },
  { id: 12, name: 'Chè Shan Tuyết...', image: '/homeLayout/homePage/banner/banner_3.webp', originalPrice: 180000, salePrice: 150000, discount: 17, rating: 4.8, sold: 1500, isBestSeller: true, isNew: false, isFeatured: true },
  { id: 13, name: 'Bánh đậu xanh Rồng Vàng...', image: '/homeLayout/homePage/banner/banner_1.webp', originalPrice: null, salePrice: 85000, discount: 0, rating: 4.6, sold: 900, isBestSeller: false, isNew: true, isFeatured: true },
  { id: 14, name: 'Rượu nho Ninh Thuận...', image: '/homeLayout/homePage/banner/banner_2.webp', originalPrice: 150000, salePrice: 120000, discount: 20, rating: 4.5, sold: 380, isBestSeller: false, isNew: true, isFeatured: false },
  { id: 15, name: 'Mè xửng Huế...', image: '/homeLayout/homePage/banner/banner_3.webp', originalPrice: null, salePrice: 65000, discount: 0, rating: 4.7, sold: 1100, isBestSeller: true, isNew: false, isFeatured: true },
]

type TabKey = 'home' | 'bestseller' | 'featured' | 'new' | 'all'

const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'home', label: 'Cửa hàng', icon: <Store size={16} /> },
  { key: 'bestseller', label: 'Bán chạy', icon: <TrendingUp size={16} /> },
  { key: 'featured', label: 'Sản phẩm nổi bật', icon: <Sparkles size={16} /> },
  { key: 'new', label: 'Sản phẩm mới', icon: <Clock size={16} /> },
  { key: 'all', label: 'Tất cả hàng hóa', icon: <Package size={16} /> },
]

export default function StoreDetail() {
  const { id } = useParams<{ id: string }>()
  const storeId = Number(id) || 1
  const store = storeData[storeId] || storeData[1]
  const [activeTab, setActiveTab] = useState<TabKey>('home')
  const [isFollowing, setIsFollowing] = useState(false)

  return (
    <div className="w-full max-w-350 mx-auto">
      {/* Store Banner */}
      <div className="relative w-full h-52 rounded-b-2xl overflow-hidden">
        <img src={store.banner} alt={store.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
      </div>

      {/* Store Header Card */}
      <div className="relative bg-[url('/core/background.jpg')] rounded-2xl shadow-sm mx-6 -mt-16 z-10 p-6 ">
        <div className="flex items-start gap-10">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100">
              <img src={store.avatar} alt={store.name} className="w-full h-full object-cover" />
            </div>
            {store.trusted && (
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                <BadgeCheck size={22} className="text-[#009b4d] fill-green-100" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className=" min-w-0 ">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">{store.name}</h1>
              {store.isPreferred && (
                <span className="bg-primary text-white text-sm font-medium px-2.5 py-0.5 border border-gray-300">
                  Preferred+
                </span>
              )}
            </div>
            <div className="flex justify-center text-base text-gray-500 flex-col font-medium">
              <span className="flex items-center gap-1"><Clock size={16} />Active 10 phút trước</span>
              <span className="flex items-center gap-1"><MapPin size={16} /> {store.address}</span>

            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-lg text-base font-medium transition-all duration-200 ${isFollowing
                  ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  : 'bg-[#009b4d] text-white hover:bg-[#008a43]'
                  }`}
              >
                <UserPlus size={16} />
                {isFollowing ? 'Đang theo dõi' : 'Follow'}
              </button>
              <button className="cursor-pointer flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <MessageCircle size={16} />
                Chat
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 shrink-0 text-base ml-40 flex-1 font-medium">
            <div className="flex items-center gap-2"><Package size={16} className="text-black shrink-0" /><span className="text-black">Products:</span> <span className="font-bold text-[#009b4d]">{store.products}</span></div>
            <div className="flex items-center gap-2"><Eye size={16} className="text-black shrink-0" /><span className="text-black">Followers:</span> <span className="font-bold text-[#009b4d]">{store.followers.toLocaleString()}</span></div>
            <div className="flex items-center gap-2"><UserPlus size={16} className="text-black shrink-0" /><span className="text-black">Following:</span> <span className="font-bold text-[#009b4d]">{store.following}</span></div>
            <div className="flex items-center gap-2"><Star size={16} className="text-black shrink-0" /><span className="text-black">Rating:</span> <span className="font-bold text-[#009b4d]">{store.rating} ({store.totalRating.toLocaleString()})</span></div>
            <div className="flex items-center gap-2"><MessageSquare size={16} className="text-black shrink-0" /><span className="text-black">Chat Performance:</span> <span className="font-bold text-[#009b4d]">{store.responseRate}% ({store.responseTime})</span></div>
            <div className="flex items-center gap-2"><Calendar size={16} className="text-black shrink-0" /><span className="text-black">Joined:</span> <span className="font-bold text-[#009b4d]">{store.joinDate}</span></div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 mx-6">
        <div className="flex items-center border-b border-gray-200 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-200 ${activeTab === tab.key
                ? 'border-[#009b4d] text-[#009b4d]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mx-6 py-6">
        {/* Home Tab */}
        {activeTab === 'home' && (
          <div className="space-y-8">

            {/* About Shop */}
            <section className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 capitalize">
                <Info size={22} className="text-primary" />
                Giới thiệu shop
              </h2>
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-semibold text-gray-500 uppercase tracking-wider mb-2 ">Mô tả</h3>
                  <p className="text-gray-700 leading-relaxed">{store.description}</p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-500 uppercase tracking-wider mb-2">Phân loại sản phẩm</h3>
                  <div className="flex flex-wrap gap-2">
                    {store.categories.map((cat) => (
                      <span key={cat} className="bg-green-50 text-[#009b4d] px-3 py-1 rounded-full text-sm font-medium">{cat}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-500 uppercase tracking-wider mb-2">Chính sách</h3>
                  <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
                    <p className="flex items-center gap-2">✅ Đổi trả trong 7 ngày nếu sản phẩm lỗi</p>
                    <p className="flex items-center gap-2">✅ Hoàn tiền 100% nếu không nhận hàng</p>
                    <p className="flex items-center gap-2">✅ Hỗ trợ khách hàng 24/7</p>
                    <p className="flex items-center gap-2">✅ Miễn phí vận chuyển cho đơn từ 500.000đ</p>
                  </div>
                </div>
              </div>
            </section>
            {/* Recommended For You */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold uppercase text-primary">Đề xuất cho bạn</h2>
                <button
                  onClick={() => setActiveTab('all')}
                  className="flex items-center gap-1 text-[#009b4d] text-sm font-medium hover:underline"
                >
                  Xem tất cả <ChevronRight size={16} />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {allProducts.slice(0, 5).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>

            {/* Hot Deals */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 uppercase">
                  Ưu đãi hot
                </h2>
                <button
                  onClick={() => setActiveTab('all')}
                  className="flex items-center gap-1 text-[#009b4d] text-sm font-medium hover:underline"
                >
                  Xem tất cả <ChevronRight size={16} />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {allProducts.filter(p => (p.discount ?? 0) > 0).slice(0, 5).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>


          </div>
        )}

        {/* Best Seller Tab */}
        {activeTab === 'bestseller' && (
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-[#009b4d]" />
              Sản phẩm bán chạy
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {allProducts.filter(p => p.isBestSeller).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Featured Tab */}
        {activeTab === 'featured' && (
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Sparkles size={20} className="text-amber-500" />
              Sản phẩm nổi bật
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {allProducts.filter(p => p.isFeatured).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* New Products Tab */}
        {activeTab === 'new' && (
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Clock size={20} className="text-blue-500" />
              Sản phẩm mới
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {allProducts.filter(p => p.isNew).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* All Products Tab */}
        {activeTab === 'all' && (
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Package size={20} className="text-[#009b4d]" />
              Tất cả hàng hóa ({allProducts.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {allProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
