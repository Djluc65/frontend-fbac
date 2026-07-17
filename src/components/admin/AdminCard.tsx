import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

interface AdminCardProps {
  icon?: LucideIcon
  title?: string
  description?: string
  children?: ReactNode
  className?: string
  contentClassName?: string
}

const AdminCard = ({
  icon: Icon,
  title,
  description,
  children,
  className = '',
  contentClassName = '',
}: AdminCardProps) => {
  return (
    <article
      className={[
        'overflow-hidden rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-panel transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.12)] sm:p-5',
        className,
      ].join(' ')}
    >
      {(Icon || title || description) && (
        <div className="mb-4 flex items-start gap-3">
          {Icon ? (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
              <Icon className="h-5 w-5" />
            </div>
          ) : null}
          {(title || description) && (
            <div className="min-w-0">
              {title ? <h2 className="font-display text-lg font-semibold text-slate-900">{title}</h2> : null}
              {description ? <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p> : null}
            </div>
          )}
        </div>
      )}

      <div className={contentClassName}>{children}</div>
    </article>
  )
}

export default AdminCard
