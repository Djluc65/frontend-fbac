import { MonitorSmartphone, ShieldOff } from 'lucide-react'
import Button from '../common/Button'
import type { AdminSessionItem } from '../../features/admin/adminManagementTypes'

interface ActiveSessionsListProps {
  sessions: AdminSessionItem[]
  onRevokeOne: (id: string) => void
  onRevokeOthers: () => void
  isLoading?: boolean
}

const ActiveSessionsList = ({
  sessions,
  onRevokeOne,
  onRevokeOthers,
  isLoading = false,
}: ActiveSessionsListProps) => (
  <div className="space-y-4">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="font-display text-xl font-semibold text-slate-900">Sessions actives</h3>
        <p className="text-sm text-slate-500">Révoquez les autres appareils en cas de doute.</p>
      </div>
      <Button variant="secondary" onClick={onRevokeOthers} isLoading={isLoading}>
        <ShieldOff className="h-4 w-4" />
        Révoquer les autres sessions
      </Button>
    </div>

    <div className="space-y-3">
      {sessions.map((session) => (
        <article key={session._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-panel">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <MonitorSmartphone className="h-4 w-4 text-orange-500" />
                <span className="truncate">{session.browser}</span>
                {session.isCurrent ? (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">Session actuelle</span>
                ) : null}
              </div>
              <p className="mt-1 text-sm text-slate-500">IP: {session.ipAddress}</p>
              <p className="mt-1 text-xs text-slate-400">
                Dernière activité: {session.lastActivityAt ? new Date(session.lastActivityAt).toLocaleString('fr-FR') : 'Inconnue'}
              </p>
            </div>
            {!session.isCurrent ? (
              <Button variant="ghost" onClick={() => onRevokeOne(session._id)}>
                Révoquer
              </Button>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  </div>
)

export default ActiveSessionsList
