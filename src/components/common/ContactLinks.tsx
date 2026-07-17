import { ExternalLink, Mail, MapPin, Phone } from 'lucide-react'

export interface ContactInfo {
  address: string
  phoneDisplay?: string
  phoneHref?: string
  email: string
}

interface ContactLinksProps {
  contactInfo: ContactInfo
  className?: string
  itemClassName?: string
  variant?: 'cards' | 'compact'
  theme?: 'light' | 'dark'
  emailSubject?: string
  desktopLayout?: 'grid' | 'rows'
}

const CONTACT_EMAIL_SUBJECT = 'Contact depuis le site de la Fondation Bien Aimé Cassis'

const normalizePhoneHref = (phone: string) => {
  const trimmed = phone.trim()
  const digits = trimmed.replace(/[^\d]/g, '')

  if (!digits) {
    return trimmed
  }

  return trimmed.startsWith('+') ? `+${digits}` : digits
}

const formatPhoneDisplay = (phone: string) => {
  const digits = phone.replace(/[^\d]/g, '')

  if (digits.startsWith('509') && digits.length === 11) {
    return `+509 ${digits.slice(3, 7)} ${digits.slice(7)}`
  }

  if (digits.length === 8) {
    return `${digits.slice(0, 4)} ${digits.slice(4)}`
  }

  return phone
}

const ContactLinks = ({
  contactInfo,
  className = '',
  itemClassName = '',
  variant = 'cards',
  theme = 'light',
  emailSubject = CONTACT_EMAIL_SUBJECT,
  desktopLayout = 'grid',
}: ContactLinksProps) => {
  const phoneDisplay = contactInfo.phoneDisplay || formatPhoneDisplay(contactInfo.phoneHref || '')
  const phoneHref = normalizePhoneHref(contactInfo.phoneHref || contactInfo.phoneDisplay || '')
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    contactInfo.address
  )}`
  const mailtoUrl = `mailto:${contactInfo.email}?subject=${encodeURIComponent(emailSubject)}`

  const isCards = variant === 'cards'
  const isDark = theme === 'dark'
  const isDesktopRows = isCards && desktopLayout === 'rows'

  const wrapperClassName = [
    'grid min-w-0 gap-4',
    isCards ? (isDesktopRows ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3') : 'grid-cols-1',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const linkClassName = [
    'group min-w-0 rounded-2xl transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2',
    isDark ? 'focus-visible:ring-offset-soft-black' : 'focus-visible:ring-offset-white',
    isCards
      ? isDark
        ? `flex h-full items-start gap-4 border border-gray-800 bg-gray-900/40 p-5 text-gray-200 hover:border-orange-400 hover:text-orange-300${isDesktopRows ? ' lg:flex-row lg:items-center lg:gap-6' : ''}`
        : `flex h-full items-start gap-4 border border-gray-200 bg-white p-5 text-slate-700 shadow-sm hover:border-orange-200 hover:text-orange-500 hover:shadow-md${isDesktopRows ? ' lg:flex-row lg:items-center lg:gap-6' : ''}`
      : isDark
        ? 'flex items-start gap-3 rounded-lg px-0 py-1 text-gray-300 hover:text-orange-300'
        : 'flex items-start gap-3 rounded-lg px-0 py-1 text-gray-600 hover:text-orange-500',
    itemClassName,
  ]
    .filter(Boolean)
    .join(' ')

  const iconWrapperClassName = [
    'flex shrink-0 items-center justify-center rounded-full transition-colors',
    isCards ? 'h-12 w-12' : 'mt-0.5 h-10 w-10',
    isDark ? 'bg-orange-500/15 text-orange-300' : 'bg-orange-100 text-orange-500',
  ].join(' ')

  const titleClassName = [
    'font-semibold',
    isDark ? 'text-white group-hover:text-orange-200' : 'text-soft-black group-hover:text-orange-600',
  ].join(' ')

  const descriptionClassName = [
    'mt-1 text-sm',
    isDesktopRows ? 'lg:mt-0 lg:shrink-0 lg:text-right' : '',
    isDark ? 'text-gray-400 group-hover:text-orange-100/90' : 'text-gray-500 group-hover:text-gray-600',
  ].join(' ')

  const valueClassName = [
    'min-w-0 text-sm sm:text-base',
    isDark ? 'text-gray-200 group-hover:text-white' : 'text-slate-600 group-hover:text-orange-600',
  ].join(' ')

  return (
    <div className={wrapperClassName}>
      <a
        href={googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Afficher l'adresse de la Fondation Bien Aimé Cassis dans Google Maps"
        className={linkClassName}
      >
        <div className={iconWrapperClassName}>
          <MapPin className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className={`min-w-0 ${isDesktopRows ? 'lg:flex lg:flex-1 lg:items-center lg:justify-between lg:gap-6' : ''}`}>
          <div className="min-w-0">
            <p className={titleClassName}>Adresse</p>
            <p className={`${valueClassName} break-words`}>{contactInfo.address}</p>
          </div>
          <p className={descriptionClassName}>
            Voir sur Google Maps
            <ExternalLink className="ml-1 inline h-3.5 w-3.5" aria-hidden="true" />
          </p>
        </div>
      </a>

      <a
        href={`tel:${phoneHref}`}
        aria-label={`Appeler la Fondation Bien Aimé Cassis au ${phoneDisplay}`}
        className={linkClassName}
      >
        <div className={iconWrapperClassName}>
          <Phone className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className={`min-w-0 ${isDesktopRows ? 'lg:flex lg:flex-1 lg:items-center lg:justify-between lg:gap-6' : ''}`}>
          <div className="min-w-0">
            <p className={titleClassName}>Téléphone</p>
            <p className={`${valueClassName} break-words`}>{phoneDisplay}</p>
          </div>
          <p className={descriptionClassName}>Appeler maintenant</p>
        </div>
      </a>

      <a
        href={mailtoUrl}
        aria-label="Envoyer un e-mail à la Fondation Bien Aimé Cassis"
        className={linkClassName}
      >
        <div className={iconWrapperClassName}>
          <Mail className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className={`min-w-0 ${isDesktopRows ? 'lg:flex lg:flex-1 lg:items-center lg:justify-between lg:gap-6' : ''}`}>
          <div className="min-w-0">
            <p className={titleClassName}>Adresse e-mail</p>
            <p className={`${valueClassName} break-all`}>{contactInfo.email}</p>
          </div>
          <p className={descriptionClassName}>Envoyer un e-mail</p>
        </div>
      </a>
    </div>
  )
}

export default ContactLinks
