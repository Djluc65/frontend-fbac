import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { Helmet } from 'react-helmet-async'
import {
  BarChart3,
  ClipboardList,
  ChevronDown,
  Download,
  FileBadge2,
  House,
  LayoutDashboard,
  Megaphone,
  Newspaper,
  FilePenLine,
  LogOut,
  ReceiptText,
  ScrollText,
  Sigma,
  Wallet,
  WalletCards,
  ShieldCheck,
} from 'lucide-react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
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
  const location = useLocation()
  const navigate = useNavigate()
  const user = useAppSelector(selectCurrentUser)
  const [logout, { isLoading }] = useLogoutMutation()
  const contentSectionRef = useRef<HTMLElement | null>(null)
  const mobileMenuRef = useRef<HTMLDetailsElement | null>(null)

  const permissions = user?.permissions ?? []
  const canManageCampaigns = hasPermission(permissions, ['campaigns.manage'])
  const canManagePublications = hasPermission(permissions, ['news.create', 'news.update', 'news.delete'])
  const canManageContent = hasPermission(permissions, ['content.manage'])
  const canManagePayments = hasPermission(permissions, ['donations.manage', 'donations.read'])

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
    {
      to: '/admin/paiements',
      label: 'Paiements',
      icon: WalletCards,
      visible: canManagePayments,
    },
    {
      to: '/admin/paiements/verifications',
      label: 'À vérifier',
      icon: ShieldCheck,
      visible: canManagePayments,
    },
    {
      to: '/admin/donations/dashboard',
      label: 'Vue des dons',
      icon: Wallet,
      visible: canManagePayments,
    },
    {
      to: '/admin/donations',
      label: 'Tous les dons',
      icon: ClipboardList,
      visible: canManagePayments,
    },
    {
      to: '/admin/donations/transactions',
      label: 'Transactions',
      icon: ReceiptText,
      visible: canManagePayments,
    },
    {
      to: '/admin/donations/statistics',
      label: 'Statistiques',
      icon: BarChart3,
      visible: canManagePayments,
    },
    {
      to: '/admin/donations/simulations',
      label: 'Simulations',
      icon: Sigma,
      visible: canManagePayments,
    },
    {
      to: '/admin/donations/reports',
      label: 'Rapports',
      icon: FileBadge2,
      visible: canManagePayments,
    },
    {
      to: '/admin/donations/exports',
      label: 'Exports',
      icon: Download,
      visible: canManagePayments,
    },
    {
      to: '/admin/audit-logs',
      label: 'Audit',
      icon: ScrollText,
      visible: canManagePayments,
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

  const closeMobileMenu = () => {
    mobileMenuRef.current?.removeAttribute('open')
  }

  useLayoutEffect(() => {
    closeMobileMenu()

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

      <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 to-orange-700 p-6 text-white shadow-panel sm:p-8">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3 lg:hidden">
                  <details ref={mobileMenuRef} className="relative min-w-0">
                    <summary className="flex list-none items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/15">
                      Navigation
                      <ChevronDown className="h-4 w-4" />
                    </summary>

                    <div className="absolute left-0 top-full z-20 mt-2 w-[240px] max-w-[78vw] rounded-2xl bg-white p-2 shadow-2xl">
                      <nav className="flex max-h-[60vh] flex-col gap-1 overflow-y-auto">
                        {navigationItems.map((item) => {
                          const Icon = item.icon

                          return (
                            <NavLink
                              key={item.to}
                              to={item.to}
                              onClick={closeMobileMenu}
                              className={({ isActive }) =>
                                [
                                  'inline-flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                                  isActive
                                    ? 'bg-orange-100 text-orange-700'
                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                                ].join(' ')
                              }
                            >
                              <Icon className="h-4 w-4 shrink-0" />
                              <span className="truncate">{item.label}</span>
                            </NavLink>
                          )
                        })}
                      </nav>
                    </div>
                  </details>

                  <div className="flex items-center gap-2">
                    <Link
                      to="/"
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/30 bg-white px-3 py-2 text-xs font-semibold text-orange-700 transition hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-orange-600"
                    >
                      <House className="h-3.5 w-3.5" />
                      Accueil
                    </Link>
                    <Button
                      variant="secondary"
                      className="rounded-lg border-white/30 bg-white px-3 py-2 text-xs text-orange-700 hover:bg-orange-50"
                      isLoading={isLoading}
                      onClick={handleLogout}
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Se déconnecter
                    </Button>
                  </div>
                </div>

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

              <div className="hidden flex-col gap-3 sm:flex-row sm:items-center lg:flex">
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

          <section ref={contentSectionRef} className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
            <aside className="hidden h-fit rounded-3xl bg-white p-4 shadow-panel lg:block">
              <BrandLogo
                to="/"
                className="mb-4 hidden max-w-full px-3 sm:inline-flex"
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
