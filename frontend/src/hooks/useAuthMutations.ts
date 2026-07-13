import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authService, type User } from '@/services/auth.service'
import useUserStore from '@/stores/useUserStore'

interface GoogleLoginPayload {
  googleId: string
  email: string
  name: string
  avatar?: string
}

interface RegisterPayload {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

export function useLoginMutation() {
  const queryClient = useQueryClient()
  const { setUser } = useUserStore.getState()

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
    onSuccess: (user: User) => {
      setUser(user)
      queryClient.setQueryData(['user'], user)
    },
  })
}

export function useRegisterMutation() {

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
  })
}

export function useGoogleLoginMutation() {
  const queryClient = useQueryClient()
  const { setUser } = useUserStore.getState()

  return useMutation({
    mutationFn: (payload: GoogleLoginPayload) => authService.googleLogin(payload),
    onSuccess: (user: User) => {
      setUser(user)
      queryClient.setQueryData(['user'], user)
    },
  })
}

export function useLogoutMutation() {
  const queryClient = useQueryClient()
  const { logout: storeLogout } = useUserStore.getState()

  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      storeLogout()
      queryClient.clear()
    },
  })
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: ({ email }: { email: string }) => authService.forgotPassword(email),
  })
}
