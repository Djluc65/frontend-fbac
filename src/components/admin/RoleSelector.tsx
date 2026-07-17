import { formatRoleLabel } from '../../features/admin/adminDisplay'

interface RoleSelectorProps {
  label?: string
  value: string
  roles: Array<{ code: string; name: string }>
  onChange: (value: string) => void
}

const RoleSelector = ({ label = 'Rôle', value, roles, onChange }: RoleSelectorProps) => (
  <div className="w-full min-w-0 space-y-2">
    <label className="block text-sm font-medium text-slate-700">{label}</label>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="block w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-3 text-base text-slate-900 shadow-sm outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100 sm:px-4 sm:text-sm"
    >
      <option value="">Sélectionner un rôle</option>
      {roles.map((role) => (
        <option key={role.code} value={role.code}>
          {formatRoleLabel(role.code || role.name)}
        </option>
      ))}
    </select>
  </div>
)

export default RoleSelector
