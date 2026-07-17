import { Link } from 'react-router-dom'
import type { User } from '../../types/user'
import PermissionBadge from './PermissionBadge'
import Button from '../common/Button'
import { formatRoleLabel } from '../../features/admin/adminDisplay'

interface AdministratorCardProps {
  administrator: User
  onToggleStatus?: (administrator: User) => void
}

const AdministratorCard = ({ administrator, onToggleStatus }: AdministratorCardProps) => (
  <article className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-panel">
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h3 className="break-words font-display text-lg font-semibold text-slate-900">
          {administrator.firstName} {administrator.lastName}
        </h3>
        <p className="mt-1 break-all text-sm text-slate-500">{administrator.email}</p>
        <p className="mt-1 text-sm text-slate-500">Rôle: {formatRoleLabel(administrator.role)}</p>
      </div>
      <span
        className={[
          'rounded-full px-2.5 py-1 text-xs font-semibold',
          administrator.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700',
        ].join(' ')}
      >
        {administrator.isActive ? 'Actif' : 'Inactif'}
      </span>
    </div>
    <div className="mt-3 flex flex-wrap gap-2">
      {(administrator.permissions ?? []).slice(0, 4).map((permission) => (
        <PermissionBadge key={permission} permission={permission} />
      ))}
    </div>
    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
      <Link to={`/admin/administrateurs/${administrator._id}`} className="w-full sm:w-auto">
        <Button variant="secondary" className="w-full">
          Voir
        </Button>
      </Link>
      {onToggleStatus ? (
        <Button variant={administrator.isActive ? 'ghost' : 'primary'} onClick={() => onToggleStatus(administrator)} className="w-full sm:w-auto">
          {administrator.isActive ? 'Désactiver' : 'Réactiver'}
        </Button>
      ) : null}
    </div>
  </article>
)

export default AdministratorCard
