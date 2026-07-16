import { render, screen } from '@testing-library/react'
import Footer from './Footer'

describe('Footer - Render & Content', () => {
  beforeEach(() => {
    render(<Footer />)
  })

  test('renders company name', () => {
    expect(screen.getByText('TỔNG CÔNG TY BƯU ĐIỆN VIỆT NAM')).toBeInTheDocument()
  })

  test('renders business registration number', () => {
    expect(screen.getByText(/Giấy chứng nhận đăng ký doanh nghiệp số: 0102595740/i)).toBeInTheDocument()
  })

  test('renders address', () => {
    expect(screen.getByText(/Số 5 Phạm Hùng, Phường Cầu Giấy, TP Hà Nội/)).toBeInTheDocument()
  })

  test('renders phone number', () => {
    expect(screen.getByText('1900 565 657')).toBeInTheDocument()
  })

  test('renders email', () => {
    expect(screen.getByText('nongsantmdt@vnpost.vn')).toBeInTheDocument()
  })

  test('renders 4 column headings', () => {
    expect(screen.getByText('DANH MỤC')).toBeInTheDocument()
    expect(screen.getByText('HỖ TRỢ')).toBeInTheDocument()
    expect(screen.getByText('CHÍNH SÁCH')).toBeInTheDocument()
    expect(screen.getByText('TẢI ỨNG DỤNG')).toBeInTheDocument()
  })

  test('renders copyright text', () => {
    expect(screen.getByText('© 2024 buudien.vn. All rights reserved.')).toBeInTheDocument()
  })

  test('renders "Kết nối:" text', () => {
    expect(screen.getByText('Kết nối:')).toBeInTheDocument()
  })
})

describe('Footer - Category Links', () => {
  beforeEach(() => {
    render(<Footer />)
  })

  test('renders all 5 category links', () => {
    const categories = ['Sản phẩm OCOP', 'Thực phẩm bổ dưỡng', 'Sức khỏe và làm đẹp', 'Thực phẩm và Đặc sản', 'Đồ uống']
    categories.forEach((cat) => {
      expect(screen.getByText(cat)).toBeInTheDocument()
    })
  })

  test('category links are inside list items', () => {
    const categoryLink = screen.getByText('Sản phẩm OCOP')
    expect(categoryLink.closest('li')).toBeInTheDocument()
  })
})

describe('Footer - Support Links', () => {
  beforeEach(() => {
    render(<Footer />)
  })

  test('renders all 3 support links', () => {
    expect(screen.getByText('Quyền và Nghĩa vụ')).toBeInTheDocument()
    expect(screen.getByText('Quy định đóng gói')).toBeInTheDocument()
    expect(screen.getByText('Đăng ký thành viên')).toBeInTheDocument()
  })
})

describe('Footer - Policy Links', () => {
  beforeEach(() => {
    render(<Footer />)
  })

  test('renders all 4 policy links', () => {
    expect(screen.getByText('Hướng dẫn mua hàng')).toBeInTheDocument()
    expect(screen.getByText('Hướng dẫn bán hàng')).toBeInTheDocument()
    expect(screen.getByText('Chính sách đổi trả')).toBeInTheDocument()
    expect(screen.getByText('Chính sách bảo mật')).toBeInTheDocument()
  })
})

describe('Footer - App Download', () => {
  beforeEach(() => {
    render(<Footer />)
  })

  test('renders QR code image', () => {
    const qr = screen.getByRole('img', { name: /qr code/i })
    expect(qr).toBeInTheDocument()
    expect(qr).toHaveAttribute('src', '/footer/qr.svg')
  })

  test('renders App Store image', () => {
    const appStore = screen.getByRole('img', { name: /app store/i })
    expect(appStore).toBeInTheDocument()
    expect(appStore).toHaveAttribute('src', '/footer/appstore.svg')
  })

  test('renders Google Play image', () => {
    const googlePlay = screen.getByRole('img', { name: /google play/i })
    expect(googlePlay).toBeInTheDocument()
    expect(googlePlay).toHaveAttribute('src', '/footer/chplay.svg')
  })

  test('renders "Quét mã QR để tải ứng dụng" text', () => {
    expect(screen.getByText('Quét mã QR để tải ứng dụng')).toBeInTheDocument()
  })
})

describe('Footer - Social Links', () => {
  beforeEach(() => {
    render(<Footer />)
  })

  test('renders Facebook social link', () => {
    const facebook = screen.getByTitle('Facebook')
    expect(facebook).toBeInTheDocument()
    expect(facebook).toHaveAttribute('href', '#')
  })

  test('renders YouTube social link', () => {
    const youtube = screen.getByTitle('YouTube')
    expect(youtube).toBeInTheDocument()
    expect(youtube).toHaveAttribute('href', '#')
  })

  test('renders Website social link', () => {
    const website = screen.getByTitle('Website')
    expect(website).toBeInTheDocument()
    expect(website).toHaveAttribute('href', '#')
  })
})

describe('Footer - Logo', () => {
  test('renders logo image', () => {
    render(<Footer />)
    const logo = screen.getByRole('img', { name: /logo/i })
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', '/core/logo_web.svg')
  })
})
