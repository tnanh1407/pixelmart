import { createBrowserRouter } from 'react-router-dom'
import HomeLayout from '../layouts/HomeLayout'
import AdminLayout from '../layouts/AdminLayout'
import AuthLayout from '../layouts/AuthLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import PublicRoute from '@/components/auth/PublicRoute'
import BlockAdminRoute from '@/components/auth/BlockAdminRoute'
import HomePage from '../pages/user/HomePage/HomePage'
import CategoryPage from '../pages/user/CategoryPage'
import Pointmallvoucher from '../pages/user/Pointmallvoucher/Pointmallvoucher'
import Cart from '../pages/user/HomePage/Cart/Cart'
import Storelist from '../pages/user/Storelist/Storelist'
import StoreDetail from '../pages/user/StoreDetail/StoreDetail'
import ProductDetail from '../pages/user/ProductDetail/ProductDetail'
import CampaignDetail from '../pages/user/CampaignDetail/CampaignDetail'
import CampaignList from '../pages/user/CampaignList/CampaignList'
import Search from '../pages/user/Search/Search'
import LoginPage from '../pages/auth/LoginPage/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage/RegisterPage'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage/ForgotPasswordPage'
import ResetPasswordPage from '../pages/auth/ResetPasswordPage/ResetPasswordPage'
import VerifyEmailPage from '../pages/auth/VerifyEmailPage/VerifyEmailPage'
import UserLayout from '../layouts/UserLayout'
import ProfilePage from '../pages/user/Profile/ProfilePage'
import DashboardPage from '../pages/admin/dashboard/DashboardPage'
import UsersPage from '../pages/admin/users/UsersPage'
import ProductsPage from '../pages/admin/products/ProductsPage'
import StoresPage from '../pages/admin/stores/StoresPage'
import StoreDetailPage from '../pages/admin/stores/StoreDetailPage'
import CampaignsPage from '@/pages/admin/campaigns/CampaignsPage'
import CampaignDetailPage from '@/pages/admin/campaigns/CampaignDetailPage'
import CategoryListPage from '@/pages/admin/categories/CategoryListPage'
// import CategoryDetailPage from '@/pages/admin/categories/CategoryDetailPage'import NotificationListPage from '@/pages/admin/notifications/NotificationListPage'
import ReportPage from '@/pages/admin/reports/ReportPage'
import SettingsPage from '@/pages/admin/settings/SettingsPage'
import NotFoundPage from '../pages/notFound/NotFoundPage'

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
          { path: 'campaign/:id', element: <CampaignDetail /> },
          { path: 'campaigns', element: <CampaignList /> },
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
          { path: 'stores/:id', element: <StoreDetailPage /> },
          { path: 'categories', element: <CategoryListPage /> },
          // { path: 'categories/:id', element: <CategoryDetailPage /> },
          { path: 'campaigns', element: <CampaignsPage /> },
          { path: 'campaigns/:id', element: <CampaignDetailPage /> },
          // { path: 'notifications', element: <NotificationListPage /> },
          { path: 'reports', element: <ReportPage /> },
          { path: 'settings', element: <SettingsPage /> },
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
