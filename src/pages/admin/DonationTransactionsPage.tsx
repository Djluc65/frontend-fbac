import { useMemo, useState } from 'react'
import { ReceiptText, RotateCcw, Search } from 'lucide-react'
import AdminShell from '../../components/admin/AdminShell'
import AdminCard from '../../components/admin/AdminCard'
import AdminFilterPanel from '../../components/admin/AdminFilterPanel'
import AdminStatusBadge from '../../components/admin/AdminStatusBadge'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { useGetTransactionsQuery } from '../../features/donations/donationsAdminApi'

const getTransactionStatusTone = (status: string) => {
  if (status === 'COMPLETED') {
    return 'success' as const
  }

  if (status === 'PENDING' || status === 'UNDER_REVIEW' || status === 'PROCESSING') {
    return 'warning' as const
  }

  if (status === 'REJECTED' || status === 'FAILED' || status === 'REFUNDED' || status === 'CANCELLED') {
    return 'danger' as const
  }

  return 'neutral' as const
}

const transactionStatusLabels: Record<string, string> = {
  DRAFT: 'Brouillon',
  PENDING: 'En attente',
  PROCESSING: 'Traitement',
  UNDER_REVIEW: 'Sous revue',
  COMPLETED: 'Confirmé',
  FAILED: 'Échoué',
  CANCELLED: 'Annulé',
  REFUNDED: 'Remboursé',
  REJECTED: 'Rejeté',
}

const DonationTransactionsPage = () => {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('ALL')
  const [paymentMethod, setPaymentMethod] = useState('ALL')

  const query = useMemo(
    () => ({
      q: search.trim() || undefined,
      status: status === 'ALL' ? undefined : status,
      paymentMethod: paymentMethod === 'ALL' ? undefined : paymentMethod,
      page: 1,
      limit: 20,
    }),
    [paymentMethod, search, status]
  )

  const { data, isLoading } = useGetTransactionsQuery(query)

  const handleReset = () => {
    setSearch('')
    setStatus('ALL')
    setPaymentMethod('ALL')
  }

  return (
    <AdminShell
      title="Transactions"
      description="Consultez les traces de transactions liées aux dons, y compris les références internes et les statuts des providers."
    >
      <div className="space-y-4 sm:space-y-6">
        <AdminFilterPanel
          icon={Search}
          title="Recherche et filtres"
          description="Filtrez les transactions par référence, statut ou moyen de paiement."
        >
          <div className="grid gap-3 sm:gap-4 min-[430px]:grid-cols-2 xl:grid-cols-[minmax(0,1.4fr)_repeat(2,minmax(0,1fr))_auto]">
            <label className="space-y-2 min-[430px]:col-span-2 xl:col-span-1">
              <span className="text-sm font-medium text-slate-700">Recherche</span>
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  placeholder="Référence interne ou provider"
                />
              </div>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Statut</span>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              >
                <option value="ALL">Tous</option>
                <option value="PENDING">En attente</option>
                <option value="UNDER_REVIEW">Sous revue</option>
                <option value="COMPLETED">Confirmé</option>
                <option value="REJECTED">Rejeté</option>
                <option value="REFUNDED">Remboursé</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Moyen de paiement</span>
              <select
                value={paymentMethod}
                onChange={(event) => setPaymentMethod(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              >
                <option value="ALL">Tous</option>
                <option value="PAYPAL">PayPal</option>
                <option value="BANK_TRANSFER">Virement bancaire</option>
                <option value="ZELLE">Zelle</option>
                <option value="CASH_APP">Cash App</option>
              </select>
            </label>

            <div className="flex items-end min-[430px]:col-span-2 xl:col-span-1">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700 xl:w-auto"
              >
                <RotateCcw className="h-4 w-4" />
                Réinitialiser
              </button>
            </div>
          </div>
        </AdminFilterPanel>

        <AdminCard
          icon={ReceiptText}
          title="Résultats"
          description={`${data?.items.length ?? 0} transaction(s) affichée(s)`}
        />

        {isLoading && !data ? (
          <section className="rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-panel">
            <LoadingSpinner className="justify-center py-10" />
          </section>
        ) : (
          <section className="rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-panel sm:p-5">
            {(data?.items ?? []).length === 0 ? (
              <div className="rounded-[20px] border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center text-sm leading-6 text-slate-500">
                Aucune transaction ne correspond aux filtres sélectionnés.
              </div>
            ) : (
              <>
            <div className="overflow-x-auto">
              <table className="hidden min-w-full text-left text-sm lg:table">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="px-3 py-3 font-semibold">Provider</th>
                    <th className="px-3 py-3 font-semibold">Référence interne</th>
                    <th className="px-3 py-3 font-semibold">Donateur</th>
                    <th className="px-3 py-3 font-semibold">Montant</th>
                    <th className="px-3 py-3 font-semibold">Statut</th>
                    <th className="px-3 py-3 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.items ?? []).map((transaction) => (
                    <tr key={transaction._id} className="border-b border-slate-100 text-slate-700 last:border-0">
                      <td className="px-3 py-4">{transaction.provider}</td>
                      <td className="px-3 py-4">{transaction.internalReference}</td>
                      <td className="px-3 py-4">
                        {transaction.donation
                          ? `${transaction.donation.donorFirstName} ${transaction.donation.donorLastName}`
                          : 'Donateur inconnu'}
                      </td>
                      <td className="px-3 py-4">
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: transaction.currency,
                        }).format(transaction.amount)}
                      </td>
                      <td className="px-3 py-4">
                        <AdminStatusBadge
                          label={transactionStatusLabels[transaction.status] ?? transaction.status}
                          tone={getTransactionStatusTone(transaction.status)}
                        />
                      </td>
                      <td className="px-3 py-4">{new Date(transaction.createdAt).toLocaleString('fr-FR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="space-y-4 lg:hidden">
              {(data?.items ?? []).map((transaction) => (
                <article
                  key={transaction._id}
                  className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4 transition duration-200 hover:border-orange-200 hover:bg-orange-50/70"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        {transaction.provider}
                      </p>
                      <p className="mt-1 break-words text-base font-semibold text-slate-900">
                        {transaction.internalReference}
                      </p>
                    </div>
                    <AdminStatusBadge
                      label={transactionStatusLabels[transaction.status] ?? transaction.status}
                      tone={getTransactionStatusTone(transaction.status)}
                    />
                  </div>

                  <dl className="mt-4 grid gap-3 text-sm text-slate-600 min-[430px]:grid-cols-2">
                    <div className="rounded-2xl bg-white px-4 py-3">
                      <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Donateur</dt>
                      <dd className="mt-1 break-words">
                        {transaction.donation
                          ? `${transaction.donation.donorFirstName} ${transaction.donation.donorLastName}`
                          : 'Donateur inconnu'}
                      </dd>
                    </div>
                    <div className="rounded-2xl bg-white px-4 py-3">
                      <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Montant</dt>
                      <dd className="mt-1">
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: transaction.currency,
                        }).format(transaction.amount)}
                      </dd>
                    </div>
                    <div className="rounded-2xl bg-white px-4 py-3">
                      <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Date</dt>
                      <dd className="mt-1">{new Date(transaction.createdAt).toLocaleString('fr-FR')}</dd>
                    </div>
                    <div className="rounded-2xl bg-white px-4 py-3">
                      <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Provider</dt>
                      <dd className="mt-1 break-words">{transaction.provider}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
              </>
            )}
          </section>
        )}
      </div>
    </AdminShell>
  )
}

export default DonationTransactionsPage
