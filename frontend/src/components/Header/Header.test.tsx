import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Header from './Header'

const renderHeader = () =>
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  )

describe('Header - Top Bar', () => {
  beforeEach(renderHeader)

  test('renders "Kênh bán hàng" link', () => {
    const link = screen.getByRole('link', { name: /kênh bán hàng/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/')
  })

  test('renders "Tiếng Việt" link', () => {
    const link = screen.getByRole('link', { name: /tiếng việt/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/')
  })

  test('renders "Thông báo" link', () => {
    const link = screen.getByRole('link', { name: /thông báo/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/')
  })

  test('renders "Gian hàng" link', () => {
    const link = screen.getByRole('link', { name: /gian hàng/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/store-list')
  })

  test('renders "Mã giảm giá" link', () => {
    const link = screen.getByRole('link', { name: /mã giảm giá/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/pointmall-voucher')
  })
})

describe('Header - Logo', () => {
  test('renders logo with correct src and alt', () => {
    renderHeader()
    const logo = screen.getByRole('img', { name: /nông sản bưu điện/i })
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', '/core/logo_web.svg')
  })

  test('logo links to home page', () => {
    renderHeader()
    const logo = screen.getByRole('img', { name: /nông sản bưu điện/i })
    const link = logo.closest('a')
    expect(link).toHaveAttribute('href', '/')
  })
})

describe('Header - Search Bar', () => {
  beforeEach(renderHeader)

  test('renders search input with placeholder', () => {
    const input = screen.getAllByPlaceholderText(/tìm kiếm/i)[0]
    expect(input).toBeInTheDocument()
  })

  test('renders search button', () => {
    const buttons = screen.getAllByRole('button')
    const searchButton = buttons.find((btn) => btn.querySelector('svg'))
    expect(searchButton).toBeInTheDocument()
  })

  test('displays default search type "Hàng hóa"', () => {
    expect(screen.getByText('Hàng hóa')).toBeInTheDocument()
  })

  test('opens dropdown when clicking search type button', async () => {
    const user = userEvent.setup()
    const dropdownButton = screen.getByText('Hàng hóa')
    await user.click(dropdownButton)
    expect(screen.getByText('Cửa hàng')).toBeInTheDocument()
  })

  test('changes search type when selecting option', async () => {
    const user = userEvent.setup()
    const dropdownButton = screen.getByText('Hàng hóa')
    await user.click(dropdownButton)
    await user.click(screen.getByText('Cửa hàng'))
    expect(screen.getByText('Cửa hàng')).toBeInTheDocument()
  })
})

describe('Header - Category Links', () => {
  beforeEach(renderHeader)

  test('renders all 5 category links', () => {
    const categories = ['Hạnh nhân Vinh Châu', 'Mật ong', 'Mỹ chữ Bắc Giang', 'Đông trùng hạ thảo', 'Gạo Séng Cù']
    categories.forEach((cat) => {
      expect(screen.getAllByText(cat).length).toBeGreaterThanOrEqual(1)
    })
  })

  test('"Đông trùng hạ thảo" has primary color styling', () => {
    const links = screen.getAllByText('Đông trùng hạ thảo')
    const desktopLink = links[0]
    expect(desktopLink).toHaveClass('text-primary', 'font-semibold')
  })
})

describe('Header - Action Links', () => {
  beforeEach(renderHeader)

  test('renders "Đăng nhập" link to /login', () => {
    const links = screen.getAllByText(/đăng nhập/i)
    const loginLink = links.find((el) => el.closest('a')?.getAttribute('href') === '/login')
    expect(loginLink).toBeInTheDocument()
    expect(loginLink!.closest('a')).toHaveAttribute('href', '/login')
  })

  test('renders "Giỏ hàng" link to /cart', () => {
    const links = screen.getAllByText(/giỏ hàng/i)
    const cartLink = links.find((el) => el.closest('a')?.getAttribute('href') === '/cart')
    expect(cartLink).toBeInTheDocument()
    expect(cartLink!.closest('a')).toHaveAttribute('href', '/cart')
  })
})

describe('Header - Mobile Menu', () => {
  const getMobileMenuButton = () => {
    const buttons = screen.getAllByRole('button', { name: '' })
    return buttons.find((btn) => btn.className.includes('md:hidden'))
  }

  test('renders mobile menu button', () => {
    renderHeader()
    const menuButton = getMobileMenuButton()
    expect(menuButton).toBeInTheDocument()
  })

  test('opens mobile menu when clicking menu button', async () => {
    const user = userEvent.setup()
    renderHeader()
    const menuButton = getMobileMenuButton()!
    await user.click(menuButton)
    expect(screen.getAllByText(/đăng ký/i).length).toBeGreaterThanOrEqual(1)
  })

  test('mobile menu contains login, register, and cart links', async () => {
    const user = userEvent.setup()
    renderHeader()
    const menuButton = getMobileMenuButton()!
    await user.click(menuButton)
    expect(screen.getAllByRole('link', { name: /^đăng nhập$/i }).length).toBeGreaterThanOrEqual(2)
    expect(screen.getAllByText(/đăng ký/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/giỏ hàng/i).length).toBeGreaterThanOrEqual(2)
  })
})
