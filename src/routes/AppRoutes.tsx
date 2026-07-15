import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import Layout from '../components/Layout'
import About from '../pages/About'
import Campaigns from '../pages/Campaigns'
import Contact from '../pages/Contact'
import Donate from '../pages/Donate'
import Home from '../pages/Home'
import News from '../pages/News'
import Programs from '../pages/Programs'
import Transparency from '../pages/Transparency'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import AdminDashboardPage from '../pages/admin/AdminDashboardPage'
import AdminCampaignsPage from '../pages/admin/AdminCampaignsPage'
import AdminLoginPage from '../pages/auth/AdminLoginPage'
import AdminNewsPage from '../pages/admin/AdminNewsPage'
import AdminRoute from './AdminRoute'
import ProtectedRoute from './ProtectedRoute'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLoginPage />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <Outlet />
            </AdminRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="campagnes" element={<AdminCampaignsPage />} />
        <Route path="publications" element={<AdminNewsPage />} />
      </Route>

      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="a-propos" element={<About />} />
        <Route path="programmes" element={<Programs />} />
        <Route path="campagnes" element={<Campaigns />} />
        <Route path="actualites" element={<News />} />
        <Route path="contact" element={<Contact />} />
        <Route path="transparence" element={<Transparency />} />
        <Route path="faire-un-don" element={<Donate />} />
        <Route path="connexion" element={<Login />} />
        <Route path="inscription" element={<Register />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
