import { createBrowserRouter } from 'react-router-dom'
import HomeLayout from '../layouts/HomeLayout'
import AdminLayout from '../layouts/AdminLayout'
import AuthLayout from '../layouts/AuthLayout'
import ProtectedRoute from '../components/auth/ProtectedRoute'
import PublicRoute from '../components/auth/PublicRoute'
import BlockAdminRoute from '../components/auth/BlockAdminRoute'
import HomePage from '../pages/user/HomePage/HomePage'
import CategoryPage from '../pages/category/CategoryPage'
import Pointmallvoucher from '../pages/user/Pointmallvoucher/Pointmallvoucher'
import Cart from '../pages/user/HomePage/Cart/Cart'
import Storelist from '../pages/user/Storelist/Storelist'
import StoreDetail from '../pages/user/StoreDetail/StoreDetail'
import ProductDetail from '../pages/user/ProductDetail/ProductDetail'
import BannerDetail from '../pages/user/BannerDetail/BannerDetail'
import BannerList from '../pages/user/BannerList/BannerList'
import Search from '../pages/user/Search/Search'
import LoginPage from '../pages/auth/LoginPage/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage/RegisterPage'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage/ForgotPasswordPage'
import ResetPasswordPage from '../pages/auth/ResetPasswordPage/ResetPasswordPage'
import VerifyEmailPage from '../pages/auth/VerifyEmailPage/VerifyEmailPage'
import UserLayout from '../layouts/UserLayout'
import ProfilePage from '../pages/user/Profile/ProfilePage'
import DashboardPage from '../pages/admin/DashboardPage'
import UsersPage from '../pages/admin/UsersPage'
import ProductsPage from '../pages/admin/ProductsPage'
import StoresPage from '../pages/admin/StoresPage'
import CategoriesPage from '../pages/admin/CategoriesPage'
import NotFoundPage from '../pages/notFound/NotFoundPage'
import BannersPage from '@/pages/admin/BannerPage/BannersPage'

const router = createBrowserRouter([
  // Public pages - ai cũng truy cập được
  {
    element: <PublicRoute />,
    children: [
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
        path: '/reset-password',
        element: <AuthLayout />,
        children: [
          { index: true, element: <ResetPasswordPage /> },
        ],
      },
      {
        path: '/verify-email',
        element: <AuthLayout />,
        children: [
          { index: true, element: <VerifyEmailPage /> },
        ],
      },
    ],
  },

  // Public pages - không cần login
  {
    element: <BlockAdminRoute />,
    children: [
      {
        path: '/',
        element: <HomeLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'category/:slug', element: <CategoryPage /> },
          { path: 'pointmall-voucher', element: <Pointmallvoucher /> },
          { path: 'store-list', element: <Storelist /> },
          { path: 'store/:id', element: <StoreDetail /> },
          { path: 'product/:id', element: <ProductDetail /> },
          { path: 'banner/:id', element: <BannerDetail /> },
          { path: 'banners', element: <BannerList /> },
          { path: 'search', element: <Search /> },
        ],
      },
    ],
  },

  // Protected pages - cần login
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <BlockAdminRoute />,
        children: [
          {
            path: '/cart',
            element: <HomeLayout />,
            children: [
              { index: true, element: <Cart /> },
            ],
          },
          {
            path: '/user',
            element: <UserLayout />,
            children: [
              { index: true, element: <ProfilePage /> },
              { path: 'profile', element: <ProfilePage /> },
            ],
          },
        ],
      },
    ],
  },

  // Admin pages - cần login + role admin
  {
    element: <ProtectedRoute requiredRole="admin" />,
    children: [
      {
        path: '/admin',
        element: <AdminLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'users', element: <UsersPage /> },
          { path: 'products', element: <ProductsPage /> },
          { path: 'stores', element: <StoresPage /> },
          { path: 'categories', element: <CategoriesPage /> },
          { path: 'banners', element: <BannersPage /> },
        ],
      },
    ],
  },

  // 404
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

export default router
