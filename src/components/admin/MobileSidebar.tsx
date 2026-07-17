import { useEffect, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { ChevronRight, X } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import BrandLogo from '../common/BrandLogo'
import type { AdminNavigationItem } from './adminNavigation'
import { isAdminNavigationItemActive } from './adminNavigation'

interface MobileSidebarProps {
  open: boolean
  onClose: () => void
  items: AdminNavigationItem[]
  pathname: string
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

const MobileSidebar = ({ open, onClose, items, pathname }: MobileSidebarProps) => {
  const panelRef = useRef<HTMLDivElement | null>(null)
  const touchStartXRef = useRef<number | null>(null)

  const portalRoot = useMemo(() => {
    if (typeof document === 'undefined') {
      return null
    }

    return document.body
  }, [])

  useEffect(() => {
    if (!open || !panelRef.current) {
      return undefined
    }

    const previousActiveElement = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusables = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
    focusables[0]?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab' || !panelRef.current) {
        return
      }

      const currentFocusables = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      const first = currentFocusables[0]
      const last = currentFocusables[currentFocusables.length - 1]

      if (!first || !last) {
        return
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
      previousActiveElement?.focus?.()
    }
  }, [onClose, open])

  if (!open || !portalRoot) {
    return null
  }

  return createPortal(
    <div className="fixed inset-0 z-[80] lg:hidden" aria-hidden={!open}>
      <motion.button
        type="button"
        aria-label="Fermer la navigation"
        className="absolute inset-0 bg-slate-950/55 backdrop-blur-[2px]"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      />

      <motion.aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation administrateur"
        className="absolute inset-y-0 left-0 flex h-full w-[85%] max-w-[340px] flex-col overflow-hidden rounded-r-[32px] bg-white shadow-2xl"
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        onTouchStart={(event) => {
          touchStartXRef.current = event.changedTouches[0]?.clientX ?? null
        }}
        onTouchEnd={(event) => {
          const start = touchStartXRef.current
          const end = event.changedTouches[0]?.clientX ?? null

          if (start !== null && end !== null && start - end > 64) {
            onClose()
          }

          touchStartXRef.current = null
        }}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Navigation</p>
            <p className="mt-1 text-sm font-medium text-slate-600">Tableau de bord Fondation</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 pb-5 pt-4">
          <BrandLogo
            to="/"
            className="mx-auto inline-flex w-full justify-center"
            imageClassName="max-h-[72px] w-auto"
            variant="default"
          />
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-5" aria-label="Navigation administrateur mobile">
          {items.map((item) => {
            const Icon = item.icon
            const isActive = isAdminNavigationItemActive(pathname, item)

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={[
                  'group flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2',
                  isActive
                    ? 'bg-orange-50 text-orange-700 shadow-[inset_0_0_0_1px_rgba(249,115,22,0.18)]'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                ].join(' ')}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span
                    className={[
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition',
                      isActive ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500 group-hover:bg-white',
                    ].join(' ')}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 truncate text-sm font-semibold">{item.label}</span>
                </span>
                <ChevronRight className={['h-4 w-4 shrink-0 transition', isActive ? 'text-orange-500' : 'text-slate-300'].join(' ')} />
              </NavLink>
            )
          })}
        </nav>

        <div className="border-t border-slate-100 px-5 py-4">
          <Link
            to="/"
            onClick={onClose}
            className="inline-flex text-sm font-semibold text-orange-600 transition hover:text-orange-700"
          >
            Retour au site
          </Link>
        </div>
      </motion.aside>
    </div>,
    portalRoot
  )
}

export default MobileSidebar
