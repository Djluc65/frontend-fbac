import { Link } from 'react-router-dom'
import type { User } from '../../types/user'
import Button from '../common/Button'
import { formatRoleLabel } from '../../features/admin/adminDisplay'

interface AdministratorTableProps {
  administrators: User[]
  onToggleStatus?: (administrator: User) => void
}

const AdministratorTable = ({ administrators, onToggleStatus }: AdministratorTableProps) => (
  <div className="overflow-x-auto rounded-[24px] border border-slate-200 bg-white shadow-panel">
    <table className="min-w-full divide-y divide-slate-200 text-sm">
      <thead className="bg-slate-50">
        <tr>
          <th className="px-4 py-3 text-left font-semibold text-slate-600">Administrateur</th>
          <th className="px-4 py-3 text-left font-semibold text-slate-600">Rôle</th>
          <th className="px-4 py-3 text-left font-semibold text-slate-600">Statut</th>
          <th className="px-4 py-3 text-right font-semibold text-slate-600">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {administrators.map((administrator) => (
          <tr key={administrator._id}>
            <td className="px-4 py-4">
              <div className="font-medium text-slate-900">
                {administrator.firstName} {administrator.lastName}
              </div>
              <div className="text-slate-500">{administrator.email}</div>
            </td>
            <td className="px-4 py-4 text-slate-600">{formatRoleLabel(administrator.role)}</td>
            <td className="px-4 py-4">
              <span
                className={[
                  'rounded-full px-2.5 py-1 text-xs font-semibold',
                  administrator.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700',
                ].join(' ')}
              >
                {administrator.isActive ? 'Actif' : 'Inactif'}
              </span>
            </td>
            <td className="px-4 py-4">
              <div className="flex justify-end gap-2">
                <Link to={`/admin/administrateurs/${administrator._id}`}>
                  <Button variant="secondary">Voir</Button>
                </Link>
                {onToggleStatus ? (
                  <Button variant="ghost" onClick={() => onToggleStatus(administrator)}>
                    {administrator.isActive ? 'Désactiver' : 'Réactiver'}
                  </Button>
                ) : null}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export default AdministratorTable
