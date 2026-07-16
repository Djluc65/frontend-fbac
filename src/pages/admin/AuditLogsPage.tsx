import { useMemo, useState } from 'react'
import { History, Search } from 'lucide-react'
import AdminShell from '../../components/admin/AdminShell'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { useGetAuditLogsQuery } from '../../features/donations/donationsAdminApi'

const AuditLogsPage = () => {
  const [search, setSearch] = useState('')
  const [action, setAction] = useState('ALL')

  const query = useMemo(
    () => ({
      q: search.trim() || undefined,
      action: action === 'ALL' ? undefined : action,
      page: 1,
      limit: 25,
    }),
    [action, search]
  )

  const { data, isLoading } = useGetAuditLogsQuery(query)

  return (
    <AdminShell
      title="Journal d’audit"
      description="Suivez l’historique des validations, rejets et changements de statut exécutés dans le module de dons."
    >
      <div className="space-y-6">
        <section className="grid gap-4 rounded-3xl bg-white p-5 shadow-panel xl:grid-cols-[minmax(0,1fr)_260px]">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Recherche</span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                placeholder="Référence de don, transaction ou email"
              />
            </div>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Action</span>
            <select
              value={action}
              onChange={(event) => setAction(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            >
              <option value="ALL">Toutes</option>
              <option value="MANUAL_PAYMENT_SUBMITTED">Soumission</option>
              <option value="PAYMENT_PROOF_APPROVED">Approbation</option>
              <option value="PAYMENT_PROOF_REJECTED">Rejet</option>
            </select>
          </label>
        </section>

        {isLoading && !data ? (
          <section className="rounded-3xl bg-white p-6 shadow-panel">
            <LoadingSpinner className="justify-center py-10" />
          </section>
        ) : (
          <section className="space-y-4">
            {(data?.items ?? []).map((item) => (
              <article key={item._id} className="rounded-3xl bg-white p-5 shadow-panel">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl bg-orange-100 p-3 text-orange-600">
                      <History className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-slate-900">{item.action}</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {item.donationReference} | {item.paymentMethod}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-slate-500">
                    {new Date(item.createdAt).toLocaleString('fr-FR')}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-2 xl:grid-cols-4">
                  <p>
                    <span className="font-medium text-slate-900">Acteur:</span>{' '}
                    {item.actorUser && typeof item.actorUser === 'object'
                      ? `${item.actorUser.firstName ?? ''} ${item.actorUser.lastName ?? ''}`.trim() ||
                        item.actorUser.email ||
                        'Administrateur'
                      : item.actorEmail || 'Système'}
                  </p>
                  <p>
                    <span className="font-medium text-slate-900">Statut don:</span> {item.previousDonationStatus} vers{' '}
                    {item.newDonationStatus}
                  </p>
                  <p>
                    <span className="font-medium text-slate-900">Statut preuve:</span> {item.previousProofStatus} vers{' '}
                    {item.newProofStatus}
                  </p>
                  <p>
                    <span className="font-medium text-slate-900">IP:</span> {item.actorIp || 'Non disponible'}
                  </p>
                </div>

                {item.note ? <p className="mt-3 text-sm text-slate-600">{item.note}</p> : null}
              </article>
            ))}
          </section>
        )}
      </div>
    </AdminShell>
  )
}

export default AuditLogsPage
