import { useEffect, useState } from 'react'
import { ImageOff } from 'lucide-react'

interface ResilientImageProps {
  src?: string
  alt: string
  className?: string
  fallbackClassName?: string
  fallbackLabel?: string
}

const ResilientImage = ({
  src,
  alt,
  className = '',
  fallbackClassName = '',
  fallbackLabel = 'Image indisponible',
}: ResilientImageProps) => {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setHasError(false)
  }, [src])

  if (!src || hasError) {
    return (
      <div
        className={[
          'flex items-center justify-center gap-2 bg-slate-100 text-sm font-medium text-slate-500',
          fallbackClassName,
        ].join(' ')}
        role="img"
        aria-label={alt}
      >
        <ImageOff className="h-4 w-4" />
        <span>{fallbackLabel}</span>
      </div>
    )
  }

  return <img src={src} alt={alt} className={className} onError={() => setHasError(true)} />
}

export default ResilientImage
