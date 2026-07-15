import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Logo from '../../logo/logo1-remove-background.png'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const mobileMenuId = 'mobile-navigation'

  const navLinks = [
    { path: '/', label: 'Accueil' },
    { path: '/a-propos', label: 'À propos' },
    { path: '/programmes', label: 'Programmes' },
    { path: '/campagnes', label: 'Campagnes' },
    { path: '/actualites', label: 'Actualités' },
    { path: '/transparence', label: 'Transparence' },
    { path: '/contact', label: 'Contact' },
  ]

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[76px] items-center justify-between gap-4 py-3 lg:min-h-[88px]">
          <Link
            to="/"
            className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3 lg:flex-none"
            aria-label="Fondation Bien Aimé Cassis"
          >
            <img
              src={Logo}
              alt="Fondation Bien Aimé Cassis"
              loading="eager"
              className="h-10 w-auto flex-shrink-0 object-contain sm:h-12 lg:h-14 xl:h-16"
            />
            <span className="hidden min-w-0 font-display text-sm font-bold leading-tight text-orange-500 sm:block lg:text-base xl:text-lg">
              Fondation Bien Aimé Cassis
            </span>
          </Link>

          <nav
            aria-label="Navigation principale"
            className="hidden items-center gap-4 text-sm xl:flex xl:gap-6 2xl:gap-8"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`whitespace-nowrap font-medium transition-colors hover:text-orange-500 ${
                  location.pathname === link.path ? 'text-orange-500' : 'text-soft-black'
                } xl:text-sm 2xl:text-base`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden flex-shrink-0 xl:block">
            <Link
              to="/faire-un-don"
              className="inline-flex w-auto min-w-max items-center justify-center whitespace-nowrap rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-orange-600 hover:shadow-lg 2xl:px-6 2xl:py-3 2xl:text-base"
            >
              Faire un don
            </Link>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            type="button"
            className="inline-flex flex-shrink-0 items-center justify-center rounded-xl p-2 text-soft-black transition-colors hover:bg-orange-50 hover:text-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 xl:hidden"
            aria-expanded={isMenuOpen}
            aria-controls={mobileMenuId}
            aria-label={isMenuOpen ? 'Fermer le menu de navigation' : 'Ouvrir le menu de navigation'}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div
            id={mobileMenuId}
            className="border-t border-orange-100 pb-6 pt-4 xl:hidden"
          >
            <nav aria-label="Navigation mobile" className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`rounded-xl px-3 py-3 text-base font-medium transition-colors hover:bg-orange-50 hover:text-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                    location.pathname === link.path ? 'text-orange-500' : 'text-soft-black'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/faire-un-don"
                onClick={() => setIsMenuOpen(false)}
                className="mt-4 inline-flex w-full items-center justify-center whitespace-nowrap rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                Faire un don
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar
