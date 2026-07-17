import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import Layout from '../components/Layout'
import About from '../pages/About'
import Campaigns from '../pages/Campaigns'
import Contact from '../pages/Contact'
import Donate from '../pages/Donate'
import Home from '../pages/Home'
import News from '../pages/News'
import NewsDetail from '../pages/NewsDetail'
import Programs from '../pages/Programs'
import Transparency from '../pages/Transparency'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import AdminDashboardPage from '../pages/admin/AdminDashboardPage'
import AdminCampaignsPage from '../pages/admin/AdminCampaignsPage'
import AdminContentPage from '../pages/admin/AdminContentPage'
import AdminPaymentMethodsPage from '../pages/admin/AdminPaymentMethodsPage'
import AdminPaymentProofsPage from '../pages/admin/AdminPaymentProofsPage'
import AdminLoginPage from '../pages/auth/AdminLoginPage'
import AdminNewsPage from '../pages/admin/AdminNewsPage'
import DonationDashboardPage from '../pages/admin/DonationDashboardPage'
import DonationsPage from '../pages/admin/DonationsPage'
import DonationDetailsPage from '../pages/admin/DonationDetailsPage'
import PaymentReviewPage from '../pages/admin/PaymentReviewPage'
import DonationStatisticsPage from '../pages/admin/DonationStatisticsPage'
import DonationSimulationPage from '../pages/admin/DonationSimulationPage'
import DonationReportsPage from '../pages/admin/DonationReportsPage'
import DonationExportsPage from '../pages/admin/DonationExportsPage'
import ExportHistoryPage from '../pages/admin/ExportHistoryPage'
import DonationTransactionsPage from '../pages/admin/DonationTransactionsPage'
import AuditLogsPage from '../pages/admin/AuditLogsPage'
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
        <Route path="contenu" element={<AdminContentPage />} />
        <Route path="campagnes" element={<AdminCampaignsPage />} />
        <Route path="publications" element={<AdminNewsPage />} />
        <Route path="paiements" element={<AdminPaymentMethodsPage />} />
        <Route path="paiements/verifications" element={<AdminPaymentProofsPage />} />
        <Route path="donations/dashboard" element={<DonationDashboardPage />} />
        <Route path="donations" element={<DonationsPage />} />
        <Route path="donations/:id" element={<DonationDetailsPage />} />
        <Route path="donations/review" element={<PaymentReviewPage />} />
        <Route path="donations/transactions" element={<DonationTransactionsPage />} />
        <Route path="donations/statistics" element={<DonationStatisticsPage />} />
        <Route path="donations/simulations" element={<DonationSimulationPage />} />
        <Route path="donations/reports" element={<DonationReportsPage />} />
        <Route path="donations/exports" element={<DonationExportsPage />} />
        <Route path="donations/exports/history" element={<ExportHistoryPage />} />
        <Route path="settings/payment-methods" element={<AdminPaymentMethodsPage />} />
        <Route path="audit-logs" element={<AuditLogsPage />} />
      </Route>

      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="a-propos" element={<About />} />
        <Route path="programmes" element={<Programs />} />
        <Route path="campagnes" element={<Campaigns />} />
        <Route path="actualites" element={<News />} />
        <Route path="actualites/:id" element={<NewsDetail />} />
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
