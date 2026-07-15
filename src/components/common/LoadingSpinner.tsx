type LoadingSpinnerProps = {
  label?: string
  className?: string
}

const LoadingSpinner = ({
  label = 'Chargement en cours...',
  className = '',
}: LoadingSpinnerProps) => {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} role="status" aria-live="polite">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-orange-200 border-t-orange-500" />
      <span className="text-sm text-slate-500">{label}</span>
    </div>
  )
}

export default LoadingSpinner
