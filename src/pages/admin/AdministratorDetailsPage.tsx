import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { ShieldCheck, UserCircle2 } from 'lucide-react'
import AdminShell from '../../components/admin/AdminShell'
import AdminCard from '../../components/admin/AdminCard'
import PermissionBadge from '../../components/admin/PermissionBadge'
import ActiveSessionsList from '../../components/admin/ActiveSessionsList'
import Button from '../../components/common/Button'
import {
  useGetAdministratorByIdQuery,
  useRevokeAdministratorSessionsMutation,
  useSendAdministratorPasswordResetMutation,
} from '../../features/admin/administratorsApi'
import { formatAuditActionLabel, formatRoleLabel } from '../../features/admin/adminDisplay'

const getErrorMessage = (error: unknown) => {
  if (error && typeof error === 'object' && 'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data) {
    return String(error.data.message)
  }
  return 'Une erreur est survenue.'
}

const AdministratorDetailsPage = () => {
  const { id = '' } = useParams<{ id: string }>()
  const { data, isLoading } = useGetAdministratorByIdQuery(id, { skip: !id })
  const [revokeSessions] = useRevokeAdministratorSessionsMutation()
  const [sendPasswordReset] = useSendAdministratorPasswordResetMutation()

  if (isLoading) {
    return (
      <AdminShell title="Détail administrateur" description="Consultez un compte, ses accès et ses traces récentes.">
        <div className="rounded-[24px] bg-white p-6 shadow-panel">Chargement...</div>
      </AdminShell>
    )
  }

  if (!data?.administrator) {
    return (
      <AdminShell title="Détail administrateur" description="Consultez un compte, ses accès et ses traces récentes.">
        <div className="rounded-[24px] bg-white p-6 shadow-panel">Administrateur introuvable.</div>
      </AdminShell>
    )
  }

  const administrator = data.administrator

  return (
    <AdminShell
      title="Détail administrateur"
      description="Consultez un compte, ses accès, ses sessions et son activité récente."
      actions={
        <Link to={`/admin/administrateurs/${administrator._id}/modifier`}>
          <Button variant="secondary" className="w-full sm:w-auto">
            Modifier
          </Button>
        </Link>
      }
    >
      <div className="space-y-4 sm:space-y-6">
        <AdminCard icon={UserCircle2} title="Informations générales" description="Profil, rôle et permissions du compte.">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Nom</p>
              <p className="mt-2 font-medium text-slate-900">{administrator.firstName} {administrator.lastName}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Email</p>
              <p className="mt-2 break-all font-medium text-slate-900">{administrator.email}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Rôle</p>
              <p className="mt-2 font-medium text-slate-900">{formatRoleLabel(administrator.role)}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Statut</p>
              <p className="mt-2 font-medium text-slate-900">{administrator.isActive ? 'Actif' : 'Inactif'}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {(administrator.permissions ?? []).map((permission) => (
              <PermissionBadge key={permission} permission={permission} />
            ))}
          </div>
        </AdminCard>

        <AdminCard icon={ShieldCheck} title="Actions sensibles" description="Réinitialisation du mot de passe et révocation des sessions.">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              variant="secondary"
              onClick={async () => {
                try {
                  await sendPasswordReset(administrator._id).unwrap()
                  toast.success('Le compte devra redéfinir son mot de passe.')
                } catch (error) {
                  toast.error(getErrorMessage(error))
                }
              }}
            >
              Forcer la réinitialisation du mot de passe
            </Button>
            <Button
              variant="ghost"
              onClick={async () => {
                try {
                  await revokeSessions(administrator._id).unwrap()
                  toast.success('Sessions administrateur révoquées.')
                } catch (error) {
                  toast.error(getErrorMessage(error))
                }
              }}
            >
              Révoquer toutes les sessions
            </Button>
          </div>
        </AdminCard>

        <AdminCard icon={ShieldCheck} title="Sessions actives" description="Sessions actives du compte administrateur.">
          <ActiveSessionsList sessions={data.sessions} onRevokeOne={() => undefined} onRevokeOthers={() => undefined} />
        </AdminCard>

        <AdminCard icon={ShieldCheck} title="Activité récente" description="Historique récent des actions administratives liées à ce compte.">
          <div className="space-y-3">
            {data.recentAudit.map((entry) => (
              <div key={entry._id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="font-medium text-slate-900">{formatAuditActionLabel(entry.action)}</p>
                <p className="mt-1 text-xs text-slate-500">{new Date(entry.createdAt).toLocaleString('fr-FR')}</p>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>
    </AdminShell>
  )
}

export default AdministratorDetailsPage
