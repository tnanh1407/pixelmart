import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import ForgotPasswordPage from './ForgotPasswordPage'

const renderForgotPasswordPage = (initialEntries = ['/forgot-password']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <ForgotPasswordPage />
    </MemoryRouter>
  )
}

describe('ForgotPasswordPage - Render & UI', () => {
  beforeEach(() => {
    renderForgotPasswordPage()
  })

  test('renders the forgot password form', () => {
    expect(screen.getByRole('button', { name: /gửi link đặt lại mật khẩu/i })).toBeInTheDocument()
  })

  test('displays heading "Quên mật khẩu?"', () => {
    expect(screen.getByRole('heading', { name: /quên mật khẩu\?/i })).toBeInTheDocument()
  })

  test('displays subtitle "Nhập email để nhận link đặt lại mật khẩu"', () => {
    expect(screen.getByText('Nhập email để nhận link đặt lại mật khẩu')).toBeInTheDocument()
  })

  test('displays email input with placeholder', () => {
    const input = screen.getByPlaceholderText('email@example.com')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'email')
  })

  test('displays submit button "Gửi link đặt lại mật khẩu"', () => {
    const button = screen.getByRole('button', { name: /gửi link đặt lại mật khẩu/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('type', 'submit')
  })

  test('displays logo image', () => {
    const logo = screen.getByRole('img', { name: /nông sản bưu điện/i })
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', '/core/logo_web.svg')
  })

  test('displays "Quay lại đăng nhập" link', () => {
    const link = screen.getByRole('link', { name: /quay lại đăng nhập/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/login')
  })
})

describe('ForgotPasswordPage - Form Validation', () => {
  test('shows error when submitting empty form', async () => {
    const user = userEvent.setup()
    renderForgotPasswordPage()

    await user.click(screen.getByRole('button', { name: /gửi link đặt lại mật khẩu/i }))

    expect(await screen.findByText('Email không được để trống')).toBeInTheDocument()
  })

  test('shows email error for invalid email format', async () => {
    const user = userEvent.setup()
    renderForgotPasswordPage()

    await user.type(screen.getByPlaceholderText('email@example.com'), 'invalid-email')
    await user.click(screen.getByRole('button', { name: /gửi link đặt lại mật khẩu/i }))

    expect(await screen.findByText('Email không hợp lệ')).toBeInTheDocument()
  })

  test('does not show errors when form is valid', async () => {
    const user = userEvent.setup()
    renderForgotPasswordPage()

    await user.type(screen.getByPlaceholderText('email@example.com'), 'test@example.com')
    await user.click(screen.getByRole('button', { name: /gửi link đặt lại mật khẩu/i }))

    expect(screen.queryByText('Email không được để trống')).not.toBeInTheDocument()
    expect(screen.queryByText('Email không hợp lệ')).not.toBeInTheDocument()
  })
})

describe('ForgotPasswordPage - User Interaction', () => {
  test('updates email input value when user types', async () => {
    const user = userEvent.setup()
    renderForgotPasswordPage()

    const input = screen.getByPlaceholderText('email@example.com')
    await user.type(input, 'test@example.com')

    expect(input).toHaveValue('test@example.com')
  })

  test('calls console.log with form data when submitting valid form', async () => {
    const user = userEvent.setup()
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
    renderForgotPasswordPage()

    await user.type(screen.getByPlaceholderText('email@example.com'), 'test@example.com')
    await user.click(screen.getByRole('button', { name: /gửi link đặt lại mật khẩu/i }))

    expect(consoleSpy).toHaveBeenCalledWith('Forgot password:', {
      email: 'test@example.com',
    })

    consoleSpy.mockRestore()
  })
})

describe('ForgotPasswordPage - Navigation', () => {
  test('logo links to home page', () => {
    renderForgotPasswordPage()
    const logo = screen.getByRole('img', { name: /nông sản bưu điện/i })
    const logoLink = logo.closest('a')
    expect(logoLink).toHaveAttribute('href', '/')
  })

  test('"Quay lại đăng nhập" links to login page', () => {
    renderForgotPasswordPage()
    const link = screen.getByRole('link', { name: /quay lại đăng nhập/i })
    expect(link).toHaveAttribute('href', '/login')
  })
})
