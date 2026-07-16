import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, ListFilter } from 'lucide-react'
import AdminShell from '../../components/admin/AdminShell'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import DonationFilters from '../../components/donations/DonationFilters'
import DonationTable from '../../components/donations/DonationTable'
import { useGetAdminDonationsQuery } from '../../features/donations/donationsAdminApi'
import type {
  BackendDonationPaymentMethod,
  DonationAdminFilters,
  DonationProofStatus,
  DonationStatus,
} from '../../features/donations/donationTypes'

const DonationsPage = () => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('ALL')
  const [paymentMethod, setPaymentMethod] = useState('ALL')
  const [proofStatus, setProofStatus] = useState('ALL')

  const query = useMemo<DonationAdminFilters>(
    () => ({
      page,
      limit: 12,
      q: search.trim() || undefined,
      status: status === 'ALL' ? undefined : (status as DonationStatus),
      paymentMethod: paymentMethod === 'ALL' ? undefined : (paymentMethod as BackendDonationPaymentMethod),
      proofStatus: proofStatus === 'ALL' ? undefined : (proofStatus as DonationProofStatus),
      sortBy: 'createdAt' as const,
      sortOrder: 'desc' as const,
    }),
    [page, paymentMethod, proofStatus, search, status]
  )

  const { data, isLoading, isFetching } = useGetAdminDonationsQuery(query)

  const handleReset = () => {
    setPage(1)
    setSearch('')
    setStatus('ALL')
    setPaymentMethod('ALL')
    setProofStatus('ALL')
  }

  return (
    <AdminShell
      title="Tous les dons"
      description="Consultez la liste administrative des dons avec recherche, filtres et accès rapide à la fiche détaillée."
    >
      <div className="space-y-6">
        <DonationFilters
          search={search}
          status={status}
          paymentMethod={paymentMethod}
          proofStatus={proofStatus}
          onSearchChange={(value) => {
            setPage(1)
            setSearch(value)
          }}
          onStatusChange={(value) => {
            setPage(1)
            setStatus(value)
          }}
          onPaymentMethodChange={(value) => {
            setPage(1)
            setPaymentMethod(value)
          }}
          onProofStatusChange={(value) => {
            setPage(1)
            setProofStatus(value)
          }}
          onReset={handleReset}
          statusOptions={[
            { label: 'Tous', value: 'ALL' },
            { label: 'En attente', value: 'PENDING' },
            { label: 'Sous revue', value: 'UNDER_REVIEW' },
            { label: 'Confirmés', value: 'COMPLETED' },
            { label: 'Rejetés', value: 'REJECTED' },
            { label: 'Remboursés', value: 'REFUNDED' },
          ]}
          paymentMethodOptions={[
            { label: 'Toutes', value: 'ALL' },
            { label: 'PayPal', value: 'PAYPAL' },
            { label: 'Virement bancaire', value: 'BANK_TRANSFER' },
            { label: 'Zelle', value: 'ZELLE' },
            { label: 'Cash App', value: 'CASH_APP' },
            { label: 'Sur place', value: 'ON_SITE' },
          ]}
          proofStatusOptions={[
            { label: 'Toutes', value: 'ALL' },
            { label: 'À vérifier', value: 'PENDING_REVIEW' },
            { label: 'Approuvée', value: 'APPROVED' },
            { label: 'Rejetée', value: 'REJECTED' },
            { label: 'Non envoyée', value: 'NOT_UPLOADED' },
          ]}
        />

        <section className="rounded-3xl bg-white p-5 shadow-panel">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-orange-100 p-3 text-orange-600">
                <ListFilter className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold text-slate-900">Résultats</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {data?.pagination.total ?? 0} don(s) trouvé(s){isFetching ? ' - actualisation...' : ''}
                </p>
              </div>
            </div>
          </div>
        </section>

        {isLoading && !data ? (
          <section className="rounded-3xl bg-white p-6 shadow-panel">
            <LoadingSpinner className="justify-center py-10" />
          </section>
        ) : (
          <>
            <DonationTable donations={data?.items ?? []} />

            <section className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white p-5 shadow-panel">
              <p className="text-sm text-slate-500">
                Page {data?.pagination.page ?? page} sur {data?.pagination.totalPages ?? 1}
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page <= 1}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Précédent
                </button>
                <button
                  type="button"
                  onClick={() => setPage((current) => current + 1)}
                  disabled={page >= (data?.pagination.totalPages ?? 1)}
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Suivant
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </section>
          </>
        )}
      </div>
    </AdminShell>
  )
}

export default DonationsPage
