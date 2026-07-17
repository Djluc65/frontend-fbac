import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import AdminCard from './AdminCard'

interface AdminFilterPanelProps {
  icon: LucideIcon
  title: string
  description: string
  children: ReactNode
  className?: string
}

const AdminFilterPanel = ({ icon, title, description, children, className = '' }: AdminFilterPanelProps) => {
  return (
    <AdminCard
      icon={icon}
      title={title}
      description={description}
      className={className}
      contentClassName="space-y-4"
    >
      {children}
    </AdminCard>
  )
}

export default AdminFilterPanel
