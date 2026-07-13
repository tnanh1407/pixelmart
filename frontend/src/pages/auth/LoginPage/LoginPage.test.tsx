import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import LoginPage from './LoginPage'

describe('LoginPage - Render & UI', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )
  })

  test('renders the login form', () => {
    expect(screen.getByRole('button', { name: /đăng nhập$/i })).toBeInTheDocument()
  })

  test('displays heading "Đăng nhập"', () => {
    expect(screen.getByRole('heading', { name: /đăng nhập/i })).toBeInTheDocument()
  })

  test('displays subtitle "Chào mừng bạn quay trở lại!"', () => {
    expect(screen.getByText('Chào mừng bạn quay trở lại!')).toBeInTheDocument()
  })

  test('displays email input with placeholder', () => {
    const emailInput = screen.getByPlaceholderText('email@example.com')
    expect(emailInput).toBeInTheDocument()
    expect(emailInput).toHaveAttribute('type', 'email')
  })

  test('displays password input with placeholder', () => {
    const passwordInput = screen.getByPlaceholderText('Nhập mật khẩu')
    expect(passwordInput).toBeInTheDocument()
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  test('displays "Ghi nhớ đăng nhập" checkbox', () => {
    const checkbox = screen.getByRole('checkbox', { name: /ghi nhớ đăng nhập/i })
    expect(checkbox).toBeInTheDocument()
    expect(checkbox).not.toBeChecked()
  })

  test('displays "Quên mật khẩu?" link to /forgot-password', () => {
    const link = screen.getByRole('link', { name: /quên mật khẩu/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/forgot-password')
  })

  test('displays submit button "Đăng nhập"', () => {
    const submitButton = screen.getByRole('button', { name: /đăng nhập$/i })
    expect(submitButton).toBeInTheDocument()
    expect(submitButton).toHaveAttribute('type', 'submit')
  })

  test('displays "Đăng nhập với Google" button', () => {
    const googleButton = screen.getByRole('button', { name: /đăng nhập với google/i })
    expect(googleButton).toBeInTheDocument()
  })

  test('displays "Đăng ký ngay" link to /register', () => {
    const link = screen.getByRole('link', { name: /đăng ký ngay/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/register')
  })

  test('displays password toggle button', () => {
    const toggleButton = screen.getByRole('button', { name: '' })
    expect(toggleButton).toBeInTheDocument()
  })
})

describe('LoginPage - Form Validation', () => {
  test('shows error messages when submitting empty form', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    await user.click(screen.getByRole('button', { name: /đăng nhập$/i }))

    expect(await screen.findByText('Email không được để trống')).toBeInTheDocument()
    expect(screen.getByText('Mật khẩu phải có ít nhất 6 ký tự')).toBeInTheDocument()
  })

  test('shows email error for invalid email format', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    const emailInput = screen.getByPlaceholderText('email@example.com')
    await user.type(emailInput, 'invalid-email')
    await user.click(screen.getByRole('button', { name: /đăng nhập$/i }))

    expect(await screen.findByText('Email không hợp lệ')).toBeInTheDocument()
  })

  test('shows password error when password is less than 6 characters', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    const emailInput = screen.getByPlaceholderText('email@example.com')
    const passwordInput = screen.getByPlaceholderText('Nhập mật khẩu')

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, '12345')
    await user.click(screen.getByRole('button', { name: /đăng nhập$/i }))

    expect(await screen.findByText('Mật khẩu phải có ít nhất 6 ký tự')).toBeInTheDocument()
  })

  test('does not show errors when form is valid', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    const emailInput = screen.getByPlaceholderText('email@example.com')
    const passwordInput = screen.getByPlaceholderText('Nhập mật khẩu')

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, '123456')
    await user.click(screen.getByRole('button', { name: /đăng nhập$/i }))

    expect(screen.queryByText('Email không hợp lệ')).not.toBeInTheDocument()
    expect(screen.queryByText('Mật khẩu phải có ít nhất 6 ký tự')).not.toBeInTheDocument()
  })

  test('clears email error when user types a valid email', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    // Submit empty to trigger errors
    await user.click(screen.getByRole('button', { name: /đăng nhập$/i }))
    expect(await screen.findByText('Email không được để trống')).toBeInTheDocument()

    // Type valid email - error should clear
    await user.type(screen.getByPlaceholderText('email@example.com'), 'test@example.com')
    expect(screen.queryByText('Email không được để trống')).not.toBeInTheDocument()
  })

  test('clears password error when user types valid password', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    // Submit empty to trigger errors
    await user.click(screen.getByRole('button', { name: /đăng nhập$/i }))
    expect(await screen.findByText('Mật khẩu phải có ít nhất 6 ký tự')).toBeInTheDocument()

    // Type valid password - error should clear
    await user.type(screen.getByPlaceholderText('Nhập mật khẩu'), '123456')
    expect(screen.queryByText('Mật khẩu phải có ít nhất 6 ký tự')).not.toBeInTheDocument()
  })
})

describe('LoginPage - User Interaction', () => {
  test('updates email input value when user types', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    const emailInput = screen.getByPlaceholderText('email@example.com')
    await user.type(emailInput, 'test@example.com')

    expect(emailInput).toHaveValue('test@example.com')
  })

  test('updates password input value when user types', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    const passwordInput = screen.getByPlaceholderText('Nhập mật khẩu')
    await user.type(passwordInput, '123456')

    expect(passwordInput).toHaveValue('123456')
  })

  test('toggles password visibility when clicking toggle button', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    const passwordInput = screen.getByPlaceholderText('Nhập mật khẩu')
    const toggleButton = screen.getByRole('button', { name: '' })

    // Initially password is hidden
    expect(passwordInput).toHaveAttribute('type', 'password')

    // Click toggle to show password
    await user.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'text')

    // Click toggle again to hide password
    await user.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  test('toggles "Ghi nhớ đăng nhập" checkbox when clicked', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    const checkbox = screen.getByRole('checkbox', { name: /ghi nhớ đăng nhập/i })

    // Initially unchecked
    expect(checkbox).not.toBeChecked()

    // Click to check
    await user.click(checkbox)
    expect(checkbox).toBeChecked()

    // Click again to uncheck
    await user.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })
})

describe('LoginPage - Navigation', () => {
  const renderWithRouter = (initialEntries = ['/login']) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <LoginPage />
      </MemoryRouter>
    )
  }

  test('"Quên mật khẩu?" links to forgot-password page', () => {
    renderWithRouter()
    const link = screen.getByRole('link', { name: /quên mật khẩu/i })
    expect(link).toHaveAttribute('href', '/forgot-password')
  })

  test('"Đăng ký ngay" links to register page', () => {
    renderWithRouter()
    const link = screen.getByRole('link', { name: /đăng ký ngay/i })
    expect(link).toHaveAttribute('href', '/register')
  })

  test('all navigation links are clickable', async () => {
    const user = userEvent.setup()
    renderWithRouter()

    const forgotPasswordLink = screen.getByRole('link', { name: /quên mật khẩu/i })
    const registerLink = screen.getByRole('link', { name: /đăng ký ngay/i })

    // Verify links are not disabled and can be clicked
    expect(forgotPasswordLink).toBeVisible()
    expect(registerLink).toBeVisible()

    await user.click(forgotPasswordLink)
    await user.click(registerLink)

    // If no error thrown, navigation links are clickable
    expect(forgotPasswordLink).toBeInTheDocument()
    expect(registerLink).toBeInTheDocument()
  })
})
