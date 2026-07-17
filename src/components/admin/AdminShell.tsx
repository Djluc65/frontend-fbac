import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { Helmet } from 'react-helmet-async'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import BrandLogo from '../common/BrandLogo'
import { useAppSelector } from '../../app/hooks'
import { useLogoutMutation } from '../../features/auth/authApi'
import { selectCurrentUser } from '../../features/auth/authSelectors'
import AdminHero from './AdminHero'
import MobileSidebar from './MobileSidebar'
import { getAdminNavigation, isAdminNavigationItemActive } from './adminNavigation'
import { getAdminCapabilities } from './adminPermissions'

interface AdminShellProps {
  title: string
  description: string
  children: ReactNode
  actions?: ReactNode
}

const AdminShell = ({ title, description, children, actions }: AdminShellProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const user = useAppSelector(selectCurrentUser)
  const [logout, { isLoading }] = useLogoutMutation()
  const contentSectionRef = useRef<HTMLElement | null>(null)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const permissions = user?.permissions ?? []
  const capabilities = getAdminCapabilities(permissions)
  const navigationItems = getAdminNavigation(capabilities)

  const handleLogout = async () => {
    try {
      await logout().unwrap()
      toast.success('Déconnexion effectuée avec succès.')
      navigate('/admin/login', { replace: true })
    } catch {
      toast.error('Impossible de vous déconnecter pour le moment.')
    }
  }

  useLayoutEffect(() => {
    setIsMobileSidebarOpen(false)

    requestAnimationFrame(() => {
      const sectionTop = contentSectionRef.current
        ? contentSectionRef.current.getBoundingClientRect().top + window.scrollY
        : 0

      window.scrollTo({
        top: Math.max(sectionTop, 0),
        behavior: 'auto',
      })
    })
  }, [location.pathname])

  return (
    <>
      <Helmet>
        <title>{title} - Administration Fondation Bien Aimé Cassis</title>
      </Helmet>

      <>
        <MobileSidebar
          open={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
          items={navigationItems}
          pathname={location.pathname}
        />

        <main className="min-h-screen bg-slate-50 px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
            <AdminHero
              title={title}
              description={description}
              userName={user ? `${user.firstName} ${user.lastName}` : undefined}
              userRole={user?.role}
              actions={actions}
              isLoggingOut={isLoading}
              onLogout={handleLogout}
              onOpenNavigation={() => setIsMobileSidebarOpen(true)}
            />

            <section ref={contentSectionRef} className="grid gap-4 lg:grid-cols-[268px_minmax(0,1fr)] lg:gap-6">
              <aside className="hidden h-fit rounded-[28px] border border-slate-200/80 bg-white p-4 shadow-panel lg:block">
                <BrandLogo
                  to="/"
                  className="mb-5 hidden max-w-full justify-center px-2 lg:inline-flex"
                  imageClassName="max-h-[74px] w-auto object-contain"
                  loading="lazy"
                />
                <p className="px-3 pb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Navigation
                </p>
                <nav className="flex flex-col gap-1.5">
                  {navigationItems.map((item) => {
                    const Icon = item.icon
                    const isActive = isAdminNavigationItemActive(location.pathname, item)

                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        className={[
                          'group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition duration-200',
                          isActive
                            ? 'bg-orange-50 text-orange-700 shadow-[inset_0_0_0_1px_rgba(249,115,22,0.18)]'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                        ].join(' ')}
                      >
                        <span
                          className={[
                            'flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition',
                            isActive ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500 group-hover:bg-white',
                          ].join(' ')}
                        >
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="min-w-0 truncate">{item.label}</span>
                      </NavLink>
                    )
                  })}
                </nav>
              </aside>

              <section className="min-w-0">{children}</section>
            </section>
          </div>
        </main>
      </>
    </>
  )
}

export default AdminShell
