import type { ReactNode } from 'react'
import { House, LogOut, Menu } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../common/Button'
import BrandLogo from '../common/BrandLogo'
import { formatRoleLabel } from '../../features/admin/adminDisplay'

interface AdminHeroProps {
  title: string
  description: string
  userName?: string
  userRole?: string
  actions?: ReactNode
  isLoggingOut?: boolean
  onLogout: () => void
  onOpenNavigation: () => void
}

const actionButtonClassName =
  'h-10 rounded-xl border-white/30 bg-white px-3.5 py-0 text-xs font-semibold text-orange-700 hover:bg-orange-50 sm:text-sm'

const AdminHero = ({
  title,
  description,
  userName,
  userRole,
  actions,
  isLoggingOut = false,
  onLogout,
  onOpenNavigation,
}: AdminHeroProps) => {
  return (
    <section className="w-full min-w-0 max-w-full overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 p-4 text-white shadow-panel sm:rounded-3xl sm:p-6 lg:rounded-[32px] lg:p-8">
      <div className="min-w-0 space-y-5">
        <div className="flex min-w-0 flex-wrap items-start justify-between gap-3 lg:hidden">
          <button
            type="button"
            onClick={onOpenNavigation}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-3.5 text-xs font-semibold text-white transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-orange-600"
            aria-label="Ouvrir la navigation administrateur"
          >
            <Menu className="h-5 w-5" />
            Navigation
          </button>

          <div className="flex min-w-0 flex-wrap items-center justify-end gap-2">
            <Link
              to="/"
              className={`inline-flex items-center gap-1.5 ${actionButtonClassName} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-orange-600`}
            >
              <House className="h-4 w-4" />
              Accueil
            </Link>
            <Button variant="secondary" className={actionButtonClassName} isLoading={isLoggingOut} onClick={onLogout}>
              <LogOut className="h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>

        <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
          <div className="min-w-0 space-y-4">
            <div className="mx-auto flex w-full flex-col items-center text-center lg:mx-0 lg:items-start lg:text-left">
              <BrandLogo
                to="/"
                className="inline-flex"
                imageClassName="max-h-[76px] w-auto object-contain sm:max-h-[86px] lg:max-h-[88px]"
                variant="light"
              />
              <div className="mt-3 inline-flex items-center rounded-full bg-white/14 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-50">
                Administration sécurisée
              </div>
            </div>

            <div className="min-w-0 space-y-2">
              <h1 className="text-center font-display text-[22px] font-bold leading-tight text-white lg:text-left lg:text-4xl">
                {title}
              </h1>
              <p className="mx-auto max-w-2xl text-center text-sm leading-6 text-orange-50/95 line-clamp-2 lg:mx-0 lg:text-left lg:text-base lg:line-clamp-none">
                {description}
              </p>
            </div>

            <div className="flex min-w-0 flex-wrap items-center justify-center gap-2 text-xs font-medium text-orange-50 sm:text-sm lg:justify-start">
              {userName ? <span className="rounded-full bg-white/12 px-3 py-1.5">{userName}</span> : null}
              {userRole ? <span className="rounded-full bg-white/12 px-3 py-1.5">{formatRoleLabel(userRole)}</span> : null}
            </div>

            {actions ? <div className="min-w-0 lg:hidden">{actions}</div> : null}
          </div>

          <div className="hidden min-w-0 items-center gap-3 lg:flex">
            {actions}
            <Link
              to="/"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/30 bg-white px-4 text-sm font-semibold text-orange-700 transition hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-orange-600"
            >
              <House className="h-4 w-4" />
              Accueil
            </Link>
            <Button
              variant="secondary"
              className="h-10 border-white/30 bg-white px-4 py-0 text-sm text-orange-700 hover:bg-orange-50"
              isLoading={isLoggingOut}
              onClick={onLogout}
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AdminHero
