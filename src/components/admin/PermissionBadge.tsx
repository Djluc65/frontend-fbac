import { formatPermissionLabel } from '../../features/admin/adminDisplay'

interface PermissionBadgeProps {
  permission: string
}

const PermissionBadge = ({ permission }: PermissionBadgeProps) => (
  <span className="inline-flex items-center rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
    {formatPermissionLabel(permission)}
  </span>
)

export default PermissionBadge
