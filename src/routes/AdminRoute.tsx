import type { ReactNode } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import { selectCanAccessAdminPanel, selectCurrentUser } from '../features/auth/authSelectors'

interface AdminRouteProps {
  children?: ReactNode
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const user = useAppSelector(selectCurrentUser)
  const canAccess = useAppSelector(selectCanAccessAdminPanel)

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  if (!canAccess) {
    return <Navigate to="/" replace />
  }

  return <>{children ?? <Outlet />}</>
}

export default AdminRoute
