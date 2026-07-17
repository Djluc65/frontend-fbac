import {
  BadgeCheck,
  FolderKanban,
  ShieldCheck,
  Sparkles,
  UserCircle2,
} from 'lucide-react'
import AdminShell from '../../components/admin/AdminShell'
import AdminCard from '../../components/admin/AdminCard'
import AdminQuickActions from '../../components/admin/AdminQuickActions'
import { getAdminQuickAccessNavigation } from '../../components/admin/adminNavigation'
import { getAdminCapabilities } from '../../components/admin/adminPermissions'
import { useAppSelector } from '../../app/hooks'
import { selectCurrentUser } from '../../features/auth/authSelectors'

const AdminDashboardPage = () => {
  const user = useAppSelector(selectCurrentUser)
  const permissions = user?.permissions ?? []
  const capabilities = getAdminCapabilities(permissions)
  const quickAccess = getAdminQuickAccessNavigation(capabilities)

  return (
    <AdminShell
      title="Tableau de bord administrateur"
      description="Pilotez le contenu éditorial et les campagnes de la fondation depuis une interface centralisée."
    >
      <div className="space-y-4 sm:space-y-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
          <AdminCard
            icon={UserCircle2}
            title="Session active"
            description="Vos informations d’accès sont visibles ici pour un contrôle rapide."
          >
            <dl className="grid gap-3 text-sm text-slate-600">
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Nom</dt>
                <dd className="mt-1 break-words font-medium text-slate-900">
                  {user?.firstName} {user?.lastName}
                </dd>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Email</dt>
                <dd className="mt-1 break-words font-medium text-slate-900">{user?.email}</dd>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Rôle</dt>
                <dd className="mt-1 font-medium capitalize text-slate-900">{user?.role}</dd>
              </div>
            </dl>
          </AdminCard>

          <AdminCard
            icon={ShieldCheck}
            title="Permissions actives"
            description="Les modules affichés s’adaptent automatiquement à votre niveau d’accès."
          >
            {permissions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {permissions.map((permission) => (
                  <span
                    key={permission}
                    className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700"
                  >
                    <BadgeCheck className="h-[18px] w-[18px]" />
                    {permission}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm leading-6 text-slate-500">Aucune permission spécifique remontée.</p>
            )}
          </AdminCard>
        </section>

        <AdminCard
          icon={Sparkles}
          title="Vue d’ensemble"
          description="Une interface mobile plus compacte pour piloter les modules essentiels sans perdre les actions importantes."
          className="bg-gradient-to-r from-white via-orange-50/40 to-white"
        >
          <div className="grid gap-3 min-[430px]:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-[20px] border border-slate-200 bg-white px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Modules visibles</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{quickAccess.length}</p>
            </div>
            <div className="rounded-[20px] border border-slate-200 bg-white px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Permissions</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{permissions.length}</p>
            </div>
            <div className="rounded-[20px] border border-slate-200 bg-white px-4 py-3 min-[430px]:col-span-2 xl:col-span-1">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                <FolderKanban className="h-[18px] w-[18px] text-orange-500" />
                Focus
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Accédez rapidement aux modules éditoriaux, paiements et statistiques.
              </p>
            </div>
          </div>
        </AdminCard>

        <AdminQuickActions
          title="Accès rapide"
          description="Ouvrez directement les modules les plus utiles pour votre profil, avec une grille pensée pour le smartphone."
          items={quickAccess}
        />
      </div>
    </AdminShell>
  )
}

export default AdminDashboardPage
