import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: unknown) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(undefined)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    const noRefreshUrls = ['/auth/login', '/auth/register', '/auth/google', '/auth/logout']
    const shouldNotRefresh = noRefreshUrls.some((url) => originalRequest.url?.includes(url))
    if (error.response?.status === 401 && !originalRequest._retry && !shouldNotRefresh) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL || '/api/v1'}/auth/refresh`,
          {},
          { withCredentials: true }
        )
        processQueue(null)
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError)
        // Không redirect ở đây - để ProtectedRoute xử lý
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
