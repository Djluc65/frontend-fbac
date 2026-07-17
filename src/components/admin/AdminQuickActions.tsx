import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import AdminCard from './AdminCard'

interface AdminQuickActionItem {
  to: string
  title: string
  description: string
  buttonLabel: string
  icon: LucideIcon
}

interface AdminQuickActionsProps {
  title: string
  description: string
  items: AdminQuickActionItem[]
}

const AdminQuickActions = ({ title, description, items }: AdminQuickActionsProps) => {
  return (
    <AdminCard
      title={title}
      description={description}
      contentClassName="space-y-4"
      className="p-4 sm:p-5"
    >
      {items.length === 0 ? (
        <p className="text-sm leading-6 text-slate-600">
          Votre compte accède au tableau de bord, mais aucun module complémentaire n&apos;est encore activé.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 min-[430px]:grid-cols-2 xl:grid-cols-2">
          {items.map((item) => {
            const Icon = item.icon

            return (
              <Link
                key={item.to}
                to={item.to}
                className="group flex h-full flex-col rounded-[24px] border border-slate-200 bg-slate-50/70 p-4 transition duration-200 hover:border-orange-200 hover:bg-orange-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-orange-600 shadow-sm transition group-hover:bg-orange-100">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-base font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 min-w-0 flex-1 break-words text-sm leading-6 text-slate-600">{item.description}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-orange-600">
                  {item.buttonLabel}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            )
          })}
        </div>
      )}
    </AdminCard>
  )
}

export default AdminQuickActions
