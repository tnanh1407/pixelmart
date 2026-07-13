import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import RegisterPage from './RegisterPage'

const renderRegisterPage = (initialEntries = ['/register']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <RegisterPage />
    </MemoryRouter>
  )
}

describe('RegisterPage - Render & UI', () => {
  beforeEach(() => {
    renderRegisterPage()
  })

  test('renders the register form', () => {
    expect(screen.getByRole('button', { name: /đăng ký tài khoản/i })).toBeInTheDocument()
  })

  test('displays heading "Tạo tài khoản"', () => {
    expect(screen.getByRole('heading', { name: /tạo tài khoản/i })).toBeInTheDocument()
  })

  test('displays subtitle "Tham gia cộng đồng nông sản"', () => {
    expect(screen.getByText('Tham gia cộng đồng nông sản')).toBeInTheDocument()
  })

  test('displays firstName input with placeholder', () => {
    const input = screen.getByPlaceholderText('Nguyễn')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'text')
  })

  test('displays lastName input with placeholder', () => {
    const input = screen.getByPlaceholderText('Văn A')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'text')
  })

  test('displays email input with placeholder', () => {
    const input = screen.getByPlaceholderText('email@example.com')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'email')
  })

  test('displays password input with placeholder', () => {
    const input = screen.getByPlaceholderText('Tạo mật khẩu')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'password')
  })

  test('displays confirmPassword input with placeholder', () => {
    const input = screen.getByPlaceholderText('Nhập lại mật khẩu')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'password')
  })

  test('displays terms checkbox', () => {
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeInTheDocument()
    expect(checkbox).not.toBeChecked()
  })

  test('displays "Điều khoản" and "Bảo mật" links', () => {
    expect(screen.getByRole('link', { name: /điều khoản/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /bảo mật/i })).toBeInTheDocument()
  })

  test('displays submit button "Đăng ký tài khoản"', () => {
    const button = screen.getByRole('button', { name: /đăng ký tài khoản/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('type', 'submit')
  })

  test('displays both password toggle buttons', () => {
    const toggleButtons = screen.getAllByRole('button', { name: '' })
    expect(toggleButtons.length).toBe(2)
  })
})

describe('RegisterPage - Form Validation', () => {
  test('shows all error messages when submitting empty form', async () => {
    const user = userEvent.setup()
    renderRegisterPage()

    await user.click(screen.getByRole('button', { name: /đăng ký tài khoản/i }))

    expect(await screen.findByText('Họ không được để trống')).toBeInTheDocument()
    expect(screen.getByText('Tên không được để trống')).toBeInTheDocument()
    expect(screen.getByText('Email không được để trống')).toBeInTheDocument()
    expect(screen.getByText('Mật khẩu phải có ít nhất 6 ký tự')).toBeInTheDocument()
    expect(screen.getByText('Vui lòng xác nhận mật khẩu')).toBeInTheDocument()
    expect(screen.getByText('Bạn phải đồng ý với Điều khoản')).toBeInTheDocument()
  })

  test('shows email error for invalid email format', async () => {
    const user = userEvent.setup()
    renderRegisterPage()

    await user.type(screen.getByPlaceholderText('email@example.com'), 'invalid-email')
    await user.click(screen.getByRole('button', { name: /đăng ký tài khoản/i }))

    expect(await screen.findByText('Email không hợp lệ')).toBeInTheDocument()
  })

  test('shows password error when password is less than 6 characters', async () => {
    const user = userEvent.setup()
    renderRegisterPage()

    await user.type(screen.getByPlaceholderText('Tạo mật khẩu'), '12345')
    await user.click(screen.getByRole('button', { name: /đăng ký tài khoản/i }))

    expect(await screen.findByText('Mật khẩu phải có ít nhất 6 ký tự')).toBeInTheDocument()
  })

  test('shows confirmPassword error when passwords do not match', async () => {
    const user = userEvent.setup()
    renderRegisterPage()

    await user.type(screen.getByPlaceholderText('Tạo mật khẩu'), '123456')
    await user.type(screen.getByPlaceholderText('Nhập lại mật khẩu'), '654321')
    await user.click(screen.getByRole('button', { name: /đăng ký tài khoản/i }))

    expect(await screen.findByText('Mật khẩu xác nhận không khớp')).toBeInTheDocument()
  })

  test('does not show errors when form is valid', async () => {
    const user = userEvent.setup()
    renderRegisterPage()

    await user.type(screen.getByPlaceholderText('Nguyễn'), 'Nguyễn')
    await user.type(screen.getByPlaceholderText('Văn A'), 'Văn A')
    await user.type(screen.getByPlaceholderText('email@example.com'), 'test@example.com')
    await user.type(screen.getByPlaceholderText('Tạo mật khẩu'), '123456')
    await user.type(screen.getByPlaceholderText('Nhập lại mật khẩu'), '123456')
    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: /đăng ký tài khoản/i }))

    expect(screen.queryByText('Họ không được để trống')).not.toBeInTheDocument()
    expect(screen.queryByText('Tên không được để trống')).not.toBeInTheDocument()
    expect(screen.queryByText('Email không hợp lệ')).not.toBeInTheDocument()
    expect(screen.queryByText('Mật khẩu phải có ít nhất 6 ký tự')).not.toBeInTheDocument()
    expect(screen.queryByText('Mật khẩu xác nhận không khớp')).not.toBeInTheDocument()
    expect(screen.queryByText('Bạn phải đồng ý với Điều khoản')).not.toBeInTheDocument()
  })
})

describe('RegisterPage - User Interaction', () => {
  test('updates firstName input value when user types', async () => {
    const user = userEvent.setup()
    renderRegisterPage()

    const input = screen.getByPlaceholderText('Nguyễn')
    await user.type(input, 'Nguyễn')

    expect(input).toHaveValue('Nguyễn')
  })

  test('updates lastName input value when user types', async () => {
    const user = userEvent.setup()
    renderRegisterPage()

    const input = screen.getByPlaceholderText('Văn A')
    await user.type(input, 'Văn A')

    expect(input).toHaveValue('Văn A')
  })

  test('updates email input value when user types', async () => {
    const user = userEvent.setup()
    renderRegisterPage()

    const input = screen.getByPlaceholderText('email@example.com')
    await user.type(input, 'test@example.com')

    expect(input).toHaveValue('test@example.com')
  })

  test('toggles password visibility when clicking toggle button', async () => {
    const user = userEvent.setup()
    renderRegisterPage()

    const passwordInput = screen.getByPlaceholderText('Tạo mật khẩu')
    const toggleButtons = screen.getAllByRole('button', { name: '' })
    const passwordToggle = toggleButtons[0]

    expect(passwordInput).toHaveAttribute('type', 'password')

    await user.click(passwordToggle)
    expect(passwordInput).toHaveAttribute('type', 'text')

    await user.click(passwordToggle)
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  test('toggles confirmPassword visibility when clicking toggle button', async () => {
    const user = userEvent.setup()
    renderRegisterPage()

    const confirmPasswordInput = screen.getByPlaceholderText('Nhập lại mật khẩu')
    const toggleButtons = screen.getAllByRole('button', { name: '' })
    const confirmPasswordToggle = toggleButtons[1]

    expect(confirmPasswordInput).toHaveAttribute('type', 'password')

    await user.click(confirmPasswordToggle)
    expect(confirmPasswordInput).toHaveAttribute('type', 'text')

    await user.click(confirmPasswordToggle)
    expect(confirmPasswordInput).toHaveAttribute('type', 'password')
  })

  test('toggles terms checkbox when clicked', async () => {
    const user = userEvent.setup()
    renderRegisterPage()

    const checkbox = screen.getByRole('checkbox')

    expect(checkbox).not.toBeChecked()

    await user.click(checkbox)
    expect(checkbox).toBeChecked()

    await user.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })
})

describe('RegisterPage - Navigation', () => {
  test('"Đăng nhập ngay" links to login page', () => {
    renderRegisterPage()
    const link = screen.getByRole('link', { name: /đăng nhập ngay/i })
    expect(link).toHaveAttribute('href', '/login')
  })

  test('"Điều khoản" link exists', () => {
    renderRegisterPage()
    const link = screen.getByRole('link', { name: /điều khoản/i })
    expect(link).toBeInTheDocument()
  })

  test('"Bảo mật" link exists', () => {
    renderRegisterPage()
    const link = screen.getByRole('link', { name: /bảo mật/i })
    expect(link).toBeInTheDocument()
  })
})
