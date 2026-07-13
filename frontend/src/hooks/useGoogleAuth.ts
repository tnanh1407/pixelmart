import { useNavigate } from 'react-router-dom'
import { type CredentialResponse } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import Swal from 'sweetalert2'
import { useGoogleLoginMutation } from '@/hooks/useAuthMutations'

interface GoogleJwtPayload {
  sub: string
  email: string
  given_name: string
  family_name: string
  picture?: string
}

export function useGoogleAuth() {
  const navigate = useNavigate()
  const googleLoginMutation = useGoogleLoginMutation()

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) return

    const decoded = jwtDecode<GoogleJwtPayload>(credentialResponse.credential)

    googleLoginMutation.mutate(
      {
        googleId: decoded.sub,
        email: decoded.email,
        name: `${decoded.given_name} ${decoded.family_name}`.trim(),
        avatar: decoded.picture,
      },
      {
        onSuccess: () => navigate('/'),
        onError: (err: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Đăng nhập Google thất bại',
            text: err?.response?.data?.message || 'Đăng nhập Google thất bại',
            confirmButtonColor: '#049645',
          })
        },
      }
    )
  }

  const handleGoogleError = () => {
    Swal.fire({
      icon: 'error',
      title: 'Đăng nhập Google thất bại',
      text: 'Đăng nhập Google thất bại',
      confirmButtonColor: '#049645',
    })
  }

  return { handleGoogleSuccess, handleGoogleError, isPending: googleLoginMutation.isPending }
}
