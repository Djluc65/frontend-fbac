import PermissionBadge from './PermissionBadge'
import { formatPermissionGroupLabel, formatPermissionLabel } from '../../features/admin/adminDisplay'

interface PermissionMatrixProps {
  permissions: string[]
  selectedPermissions: string[]
  onToggle: (permission: string) => void
  inheritedPermissions?: string[]
  readOnly?: boolean
}

const groupPermissions = (permissions: string[]) =>
  permissions.reduce<Record<string, string[]>>((accumulator, permission) => {
    const [module = 'Autres'] = permission.split('.')
    if (!accumulator[module]) {
      accumulator[module] = []
    }
    accumulator[module].push(permission)
    return accumulator
  }, {})

const PermissionMatrix = ({
  permissions,
  selectedPermissions,
  onToggle,
  inheritedPermissions = [],
  readOnly = false,
}: PermissionMatrixProps) => {
  const permissionGroups = groupPermissions(permissions)

  return (
    <div className="space-y-4">
      {Object.entries(permissionGroups).map(([group, groupPermissions]) => (
        <section key={group} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
          <h3 className="text-sm font-semibold text-slate-900">{formatPermissionGroupLabel(group)}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {groupPermissions.map((permission) => {
              const inherited = inheritedPermissions.includes(permission)
              const checked = selectedPermissions.includes(permission) || inherited

              return (
                <label
                  key={permission}
                  className="flex min-w-0 items-start gap-3 rounded-2xl bg-white px-4 py-3 text-sm text-slate-700"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(permission)}
                    disabled={readOnly || inherited}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                  />
                  <div className="min-w-0 space-y-1">
                    <div className="break-words font-medium text-slate-900">{formatPermissionLabel(permission)}</div>
                    {inherited ? <PermissionBadge permission="Héritée du rôle" /> : null}
                  </div>
                </label>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}

export default PermissionMatrix
