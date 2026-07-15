import { Link } from 'react-router-dom'
import { useSiteContent } from '../../features/siteContent/useSiteContent'
import DefaultLogo from '../../../logo/logo1-remove-background.png'

interface BrandLogoProps {
  to?: string
  className?: string
  imageClassName?: string
  loading?: 'eager' | 'lazy'
}

const BrandLogo = ({
  to,
  className = '',
  imageClassName = '',
  loading = 'eager',
}: BrandLogoProps) => {
  const { content } = useSiteContent()
  const src = content.navbar.logoUrl || DefaultLogo
  const alt = content.navbar.siteName

  const image = (
    <img
      src={src}
      alt={alt}
      loading={loading}
      className={[
        'h-auto w-auto max-w-full object-contain',
        imageClassName,
      ].join(' ')}
    />
  )

  if (!to) {
    return <div className={className}>{image}</div>
  }

  return (
    <Link to={to} className={className} aria-label={alt}>
      {image}
    </Link>
  )
}

export default BrandLogo
