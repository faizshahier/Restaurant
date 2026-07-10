import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { AdminLayout } from '../components/layout/AdminLayout'
import { RequireRole } from '../components/auth/RequireRole'
import { HomePage } from '../pages/HomePage'
import { MenuPage } from '../pages/MenuPage'
import { OrderPage } from '../pages/OrderPage'
import { GalleryPage } from '../pages/GalleryPage'
import { AboutPage } from '../pages/AboutPage'
import { ContactPage } from '../pages/ContactPage'
import { SignInPage } from '../pages/SignInPage'
import { SignUpPage } from '../pages/SignUpPage'
import { AdminOrdersPage } from '../pages/admin/AdminOrdersPage'
import { AdminFoodsPage } from '../pages/admin/AdminFoodsPage'
import { AdminCategoriesPage } from '../pages/admin/AdminCategoriesPage'
import { AdminAnalyticsPage } from '../pages/admin/AdminAnalyticsPage'
import { AdminGalleryPage } from '../pages/admin/AdminGalleryPage'
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage'
import { NotFoundPage } from '../pages/NotFoundPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'menu', element: <MenuPage /> },
      { path: 'order', element: <OrderPage /> },
      { path: 'gallery', element: <GalleryPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'sign-in', element: <SignInPage /> },
      { path: 'sign-up', element: <SignUpPage /> },
      {
        path: 'admin',
        element: (
          <RequireRole roles={['Admin', 'restaurant_manager']}>
            <AdminLayout />
          </RequireRole>
        ),
        children: [
          { index: true, element: <Navigate to="orders" replace /> },
          { path: 'orders', element: <AdminOrdersPage /> },
          { path: 'foods', element: <AdminFoodsPage /> },
          { path: 'analytics', element: <AdminAnalyticsPage /> },
          {
            path: 'categories',
            element: (
              <RequireRole roles={['Admin']}>
                <AdminCategoriesPage />
              </RequireRole>
            ),
          },
          {
            path: 'gallery',
            element: (
              <RequireRole roles={['Admin']}>
                <AdminGalleryPage />
              </RequireRole>
            ),
          },
          {
            path: 'settings',
            element: (
              <RequireRole roles={['Admin']}>
                <AdminSettingsPage />
              </RequireRole>
            ),
          },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
