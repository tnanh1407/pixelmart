import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Loader2, ShieldCheck } from 'lucide-react'
import Swal from 'sweetalert2'
import { authService } from '@/services/auth.service'

export default function VerifyEmailPage() {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [isSending, setIsSending] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const sendCode = async () => {
      try {
        await authService.sendVerification()
      } catch {
        // silent - user can click resend
      } finally {
        setIsSending(false)
      }
    }
    sendCode()
  }, [])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return
    if (value && !/^\d+$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted) {
      const newCode = pasted.split('').concat(Array(6 - pasted.length).fill(''))
      setCode(newCode.slice(0, 6))
      const lastIndex = Math.min(pasted.length, 5)
      const lastInput = document.getElementById(`code-${lastIndex}`)
      lastInput?.focus()
    }
  }

  const handleVerify = async () => {
    const fullCode = code.join('')
    if (fullCode.length !== 6) {
      Swal.fire({
        icon: 'warning',
        title: 'Vui lòng nhập đầy đủ 6 chữ số',
        confirmButtonColor: '#049645',
      })
      return
    }

    setIsVerifying(true)
    try {
      await authService.verifyEmail(fullCode)
      Swal.fire({
        icon: 'success',
        title: 'Xác thực thành công!',
        text: 'Email của bạn đã được xác thực.',
        confirmButtonColor: '#049645',
      }).then(() => navigate('/'))
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Xác thực thất bại',
        text: err?.response?.data?.message || 'Mã xác thực không hợp lệ hoặc đã hết hạn',
        confirmButtonColor: '#049645',
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResend = async () => {
    setIsResending(true)
    try {
      await authService.sendVerification()
      Swal.fire({
        icon: 'success',
        title: 'Đã gửi lại mã',
        text: 'Vui lòng kiểm tra email của bạn.',
        confirmButtonColor: '#049645',
      })
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Gửi lại thất bại',
        text: err?.response?.data?.message || 'Không thể gửi lại mã xác thực',
        confirmButtonColor: '#049645',
      })
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="w-full max-w-md font-sans">
      <SpeedInsights />
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <ShieldCheck size={32} className="text-primary" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-text-second mb-1 uppercase">Xác thực email</h2>
        <p className="text-text-second-light text-center text-sm mb-5 capitalize">
          {isSending ? 'Đang gửi mã xác thực...' : 'Nhập mã 6 chữ số đã gửi đến email của bạn'}
        </p>

        <div className="flex justify-center gap-2 mb-5">
          {code.map((digit, index) => (
            <input
              key={index}
              id={`code-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              disabled={isVerifying || isSending}
              className="w-11 h-12 text-center text-lg font-bold border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={isVerifying || isSending || code.join('').length !== 6}
          className="w-full bg-primary text-white py-2 rounded-lg text-sm font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Đang gửi mã...
            </>
          ) : isVerifying ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Đang xác thực...
            </>
          ) : (
            "Xác thực"
          )}
        </button>

        <p className="text-center mt-4 text-xs text-text-second-light">
          Không nhận được mã?{' '}
          <button
            onClick={handleResend}
            disabled={isResending}
            className="text-primary hover:text-primary-hover font-medium disabled:opacity-50"
          >
            {isResending ? 'Đang gửi...' : 'Gửi lại'}
          </button>
        </p>
      </div>
    </div>
  )
}
