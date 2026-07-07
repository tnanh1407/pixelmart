import { createBrowserRouter } from 'react-router-dom'
import HomeLayout from '../layouts/HomeLayout'
import AdminLayout from '../layouts/AdminLayout'
import AuthLayout from '../layouts/AuthLayout'
import HomePage from '../pages/user/HomePage/HomePage'
import CategoryPage from '../pages/category/CategoryPage'
import Pointmallvoucher from '../pages/user/Pointmallvoucher/Pointmallvoucher'
import Cart from '../pages/user/HomePage/Cart/Cart'
import Storelist from '../pages/user/Storelist/Storelist'
import StoreDetail from '../pages/user/StoreDetail/StoreDetail'
import ProductDetail from '../pages/user/ProductDetail/ProductDetail'
import LoginPage from '../pages/auth/LoginPage/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage/RegisterPage'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage/ForgotPasswordPage'
import DashboardPage from '../pages/admin/DashboardPage'
import UsersPage from '../pages/admin/UsersPage'
import NotFoundPage from '../pages/notFound/NotFoundPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'category/:slug', element: <CategoryPage /> },
      { path: 'pointmall-voucher', element: <Pointmallvoucher /> },
      { path: 'cart', element: <Cart /> },
      { path: 'store-list', element: <Storelist /> },
      { path: 'store/:id', element: <StoreDetail /> },
      { path: 'product/:id', element: <ProductDetail /> },
    ],
  },
  {
    path: '/login',
    element: <AuthLayout />,
    children: [
      { index: true, element: <LoginPage /> },
    ],
  },
  {
    path: '/register',
    element: <AuthLayout />,
    children: [
      { index: true, element: <RegisterPage /> },
    ],
  },
  {
    path: '/forgot-password',
    element: <AuthLayout />,
    children: [
      { index: true, element: <ForgotPasswordPage /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'users', element: <UsersPage /> },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

export default router
