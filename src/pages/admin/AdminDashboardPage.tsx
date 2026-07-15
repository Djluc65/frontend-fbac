import { FilePenLine, FolderKanban, Megaphone, Newspaper, ShieldCheck, UserCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import AdminShell from '../../components/admin/AdminShell'
import { useAppSelector } from '../../app/hooks'
import { selectCurrentUser } from '../../features/auth/authSelectors'

const hasPermission = (permissions: string[] | undefined, required: string[]) => {
  if (!permissions?.length) {
    return false
  }

  if (permissions.includes('*')) {
    return true
  }

  return required.some((permission) => permissions.includes(permission))
}

const AdminDashboardPage = () => {
  const user = useAppSelector(selectCurrentUser)
  const permissions = user?.permissions ?? []
  const canManageCampaigns = hasPermission(permissions, ['campaigns.manage'])
  const canManagePublications = hasPermission(permissions, ['news.create', 'news.update', 'news.delete'])
  const canManageContent = hasPermission(permissions, ['content.manage'])

  const quickAccess = [
    {
      title: 'Gérer le contenu du site',
      description: 'Modifier les textes, la rubrique Notre équipe, le footer, le header et les pages statiques du site public.',
      to: '/admin/contenu',
      icon: FilePenLine,
      visible: canManageContent,
    },
    {
      title: 'Gérer les campagnes',
      description: 'Créer, modifier et supprimer les campagnes de collecte avec image, montant cible et dates.',
      to: '/admin/campagnes',
      icon: Megaphone,
      visible: canManageCampaigns,
    },
    {
      title: 'Gérer les publications',
      description: 'Rédiger des publications, les garder en brouillon ou les publier avec image principale.',
      to: '/admin/publications',
      icon: Newspaper,
      visible: canManagePublications,
    },
  ].filter((item) => item.visible)

  return (
    <AdminShell
      title="Tableau de bord administrateur"
      description="Pilotez le contenu éditorial et les campagnes de la fondation depuis une interface centralisée."
    >
      <div className="space-y-6">
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
          <article className="rounded-3xl bg-white p-6 shadow-panel">
            <div className="mb-4 inline-flex rounded-2xl bg-orange-100 p-3 text-orange-600">
              <UserCircle2 className="h-6 w-6" />
            </div>
            <h2 className="font-display text-xl font-semibold text-slate-900">Session active</h2>
            <dl className="mt-4 space-y-3 text-sm text-slate-600">
              <div>
                <dt className="font-medium text-slate-900">Nom</dt>
                <dd>
                  {user?.firstName} {user?.lastName}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-slate-900">Email</dt>
                <dd>{user?.email}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-900">Rôle</dt>
                <dd>{user?.role}</dd>
              </div>
            </dl>
          </article>

          <article className="rounded-3xl bg-white p-6 shadow-panel">
            <div className="mb-4 inline-flex rounded-2xl bg-orange-100 p-3 text-orange-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h2 className="font-display text-xl font-semibold text-slate-900">Permissions actives</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {permissions.length > 0 ? (
                permissions.map((permission) => (
                  <span
                    key={permission}
                    className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600"
                  >
                    {permission}
                  </span>
                ))
              ) : (
                <p className="text-sm text-slate-500">Aucune permission spécifique remontée.</p>
              )}
            </div>
          </article>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-panel">
          <div className="mb-6 flex items-center gap-3">
            <FolderKanban className="h-5 w-5 text-orange-500" />
            <div>
              <h2 className="font-display text-2xl font-semibold text-slate-900">Accès rapide</h2>
              <p className="mt-1 text-sm text-slate-500">
                Ouvrez directement les modules de gestion disponibles pour votre profil.
              </p>
            </div>
          </div>

          {quickAccess.length === 0 ? (
            <p className="text-sm leading-6 text-slate-600">
              Votre compte dispose d'un accès au tableau de bord, mais aucun module éditorial n'est encore activé.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {quickAccess.map((item) => {
                const Icon = item.icon

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="rounded-3xl border border-slate-200 p-5 transition hover:border-orange-300 hover:bg-orange-50"
                  >
                    <div className="mb-4 inline-flex rounded-2xl bg-orange-100 p-3 text-orange-600">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                    <span className="mt-4 inline-flex text-sm font-semibold text-orange-600">
                      Ouvrir le module
                    </span>
                  </Link>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </AdminShell>
  )
}

export default AdminDashboardPage
