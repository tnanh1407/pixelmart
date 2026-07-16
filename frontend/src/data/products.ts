import type { Product } from '@/components/common/ProductCard'

export interface StoreProduct {
  id: number
  name: string
  image: string
  price: number
  discount: number
}

export interface StoreDetail {
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
}

export interface ProductReview {
  id: number
  author: string
  rating: number
  comment: string
  images?: string[]
  createdAt: string
  variant?: string
  likes: number
}

export interface ProductDetailData {
  id: number
  name: string
  images: string[]
  originalPrice: number
  salePrice: number
  discount: number
  rating: number
  sold: number
  description: string
  origin: string
  shippingArea: string
  fastShipping: string
  detailedDescription?: string
  ingredients?: string
  whoShouldUse?: string[]
  benefits?: string
  totalReviews?: number
  ratingBreakdown?: { 5: number; 4: number; 3: number; 2: number; 1: number }
  reviews?: ProductReview[]
  shop: {
    name: string
    avatar: string
    trusted: boolean
    rating: number
    totalRating: number
    responseRate: number
    responseTime: string
    products: number
    followers: number
    joinDate: string
    ratings: { uyTin: number; dungMoTa: number; thaiDo: number; giaoHang: number }
  }
}

// ── Flash Sale Products ──
export const flashSaleProducts: Product[] = [
  { id: 1, name: 'Combo thịt gác bếp Cao Lan', image: '/homeLayout/homePage/banner/banner_1.webp', originalPrice: 345000, salePrice: 289000, discount: 15, badge: 'FlashSale', category: 'Nông sản và Thực phẩm', shopName: 'Đặc Sản Hà Nội' },
  { id: 2, name: 'OCOP - Đông Trùng Hạ Thảo Tam Đào Sấy Thăng Hoa', image: '/homeLayout/homePage/banner/banner_2.webp', originalPrice: 275000, salePrice: 190000, discount: 31, badge: 'FlashSale', category: 'OCOP', shopName: 'OCOP Premium' },
  { id: 3, name: 'OCOP - Mật Ong Đông Trùng Hạ Thảo Tam Đào - Hũ 400g', image: '/homeLayout/homePage/banner/banner_3.webp', originalPrice: 380000, salePrice: 250000, discount: 34, badge: 'FlashSale', category: 'OCOP', shopName: 'Nông Sản Sạch' },
  { id: 4, name: 'OCOP - Đông Trùng Hạ Thảo Tam Đào Sấy Thăng Hoa', image: '/homeLayout/homePage/banner/banner_1.webp', originalPrice: 528000, salePrice: 350000, discount: 34, badge: 'FlashSale', category: 'OCOP', shopName: 'OCOP Premium' },
  { id: 5, name: 'OCOP - Hành tím Vĩnh Châu Sóc Trăng - 5kg', image: '/homeLayout/homePage/banner/banner_2.webp', originalPrice: 190000, salePrice: 175000, discount: 8, badge: 'FlashSale', category: 'OCOP', shopName: 'Đặc Sản Hà Nội' },
]

// ── Top Selling Products ──
export const topSellingProducts: Product[] = [
  { id: 101, name: 'Gạo Séng Cù - Đặc Sản Lào Cai - Túi 5kg', image: '/homeLayout/homePage/banner/banner_1.webp', originalPrice: null, salePrice: 175500, discount: 0, rating: 5, reviews: 743, category: 'Nông sản và Thực phẩm', shopName: 'Đặc Sản Hà Nội' },
  { id: 102, name: 'Khoai Lang Giống Nhật 365 Fresh - Thùng 3kg', image: '/homeLayout/homePage/banner/banner_2.webp', originalPrice: null, salePrice: 168000, discount: 0, rating: 4, reviews: 98, category: 'Nông sản và Thực phẩm', shopName: 'Nông Sản Sạch' },
  { id: 103, name: 'OCOP - Bánh Sữa Non Ba Vì - Gói 500g', image: '/homeLayout/homePage/banner/banner_3.webp', originalPrice: 144000, salePrice: 82080, discount: 20, rating: 5, reviews: 94, category: 'OCOP', shopName: 'OCOP Premium' },
  { id: 104, name: 'Mỳ Gạo Chũ Bắc Giang Dương Kiên - Combo 2 Gói 500g', image: '/homeLayout/homePage/banner/banner_1.webp', originalPrice: null, salePrice: 76000, discount: 0, rating: 5, reviews: 85, category: 'Nông sản và Thực phẩm', shopName: 'Đặc Sản Hà Nội' },
  { id: 105, name: 'OCOP - Miến Dong Hưng Phúc - Đặc Sản Điện Biên', image: '/homeLayout/homePage/banner/banner_2.webp', originalPrice: null, salePrice: 80000, discount: 0, rating: 5, reviews: 70, category: 'OCOP', shopName: 'Nông Sản Sạch' },
  { id: 106, name: 'OCOP - Thịt Gác Bếp Cao Lan - Gói 200g', image: '/homeLayout/homePage/banner/banner_3.webp', originalPrice: null, salePrice: 139000, discount: 0, rating: 5, reviews: 57, category: 'OCOP', shopName: 'Đặc Sản Hà Nội' },
  { id: 107, name: 'OCOP - Miến Dong Xuất Khẩu Dương Kiên - Combo 2 Gói', image: '/homeLayout/homePage/banner/banner_1.webp', originalPrice: null, salePrice: 118000, discount: 0, rating: 5, reviews: 56, category: 'OCOP', shopName: 'Nông Sản Sạch' },
  { id: 108, name: 'Gạo ST25 Ông Cốc - Túi 5kg', image: '/homeLayout/homePage/banner/banner_2.webp', originalPrice: null, salePrice: 250000, discount: 0, rating: 5, reviews: 47, category: 'Nông sản và Thực phẩm', shopName: 'Đặc Sản Hà Nội' },
  { id: 109, name: 'OCOP - Xoài Sấy Dẻo Quỳnh Thanh - Hộp 200gr', image: '/homeLayout/homePage/banner/banner_3.webp', originalPrice: 96000, salePrice: 48600, discount: 20, rating: 5, reviews: 39, category: 'OCOP', shopName: 'OCOP Premium' },
  { id: 110, name: 'OCOP - Thịt Gác Bếp Cao Lan - Gói 500g', image: '/homeLayout/homePage/banner/banner_1.webp', originalPrice: null, salePrice: 159000, discount: 0, rating: 5, reviews: 38, category: 'OCOP', shopName: 'Đặc Sản Hà Nội' },
]

// ── OCOP Products ──
export const ocopProducts: Product[] = [
  { id: 201, name: 'Bánh Phiale Đậu Xanh Sầu Riêng - Tân Huê Viên', image: '/homeLayout/homePage/banner/banner_1.webp', originalPrice: null, salePrice: 80000, discount: 0, rating: 5, reviews: 0, category: 'OCOP', shopName: 'OCOP Premium' },
  { id: 202, name: 'Bánh Phiale Đậu Xanh Sầu Riêng - Tấn Huê Viên', image: '/homeLayout/homePage/banner/banner_2.webp', originalPrice: null, salePrice: 80000, discount: 0, rating: 5, reviews: 3, category: 'OCOP', shopName: 'OCOP Premium' },
  { id: 203, name: 'Bánh Phiale Khoai Môn Sầu Riêng - Tấn Huê Viên', image: '/homeLayout/homePage/banner/banner_3.webp', originalPrice: 102000, salePrice: 96000, discount: 0, rating: 5, reviews: 0, category: 'OCOP', shopName: 'OCOP Premium' },
  { id: 204, name: 'OCOP - Mắm Tép Chưng Thịt PTK - Gói 200g', image: '/homeLayout/homePage/banner/banner_1.webp', originalPrice: null, salePrice: 91000, discount: 0, rating: 5, reviews: 1, category: 'OCOP', shopName: 'Nông Sản Sạch' },
  { id: 205, name: 'OCOP - Mật Ong Hoa Nhãn Danh Vi - Chai Nhựa 1L', image: '/homeLayout/homePage/banner/banner_2.webp', originalPrice: null, salePrice: 230000, discount: 0, rating: 5, reviews: 19, category: 'OCOP', shopName: 'Nông Sản Sạch' },
  { id: 206, name: 'OCOP - Tinh Bột Nghệ Turmeric Hoàng Minh Châu', image: '/homeLayout/homePage/banner/banner_3.webp', originalPrice: 330000, salePrice: 265903, discount: 33, rating: 5, reviews: 9, category: 'OCOP', shopName: 'OCOP Premium' },
  { id: 207, name: 'Mật Ong Hoa Sú Vẹt Danh Vi - Chai Nhựa 1L', image: '/homeLayout/homePage/banner/banner_1.webp', originalPrice: null, salePrice: 200000, discount: 0, rating: 5, reviews: 7, category: 'OCOP', shopName: 'Nông Sản Sạch' },
  { id: 208, name: 'Bánh Phiale Khoai Môn Sầu Riêng - Tấn Huê Viên', image: '/homeLayout/homePage/banner/banner_2.webp', originalPrice: 102000, salePrice: 96000, discount: 0, rating: 5, reviews: 0, category: 'OCOP', shopName: 'OCOP Premium' },
  { id: 209, name: 'OCOP - Mắm Mía miền Xanh Chai 500ml', image: '/homeLayout/homePage/banner/banner_3.webp', originalPrice: null, salePrice: 70000, discount: 0, rating: 5, reviews: 4, category: 'OCOP', shopName: 'Nông Sản Sạch' },
  { id: 210, name: 'OCOP - Thịt Xá Xíu Mắm Ruốc PTK - Gói 200g', image: '/homeLayout/homePage/banner/banner_1.webp', originalPrice: null, salePrice: 91000, discount: 0, rating: 5, reviews: 21, category: 'OCOP', shopName: 'OCOP Premium' },
]

// ── Category Products ──
export const categoryProducts: Product[] = [
  { id: 301, name: 'OCOP - Chấm Chèo Lục Lệ - Hộp 250g', image: '/homeLayout/homePage/banner/banner_1.webp', originalPrice: null, salePrice: 40000, discount: 0, rating: 5, reviews: 0, category: 'OCOP', shopName: 'OCOP Premium' },
  { id: 302, name: 'OCOP - Miến Dong Hưng Phúc - Đặc sản Điện Biên', image: '/homeLayout/homePage/banner/banner_2.webp', originalPrice: null, salePrice: 80000, discount: 0, rating: 5, reviews: 26, category: 'OCOP', shopName: 'Nông Sản Sạch' },
  { id: 303, name: 'Dưa Lưới Ninh Thuận', image: '/homeLayout/homePage/banner/banner_3.webp', originalPrice: null, salePrice: 289000, discount: 0, rating: 5, reviews: 1, category: 'Nông sản và Thực phẩm', shopName: 'Đặc Sản Hà Nội' },
  { id: 304, name: 'Bột Sắn Dây Miền Bắc 3 Sạch - Gói 500g', image: '/homeLayout/homePage/banner/banner_1.webp', originalPrice: null, salePrice: 77000, discount: 0, rating: 5, reviews: 28, category: 'Nông sản và Thực phẩm', shopName: 'Nông Sản Sạch' },
  { id: 305, name: 'OCOP - Táo Sấy Dẻo Tách Hạt Thái Thuận - Túi 418g', image: '/homeLayout/homePage/banner/banner_2.webp', originalPrice: null, salePrice: 96000, discount: 0, rating: 5, reviews: 0, category: 'OCOP', shopName: 'OCOP Premium' },
  { id: 306, name: 'Thịt Trâu Hun Khói 3 Sạch - Túi 500g', image: '/homeLayout/homePage/banner/banner_3.webp', originalPrice: null, salePrice: 455000, discount: 0, rating: 5, reviews: 2, category: 'Sức khỏe và làm đẹp', shopName: 'Đặc Sản Hà Nội' },
  { id: 307, name: 'Thịt Ba Chỉ Hun Khói 3 Sạch - Túi 500g', image: '/homeLayout/homePage/banner/banner_1.webp', originalPrice: null, salePrice: 190000, discount: 0, rating: 5, reviews: 0, category: 'Nông sản và Thực phẩm', shopName: 'Nông Sản Sạch' },
  { id: 308, name: 'OCOP - Miến Gia Huy Ngọc Cương - Túi 500g', image: '/homeLayout/homePage/banner/banner_2.webp', originalPrice: null, salePrice: 90000, discount: 0, rating: 5, reviews: 0, category: 'OCOP', shopName: 'OCOP Premium' },
  { id: 309, name: 'OCOP - Mắm Mía Miền Xanh Chai 500ml', image: '/homeLayout/homePage/banner/banner_3.webp', originalPrice: null, salePrice: 70000, discount: 0, rating: 5, reviews: 4, category: 'OCOP', shopName: 'Nông Sản Sạch' },
  { id: 310, name: 'Gạo Nếp Pi Pất Cao Bằng 3 Sạch', image: '/homeLayout/homePage/banner/banner_1.webp', originalPrice: 115000, salePrice: 65000, discount: 10, rating: 5, reviews: 0, category: 'Nông sản và Thực phẩm', shopName: 'Đặc Sản Hà Nội' },
]

// ── Store Detail Products ──
export const storeDetailProducts: (Product & { isBestSeller: boolean; isNew: boolean; isFeatured: boolean })[] = [
  { id: 401, name: 'Bưởi Đoan Hùng Bưởi Cát Quế...', image: '/homeLayout/homePage/banner/banner_1.webp', originalPrice: 40000, salePrice: 28000, discount: 30, rating: 4.8, sold: 1200, isBestSeller: true, isNew: false, isFeatured: true, category: 'Nông sản và Thực phẩm', shopName: 'Đặc Sản Hà Nội' },
  { id: 402, name: 'Cam Cao Phong Hòa Bình...', image: '/homeLayout/homePage/banner/banner_2.webp', originalPrice: null, salePrice: 45000, discount: 0, rating: 4.5, sold: 800, isBestSeller: true, isNew: false, isFeatured: false, category: 'Nông sản và Thực phẩm', shopName: 'Nông Sản Sạch' },
  { id: 403, name: 'Na dai Tả Van Lào Cai...', image: '/homeLayout/homePage/banner/banner_3.webp', originalPrice: 75000, salePrice: 60000, discount: 20, rating: 4.9, sold: 2100, isBestSeller: true, isNew: false, isFeatured: true, category: 'Nông sản và Thực phẩm', shopName: 'Đặc Sản Hà Nội' },
  { id: 404, name: 'Gạo Séng Cù - Đặc Sản Lào Cai...', image: '/homeLayout/homePage/banner/banner_1.webp', originalPrice: null, salePrice: 175500, discount: 0, rating: 5, sold: 500, isBestSeller: false, isNew: true, isFeatured: true, category: 'Nông sản và Thực phẩm', shopName: 'Đặc Sản Hà Nội' },
  { id: 405, name: 'Mật ong rừng天然...', image: '/homeLayout/homePage/banner/banner_2.webp', originalPrice: 400000, salePrice: 350000, discount: 12, rating: 4.7, sold: 350, isBestSeller: false, isNew: true, isFeatured: false, category: 'Sức khỏe và làm đẹp', shopName: 'Nông Sản Sạch' },
  { id: 406, name: 'Thịt bò gác bếp Sơn La...', image: '/homeLayout/homePage/banner/banner_3.webp', originalPrice: 420000, salePrice: 350000, discount: 17, rating: 4.8, sold: 950, isBestSeller: true, isNew: false, isFeatured: true, category: 'Nông sản và Thực phẩm', shopName: 'Đặc Sản Hà Nội' },
  { id: 407, name: 'Rượu ngô Na Hang...', image: '/homeLayout/homePage/banner/banner_1.webp', originalPrice: null, salePrice: 120000, discount: 0, rating: 4.6, sold: 430, isBestSeller: false, isNew: true, isFeatured: false, category: 'Nông sản và Thực phẩm', shopName: 'Nông Sản Sạch' },
  { id: 408, name: 'Miến dong Bình Liêu...', image: '/homeLayout/homePage/banner/banner_2.webp', originalPrice: 106000, salePrice: 85000, discount: 20, rating: 4.9, sold: 1800, isBestSeller: true, isNew: false, isFeatured: true, category: 'OCOP', shopName: 'OCOP Premium' },
  { id: 409, name: 'Măng ớt Tuyên Quang...', image: '/homeLayout/homePage/banner/banner_3.webp', originalPrice: null, salePrice: 45000, discount: 0, rating: 4.4, sold: 600, isBestSeller: false, isNew: true, isFeatured: false, category: 'Nông sản và Thực phẩm', shopName: 'Nông Sản Sạch' },
  { id: 410, name: 'Tinh bột nghệ Yên Bái...', image: '/homeLayout/homePage/banner/banner_1.webp', originalPrice: 120000, salePrice: 90000, discount: 25, rating: 4.7, sold: 720, isBestSeller: true, isNew: false, isFeatured: true, category: 'OCOP', shopName: 'OCOP Premium' },
  { id: 411, name: 'Vải thiều Lục Ngạn...', image: '/homeLayout/homePage/banner/banner_2.webp', originalPrice: null, salePrice: 65000, discount: 0, rating: 4.3, sold: 280, isBestSeller: false, isNew: true, isFeatured: false, category: 'Nông sản và Thực phẩm', shopName: 'Đặc Sản Hà Nội' },
  { id: 412, name: 'Chè Shan Tuyết...', image: '/homeLayout/homePage/banner/banner_3.webp', originalPrice: 180000, salePrice: 150000, discount: 17, rating: 4.8, sold: 1500, isBestSeller: true, isNew: false, isFeatured: true, category: 'OCOP', shopName: 'OCOP Premium' },
  { id: 413, name: 'Bánh đậu xanh Rồng Vàng...', image: '/homeLayout/homePage/banner/banner_1.webp', originalPrice: null, salePrice: 85000, discount: 0, rating: 4.6, sold: 900, isBestSeller: false, isNew: true, isFeatured: true, category: 'OCOP', shopName: 'OCOP Premium' },
  { id: 414, name: 'Rượu nho Ninh Thuận...', image: '/homeLayout/homePage/banner/banner_2.webp', originalPrice: 150000, salePrice: 120000, discount: 20, rating: 4.5, sold: 380, isBestSeller: false, isNew: true, isFeatured: false, category: 'Nông sản và Thực phẩm', shopName: 'Nông Sản Sạch' },
  { id: 415, name: 'Mè xửng Huế...', image: '/homeLayout/homePage/banner/banner_3.webp', originalPrice: null, salePrice: 65000, discount: 0, rating: 4.7, sold: 1100, isBestSeller: true, isNew: false, isFeatured: true, category: 'OCOP', shopName: 'Đặc Sản Hà Nội' },
]

// ── Related Products ──
export const relatedProducts: Product[] = [
  { id: 501, name: 'OCOP - Mật Ong Đông Trùng Hạ Thảo Tam Đào - Hũ 400g', image: '/homeLayout/homePage/banner/banner_2.webp', originalPrice: 380000, salePrice: 250000, discount: 34, rating: 5, reviews: 19, category: 'OCOP', shopName: 'Nông Sản Sạch' },
  { id: 502, name: 'OCOP - Tinh Bột Nghệ Turmeric Hoàng Minh Châu', image: '/homeLayout/homePage/banner/banner_3.webp', originalPrice: 330000, salePrice: 265903, discount: 33, rating: 5, reviews: 9, category: 'OCOP', shopName: 'OCOP Premium' },
  { id: 503, name: 'OCOP - Thịt Gác Bếp Cao Lan - Gói 200g', image: '/homeLayout/homePage/banner/banner_1.webp', originalPrice: null, salePrice: 139000, discount: 0, rating: 5, reviews: 57, category: 'OCOP', shopName: 'Đặc Sản Hà Nội' },
  { id: 504, name: 'OCOP - Miến Dong Hưng Phúc - Đặc Sản Điện Biên', image: '/homeLayout/homePage/banner/banner_2.webp', originalPrice: null, salePrice: 80000, discount: 0, rating: 5, reviews: 70, category: 'OCOP', shopName: 'Nông Sản Sạch' },
]

// ── Trending Products (Đang được quan tâm) ──
export const trendingProducts: Product[] = [
  { id: 601, name: 'Cao Tinh Chất Đông Trùng Cốt Khí - Hộp ...', image: '/homeLayout/homePage/banner/banner_1.webp', originalPrice: 1650000, salePrice: 1449000, discount: 12, rating: 5, reviews: 45, category: 'OCOP', shopName: 'Đặc Sản Hà Nội', badge: 'Bán chạy' },
  { id: 602, name: 'OCOP - Đông Trùng Hạ Thảo Tam Đào K...', image: '/homeLayout/homePage/banner/banner_2.webp', originalPrice: 1500000, salePrice: 1287000, discount: 14, rating: 5, reviews: 32, category: 'OCOP', shopName: 'Nông Sản Sạch', badge: 'Bán chạy' },
  { id: 603, name: 'OCOP - Đông Trùng Hạ Thảo Tam Đào S...', image: '/homeLayout/homePage/banner/banner_3.webp', originalPrice: 640000, salePrice: 540000, discount: 16, rating: 5, reviews: 28, category: 'OCOP', shopName: 'OCOP Premium', badge: 'Bán chạy' },
  { id: 604, name: 'OCOP - Đông trùng hạ thảo Tam Đào Ký ch...', image: '/homeLayout/homePage/banner/banner_1.webp', originalPrice: 1150000, salePrice: 988000, discount: 14, rating: 5, reviews: 19, category: 'OCOP', shopName: 'Đặc Sản Hà Nội', badge: 'Bán chạy' },
  { id: 605, name: 'Hộp Quà Đông Trùng Hạ Thảo Tam Đào: 1...', image: '/homeLayout/homePage/banner/banner_2.webp', originalPrice: 450000, salePrice: 375000, discount: 17, rating: 5, reviews: 15, category: 'OCOP', shopName: 'Nông Sản Sạch', badge: 'Bán chạy' },
]

// ── Product Detail Data ──
export const productDetails: Record<number, ProductDetailData> = {
  1: {
    id: 1,
    name: 'OCOP - Đông Trùng Hạ Thảo Tam Đào Sấy Thăng Hoa - Hũ 10g',
    images: [
      '/homeLayout/homePage/banner/banner_1.webp',
      '/homeLayout/homePage/banner/banner_2.webp',
      '/homeLayout/homePage/banner/banner_3.webp',
      '/homeLayout/homePage/banner/banner_1.webp',
      '/homeLayout/homePage/banner/banner_1.webp',
      '/homeLayout/homePage/banner/banner_1.webp',
      '/homeLayout/homePage/banner/banner_1.webp',
      '/homeLayout/homePage/banner/banner_1.webp',
      '/homeLayout/homePage/banner/banner_1.webp',
    ],
    originalPrice: 275000,
    salePrice: 190000,
    discount: 31,
    rating: 5,
    sold: 11,
    description: 'Đông trùng hạ thảo Tam Đào được nuôi cấy tại Vĩnh Phúc, sản phẩm OCOP 4 sao. Sấy thăng hoa giữ nguyên dưỡng chất.',
    origin: 'Vĩnh Phúc',
    shippingArea: 'Chọn khu vực',
    fastShipping: '0',
    detailedDescription: 'Mật ong Đông Trùng Hạ Thảo Tam Đào bao gồm Mật ong hoa tự nhiên nguyên chất (380g), sợi nấm ĐÔNG TRÙNG HẠ THẢO TAM ĐÀO cordyceps militaris (10g). Sự kết hợp giữa ĐÔNG TRÙNG HẠ THẢO TAM ĐÀO và mật ong hoa rừng nguyên chất mang đến hương vị ngọt ngào và nhiều lợi ích vượt trội cho sức khỏe.',
    ingredients: 'Mật ong hoa tự nhiên nguyên chất (380g), sợi nấm ĐÔNG TRÙNG HẠ THẢO TAM ĐÀO cordyceps militaris (10g)',
    whoShouldUse: [
      'Người mệt mỏi, sức đề kháng yếu, mới ốm dậy',
      'Người muốn tăng cường sức khỏe, bồi bổ, tăng cường sinh lý, sinh lực',
      'Người có vấn đề về hô hấp: ho, viêm họng, viêm xoang,...',
      'Người muốn làm đẹp, chống lão hóa',
      'Người có vết thương lâu lành, viêm loét',
    ],
    benefits: 'Tăng cường sức đề kháng, chống viêm, giảm ho, chống oxy hóa, làm đẹp,...',
    totalReviews: 12,
    ratingBreakdown: { 5: 8, 4: 3, 3: 1, 2: 0, 1: 0 },
    reviews: [
      {
        id: 1,
        author: 'Nguyễn Văn A',
        rating: 5,
        comment: 'Sản phẩm rất chất lượng, đóng gói cẩn thận. Đúng như mô tả. Sẽ mua thêm!',
        images: ['/homeLayout/homePage/banner/banner_1.webp', '/homeLayout/homePage/banner/banner_2.webp'],
        createdAt: '2024-01-15',
        variant: 'Hũ 10g',
        likes: 5,
      },
      {
        id: 2,
        author: 'Trần Thị B',
        rating: 5,
        comment: 'Giao hàng nhanh, sản phẩm OCOP đạt chuẩn. Hương vị thơm ngon.',
        images: ['/homeLayout/homePage/banner/banner_3.webp'],
        createdAt: '2024-01-10',
        variant: 'Hũ 10g',
        likes: 3,
      },
      {
        id: 3,
        author: 'Lê Văn C',
        rating: 4,
        comment: 'Sản phẩm tốt, nhưng hộp hơi nhỏ so với giá tiền. Overall vẫn hài lòng.',
        createdAt: '2024-01-05',
        variant: 'Hũ 10g',
        likes: 2,
      },
    ],
    shop: {
      name: 'Bưu Điện Tỉnh Vĩnh Phúc',
      avatar: '/homeLayout/homePage/banner/banner_1.webp',
      trusted: true,
      rating: 5,
      totalRating: 18400,
      responseRate: 100,
      responseTime: 'trong vài giờ',
      products: 99,
      followers: 5200,
      joinDate: 'Tháng 3, 2022',
      ratings: { uyTin: 5, dungMoTa: 5, thaiDo: 5, giaoHang: 5 },
    },
  },
}

// ── Store Detail Data ──
export const storeDetails: Record<number, StoreDetail> = {
  1: {
    id: 1,
    name: 'Đặc Sản Hà Nội',
    avatar: '/homeLayout/homePage/banner/banner_1.webp',
    banner: '/homeLayout/homePage/banner/banner_1.webp',
    description: 'Chuyên cung cấp đặc sản Hà Nội và các vùng miền. Cam kết 100% sản phẩm OCOP đạt tiêu chuẩn chất lượng.',
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

// ── Store List Data ──
export const stores: {
  id: number
  name: string
  avatar: string
  sold: number
  rating: number
  trusted: boolean
  products: StoreProduct[]
}[] = [
    {
      id: 1,
      name: 'Bưu điện khu vực Đoan Hùng',
      avatar: '/homeLayout/homePage/banner/banner_1.webp',
      sold: 156, rating: 5, trusted: true,
      products: [
        { id: 601, name: 'Bưởi Đoan Hùng Bưởi Cát Quế...', image: '/homeLayout/homePage/banner/banner_1.webp', price: 28000, discount: 30 },
        { id: 602, name: 'Bưởi Đoan Hùng Bưởi Cát Quế...', image: '/homeLayout/homePage/banner/banner_2.webp', price: 28000, discount: 0 },
        { id: 603, name: 'Bưởi Đoan Hùng...', image: '/homeLayout/homePage/banner/banner_3.webp', price: 22000, discount: 0 },
        { id: 604, name: 'Bưởi Diễn Hà Nội...', image: '/homeLayout/homePage/banner/banner_1.webp', price: 35000, discount: 15 },
        { id: 605, name: 'Cam Cao Phong Hòa Bình...', image: '/homeLayout/homePage/banner/banner_2.webp', price: 45000, discount: 0 },
        { id: 606, name: 'Na dai Tả Van Lào Cai...', image: '/homeLayout/homePage/banner/banner_3.webp', price: 60000, discount: 20 },
      ],
    },
    {
      id: 2,
      name: 'MD Queens',
      avatar: '/homeLayout/homePage/banner/banner_2.webp',
      sold: 342, rating: 4.8, trusted: false,
      products: [
        { id: 607, name: 'Nước ép táo đỏ organic...', image: '/homeLayout/homePage/banner/banner_1.webp', price: 120000, discount: 10 },
        { id: 608, name: 'Sinh tố việt quất...', image: '/homeLayout/homePage/banner/banner_2.webp', price: 85000, discount: 0 },
      ],
    },
    {
      id: 3,
      name: 'OCOP_CSSX NĂM ĐẦU',
      avatar: '/homeLayout/homePage/banner/banner_3.webp',
      sold: 89, rating: 5, trusted: true,
      products: [
        { id: 609, name: 'OCOP- Gạo Lứt Sấy Năm Đầu -...', image: '/homeLayout/homePage/banner/banner_1.webp', price: 100000, discount: 0 },
        { id: 610, name: 'OCOP - Bột Gạo Lứt Huyết Rồng...', image: '/homeLayout/homePage/banner/banner_2.webp', price: 55000, discount: 76 },
        { id: 611, name: 'OCOP - Trà Atisô...', image: '/homeLayout/homePage/banner/banner_3.webp', price: 95000, discount: 25 },
        { id: 612, name: 'OCOP - Mè đen sạch...', image: '/homeLayout/homePage/banner/banner_1.webp', price: 75000, discount: 0 },
      ],
    },
    {
      id: 4,
      name: 'HKD Đoàn Lương',
      avatar: '/homeLayout/homePage/banner/banner_1.webp',
      sold: 1024, rating: 4.9, trusted: true,
      products: [
        { id: 613, name: 'Thịt bò gác bếp Sơn La...', image: '/homeLayout/homePage/banner/banner_2.webp', price: 350000, discount: 15 },
        { id: 614, name: 'Gà đen Hmong...', image: '/homeLayout/homePage/banner/banner_3.webp', price: 180000, discount: 0 },
        { id: 615, name: 'Rượu ngô Na Hang...', image: '/homeLayout/homePage/banner/banner_1.webp', price: 120000, discount: 10 },
      ],
    },
    {
      id: 5,
      name: 'Nông Sản Sạch Phú Thọ',
      avatar: '/homeLayout/homePage/banner/banner_2.webp',
      sold: 210, rating: 4.7, trusted: true,
      products: [
        { id: 616, name: 'Miến dong Bình Liêu...', image: '/homeLayout/homePage/banner/banner_1.webp', price: 85000, discount: 20 },
        { id: 617, name: 'Nấm lim xanh...', image: '/homeLayout/homePage/banner/banner_2.webp', price: 250000, discount: 0 },
        { id: 618, name: 'Măng ớt Tuyên Quang...', image: '/homeLayout/homePage/banner/banner_3.webp', price: 45000, discount: 30 },
      ],
    },
    {
      id: 6,
      name: 'Đặc Sản Hà Giang',
      avatar: '/homeLayout/homePage/banner/banner_3.webp',
      sold: 67, rating: 4.5, trusted: false,
      products: [
        { id: 619, name: 'Thắng cống Hà Giang...', image: '/homeLayout/homePage/banner/banner_1.webp', price: 200000, discount: 0 },
        { id: 620, name: 'Chè Shan Tuyết...', image: '/homeLayout/homePage/banner/banner_2.webp', price: 150000, discount: 10 },
      ],
    },
    {
      id: 7,
      name: 'OCOP Yên Bái',
      avatar: '/homeLayout/homePage/banner/banner_1.webp',
      sold: 445, rating: 4.8, trusted: true,
      products: [
        { id: 621, name: 'Tinh bột nghệ Yên Bái...', image: '/homeLayout/homePage/banner/banner_2.webp', price: 90000, discount: 25 },
        { id: 622, name: 'Măng cụt sấy...', image: '/homeLayout/homePage/banner/banner_3.webp', price: 75000, discount: 0 },
        { id: 623, name: 'Rau cảiOPS...', image: '/homeLayout/homePage/banner/banner_1.webp', price: 30000, discount: 15 },
        { id: 624, name: 'Mật ong rừng...', image: '/homeLayout/homePage/banner/banner_2.webp', price: 350000, discount: 5 },
      ],
    },
    {
      id: 8,
      name: 'Thực Phẩm Sạch Bắc Giang',
      avatar: '/homeLayout/homePage/banner/banner_2.webp',
      sold: 189, rating: 4.6, trusted: false,
      products: [
        { id: 625, name: 'Vải thiều Lục Ngạn...', image: '/homeLayout/homePage/banner/banner_1.webp', price: 65000, discount: 40 },
        { id: 626, name: 'Nhãn sấy...', image: '/homeLayout/homePage/banner/banner_3.webp', price: 80000, discount: 0 },
      ],
    },
    {
      id: 9,
      name: 'Shop Organic Hòa Bình',
      avatar: '/homeLayout/homePage/banner/banner_3.webp',
      sold: 523, rating: 4.9, trusted: true,
      products: [
        { id: 627, name: 'Rượu cần bản...', image: '/homeLayout/homePage/banner/banner_1.webp', price: 280000, discount: 0 },
        { id: 628, name: 'Cơm lam...', image: '/homeLayout/homePage/banner/banner_2.webp', price: 45000, discount: 10 },
        { id: 629, name: 'Gà tre...', image: '/homeLayout/homePage/banner/banner_3.webp', price: 160000, discount: 5 },
      ],
    },
    {
      id: 10,
      name: 'Đặc Sản Miền Núi',
      avatar: '/homeLayout/homePage/banner/banner_1.webp',
      sold: 78, rating: 4.4, trusted: false,
      products: [
        { id: 630, name: 'Rau dớn rừng...', image: '/homeLayout/homePage/banner/banner_2.webp', price: 55000, discount: 0 },
        { id: 631, name: 'Măng vầu...', image: '/homeLayout/homePage/banner/banner_3.webp', price: 35000, discount: 20 },
      ],
    },
    {
      id: 11,
      name: 'OCOP Hải Dương',
      avatar: '/homeLayout/homePage/banner/banner_2.webp',
      sold: 312, rating: 4.7, trusted: true,
      products: [
        { id: 632, name: 'Bánh đậu xanh Rồng Vàng...', image: '/homeLayout/homePage/banner/banner_1.webp', price: 85000, discount: 15 },
        { id: 633, name: 'Rượu nho...', image: '/homeLayout/homePage/banner/banner_2.webp', price: 120000, discount: 0 },
        { id: 634, name: 'Mè xửng...', image: '/homeLayout/homePage/banner/banner_3.webp', price: 65000, discount: 10 },
        { id: 635, name: 'Trà sen...', image: '/homeLayout/homePage/banner/banner_1.webp', price: 180000, discount: 25 },
      ],
    },
    {
      id: 12,
      name: 'Nông Sản Vĩnh Phúc',
      avatar: '/homeLayout/homePage/banner/banner_3.webp',
      sold: 156, rating: 4.5, trusted: false,
      products: [
        { id: 636, name: 'Đà điểu Tam Đảo...', image: '/homeLayout/homePage/banner/banner_1.webp', price: 450000, discount: 0 },
        { id: 637, name: 'Nấm linh chi...', image: '/homeLayout/homePage/banner/banner_2.webp', price: 320000, discount: 10 },
      ],
    },
    {
      id: 13,
      name: 'Shop Qùa Tặng OCOP',
      avatar: '/homeLayout/homePage/banner/banner_1.webp',
      sold: 892, rating: 5, trusted: true,
      products: [
        { id: 638, name: 'Giỏ quà Tết OCOP...', image: '/homeLayout/homePage/banner/banner_2.webp', price: 550000, discount: 10 },
        { id: 639, name: 'Hộp quà Trung thu...', image: '/homeLayout/homePage/banner/banner_3.webp', price: 380000, discount: 0 },
        { id: 640, name: 'Set quà tặng doanh nghiệp...', image: '/homeLayout/homePage/banner/banner_1.webp', price: 890000, discount: 15 },
      ],
    },
    {
      id: 14,
      name: 'Đặc Sản Khánh Hòa',
      avatar: '/homeLayout/homePage/banner/banner_2.webp',
      sold: 234, rating: 4.6, trusted: false,
      products: [
        { id: 641, name: 'Yến sào Nha Trang...', image: '/homeLayout/homePage/banner/banner_1.webp', price: 1200000, discount: 5 },
        { id: 642, name: 'Nước mắm Phú Quốc...', image: '/homeLayout/homePage/banner/banner_3.webp', price: 85000, discount: 20 },
      ],
    },
    {
      id: 15,
      name: 'Thực Phẩm Sạch Đà Lạt',
      avatar: '/homeLayout/homePage/banner/banner_3.webp',
      sold: 1067, rating: 4.8, trusted: true,
      products: [
        { id: 643, name: 'Dâu tây Đà Lạt...', image: '/homeLayout/homePage/banner/banner_1.webp', price: 120000, discount: 25 },
        { id: 644, name: 'Atisô Đà Lạt...', image: '/homeLayout/homePage/banner/banner_2.webp', price: 95000, discount: 0 },
        { id: 645, name: 'Rau củ hữu cơ...', image: '/homeLayout/homePage/banner/banner_3.webp', price: 65000, discount: 15 },
        { id: 646, name: 'Mứt hồng...', image: '/homeLayout/homePage/banner/banner_1.webp', price: 75000, discount: 30 },
        { id: 647, name: 'Trà Atisô...', image: '/homeLayout/homePage/banner/banner_2.webp', price: 110000, discount: 0 },
      ],
    },
  ]

// ── Provinces ──
export const provinces = [
  'Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
  'Bình Dương', 'Đồng Nai', 'Khánh Hòa', 'Thanh Hóa', 'Nghệ An',
]
