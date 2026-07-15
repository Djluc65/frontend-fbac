import type { ReactNode } from 'react'
import { Helmet } from 'react-helmet-async'
import { House, LayoutDashboard, Megaphone, Newspaper, FilePenLine, LogOut } from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import Button from '../common/Button'
import BrandLogo from '../common/BrandLogo'
import { useAppSelector } from '../../app/hooks'
import { useLogoutMutation } from '../../features/auth/authApi'
import { selectCurrentUser } from '../../features/auth/authSelectors'

interface AdminShellProps {
  title: string
  description: string
  children: ReactNode
  actions?: ReactNode
}

const hasPermission = (permissions: string[] | undefined, required: string[]) => {
  if (!permissions?.length) {
    return false
  }

  if (permissions.includes('*')) {
    return true
  }

  return required.some((permission) => permissions.includes(permission))
}

const AdminShell = ({ title, description, children, actions }: AdminShellProps) => {
  const navigate = useNavigate()
  const user = useAppSelector(selectCurrentUser)
  const [logout, { isLoading }] = useLogoutMutation()

  const permissions = user?.permissions ?? []
  const canManageCampaigns = hasPermission(permissions, ['campaigns.manage'])
  const canManagePublications = hasPermission(permissions, ['news.create', 'news.update', 'news.delete'])
  const canManageContent = hasPermission(permissions, ['content.manage'])

  const navigationItems = [
    {
      to: '/admin/dashboard',
      label: 'Tableau de bord',
      icon: LayoutDashboard,
      visible: true,
    },
    {
      to: '/admin/contenu',
      label: 'Gestion du contenu',
      icon: FilePenLine,
      visible: canManageContent,
    },
    {
      to: '/admin/campagnes',
      label: 'Campagnes',
      icon: Megaphone,
      visible: canManageCampaigns,
    },
    {
      to: '/admin/publications',
      label: 'Publications',
      icon: Newspaper,
      visible: canManagePublications,
    },
  ].filter((item) => item.visible)

  const handleLogout = async () => {
    try {
      await logout().unwrap()
      toast.success('Déconnexion effectuée avec succès.')
      navigate('/admin/login', { replace: true })
    } catch {
      toast.error('Impossible de vous déconnecter pour le moment.')
    }
  }

  return (
    <>
      <Helmet>
        <title>{title} - Administration Fondation Bien Aimé Cassis</title>
      </Helmet>

      <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 to-orange-700 p-6 text-white shadow-panel sm:p-8">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
              <div className="space-y-4">
                <BrandLogo
                  to="/"
                  className="inline-flex max-w-full"
                  imageClassName="max-w-[180px] sm:max-w-[220px]"
                  variant="light"
                />
                <div className="inline-flex w-fit items-center rounded-full bg-white/15 px-4 py-2 text-sm font-medium">
                  Administration sécurisée
                </div>
                <div className="space-y-2">
                  <h1 className="font-display text-3xl font-bold sm:text-4xl">{title}</h1>
                  <p className="max-w-3xl text-sm leading-6 text-orange-50 sm:text-base">
                    {description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-orange-50">
                  <span className="rounded-full bg-white/10 px-3 py-1.5">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1.5">{user?.role}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {actions}
                <Link
                  to="/"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white px-4 py-3 text-sm font-semibold text-orange-700 transition hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-orange-600"
                >
                  <House className="h-4 w-4" />
                  Accueil
                </Link>
                <Button
                  variant="secondary"
                  className="border-white/30 bg-white text-orange-700 hover:bg-orange-50"
                  isLoading={isLoading}
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Se déconnecter
                </Button>
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
            <aside className="h-fit rounded-3xl bg-white p-4 shadow-panel">
              <BrandLogo
                to="/"
                className="mb-4 inline-flex max-w-full px-3"
                imageClassName="max-w-[170px]"
                loading="lazy"
              />
              <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Navigation
              </p>
              <nav className="flex flex-col gap-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon

                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        [
                          'inline-flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition',
                          isActive
                            ? 'bg-orange-100 text-orange-700'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                        ].join(' ')
                      }
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
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
  )
}

export default AdminShell
