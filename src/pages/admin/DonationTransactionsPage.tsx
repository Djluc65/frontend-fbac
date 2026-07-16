import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import AdminShell from '../../components/admin/AdminShell'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { useGetTransactionsQuery } from '../../features/donations/donationsAdminApi'

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

  return (
    <AdminShell
      title="Transactions"
      description="Consultez les traces de transactions liées aux dons, y compris les références internes et les statuts des providers."
    >
      <div className="space-y-6">
        <section className="grid gap-4 rounded-3xl bg-white p-5 shadow-panel xl:grid-cols-3">
          <label className="space-y-2 xl:col-span-1">
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
        </section>

        {isLoading && !data ? (
          <section className="rounded-3xl bg-white p-6 shadow-panel">
            <LoadingSpinner className="justify-center py-10" />
          </section>
        ) : (
          <section className="rounded-3xl bg-white p-6 shadow-panel">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
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
                      <td className="px-3 py-4">{transaction.status}</td>
                      <td className="px-3 py-4">{new Date(transaction.createdAt).toLocaleString('fr-FR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </AdminShell>
  )
}

export default DonationTransactionsPage
