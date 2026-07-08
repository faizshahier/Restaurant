import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { AdminLayout } from '../components/layout/AdminLayout'
import { RequireAdmin } from '../components/auth/RequireAdmin'
import { HomePage } from '../pages/HomePage'
import { MenuPage } from '../pages/MenuPage'
import { ReservationsPage } from '../pages/ReservationsPage'
import { GalleryPage } from '../pages/GalleryPage'
import { AboutPage } from '../pages/AboutPage'
import { ContactPage } from '../pages/ContactPage'
import { SignInPage } from '../pages/SignInPage'
import { SignUpPage } from '../pages/SignUpPage'
import { AdminReservationsPage } from '../pages/admin/AdminReservationsPage'
import { AdminFoodsPage } from '../pages/admin/AdminFoodsPage'
import { AdminCategoriesPage } from '../pages/admin/AdminCategoriesPage'
import { NotFoundPage } from '../pages/NotFoundPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'menu', element: <MenuPage /> },
      { path: 'reservations', element: <ReservationsPage /> },
      { path: 'gallery', element: <GalleryPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'sign-in', element: <SignInPage /> },
      { path: 'sign-up', element: <SignUpPage /> },
      {
        path: 'admin',
        element: (
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        ),
        children: [
          { index: true, element: <Navigate to="reservations" replace /> },
          { path: 'reservations', element: <AdminReservationsPage /> },
          { path: 'foods', element: <AdminFoodsPage /> },
          { path: 'categories', element: <AdminCategoriesPage /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
