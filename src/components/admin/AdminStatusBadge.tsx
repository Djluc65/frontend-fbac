interface AdminStatusBadgeProps {
  label: string
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger'
  className?: string
}

const toneClasses: Record<NonNullable<AdminStatusBadgeProps['tone']>, string> = {
  neutral: 'bg-slate-100 text-slate-700',
  info: 'bg-sky-100 text-sky-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
}

const AdminStatusBadge = ({ label, tone = 'neutral', className = '' }: AdminStatusBadgeProps) => {
  return (
    <span
      className={[
        'inline-flex max-w-full items-center rounded-full px-3 py-1.5 text-xs font-semibold',
        toneClasses[tone],
        className,
      ].join(' ')}
    >
      <span className="truncate">{label}</span>
    </span>
  )
}

export default AdminStatusBadge
