import type { ReactNode } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { useAppSelector } from '../app/hooks'
import { useGetCurrentUserQuery } from '../features/auth/authApi'
import { selectCurrentUser } from '../features/auth/authSelectors'

interface ProtectedRouteProps {
  children?: ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation()
  const currentUser = useAppSelector(selectCurrentUser)

  const { isLoading, isFetching } = useGetCurrentUserQuery(undefined, {
    skip: Boolean(currentUser),
  })

  if (currentUser) {
    return <>{children ?? <Outlet />}</>
  }

  if (isLoading || isFetching) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <LoadingSpinner label="Vérification de votre session..." />
      </div>
    )
  }

  return <Navigate to="/admin/login" replace state={{ from: location }} />
}

export default ProtectedRoute
