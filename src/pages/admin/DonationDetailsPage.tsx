import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft, Clock3, Save } from 'lucide-react'
import AdminShell from '../../components/admin/AdminShell'
import Button from '../../components/common/Button'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import DonationDetailsPanel from '../../components/donations/DonationDetailsPanel'
import PaymentProofViewer from '../../components/donations/PaymentProofViewer'
import { useGetAdminDonationByIdQuery } from '../../features/donations/donationsAdminApi'
import { useUpdateAdminDonationStatusMutation } from '../../features/payments/paymentApi'
import type { DonationStatus } from '../../features/donations/donationTypes'

const statusOptions: Array<{ value: DonationStatus; label: string }> = [
  { value: 'PENDING', label: 'En attente' },
  { value: 'PROCESSING', label: 'Traitement' },
  { value: 'UNDER_REVIEW', label: 'Sous revue' },
  { value: 'COMPLETED', label: 'Confirmé' },
  { value: 'REJECTED', label: 'Rejeté' },
  { value: 'REFUNDED', label: 'Remboursé' },
  { value: 'CANCELLED', label: 'Annulé' },
]

const getApiErrorMessage = (error: unknown) => {
  if (!error || typeof error !== 'object') {
    return 'Impossible de traiter la demande.'
  }

  if ('data' in error && error.data && typeof error.data === 'object' && 'message' in error.data) {
    return String(error.data.message)
  }

  if ('message' in error && typeof error.message === 'string') {
    return error.message
  }

  return 'Une erreur est survenue.'
}

const DonationDetailsPage = () => {
  const { id = '' } = useParams()
  const { data, isLoading } = useGetAdminDonationByIdQuery(id, { skip: !id })
  const [updateStatus, { isLoading: isSaving }] = useUpdateAdminDonationStatusMutation()
  const [nextStatus, setNextStatus] = useState<DonationStatus>('PENDING')
  const [reviewNote, setReviewNote] = useState('')

  const handleStatusUpdate = async () => {
    if (!data) {
      return
    }

    try {
      await updateStatus({
        donationId: data.donation._id,
        status: nextStatus,
        reviewNote: reviewNote.trim() || undefined,
      }).unwrap()
      toast.success('Le statut du don a été mis à jour.')
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    }
  }

  return (
    <AdminShell
      title="Détail d’un don"
      description="Consultez la fiche complète, la preuve associée, l’historique de revue et les transactions générées."
      actions={
        <Link
          to="/admin/donations"
          className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la liste
        </Link>
      }
    >
      {isLoading || !data ? (
        <section className="rounded-3xl bg-white p-6 shadow-panel">
          <LoadingSpinner className="justify-center py-10" />
        </section>
      ) : (
        <div className="space-y-6">
          <DonationDetailsPanel detail={data} />
          <PaymentProofViewer proof={data.paymentProof} />

          <section className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
            <article className="rounded-3xl bg-white p-6 shadow-panel">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-orange-100 p-3 text-orange-600">
                  <Save className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-slate-900">Traitement administratif</h3>
                  <p className="mt-1 text-sm text-slate-500">Ajustez le statut lorsque la revue métier est terminée.</p>
                </div>
              </div>

              <div className="mt-4 space-y-4">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Nouveau statut</span>
                  <select
                    value={nextStatus}
                    onChange={(event) => setNextStatus(event.target.value as DonationStatus)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Note interne</span>
                  <textarea
                    value={reviewNote}
                    onChange={(event) => setReviewNote(event.target.value)}
                    rows={5}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    placeholder="Ajoutez un commentaire administratif si nécessaire."
                  />
                </label>

                <Button onClick={handleStatusUpdate} isLoading={isSaving}>
                  <Save className="h-4 w-4" />
                  Enregistrer
                </Button>
              </div>
            </article>

            <article className="rounded-3xl bg-white p-6 shadow-panel">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-orange-100 p-3 text-orange-600">
                  <Clock3 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-slate-900">Historique de revue</h3>
                  <p className="mt-1 text-sm text-slate-500">Chaque événement lié à la preuve de paiement est tracé ici.</p>
                </div>
              </div>

              <div className="mt-4 space-y-4">
                {data.history.length === 0 ? (
                  <p className="text-sm text-slate-500">Aucun événement d’audit n’a encore été enregistré.</p>
                ) : (
                  data.history.map((event) => (
                    <article key={event._id} className="rounded-2xl border border-slate-200 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold text-slate-900">{event.action}</p>
                        <span className="text-xs font-medium text-slate-500">
                          {new Date(event.createdAt).toLocaleString('fr-FR')}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">
                        {event.actorUser && typeof event.actorUser === 'object'
                          ? `${event.actorUser.firstName ?? ''} ${event.actorUser.lastName ?? ''}`.trim() ||
                            event.actorUser.email ||
                            'Administrateur'
                          : event.actorEmail || 'Système'}
                      </p>
                      <p className="mt-2 text-sm text-slate-500">
                        Don: {event.previousDonationStatus} vers {event.newDonationStatus} | Preuve:{' '}
                        {event.previousProofStatus} vers {event.newProofStatus}
                      </p>
                      {event.note ? <p className="mt-2 text-sm text-slate-600">{event.note}</p> : null}
                    </article>
                  ))
                )}
              </div>
            </article>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-panel">
            <h3 className="font-display text-xl font-semibold text-slate-900">Transactions</h3>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="px-3 py-3 font-semibold">Provider</th>
                    <th className="px-3 py-3 font-semibold">Référence interne</th>
                    <th className="px-3 py-3 font-semibold">Montant</th>
                    <th className="px-3 py-3 font-semibold">Statut</th>
                    <th className="px-3 py-3 font-semibold">Provider status</th>
                    <th className="px-3 py-3 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.transactions.map((transaction) => (
                    <tr key={transaction._id} className="border-b border-slate-100 text-slate-700 last:border-0">
                      <td className="px-3 py-4">{transaction.provider}</td>
                      <td className="px-3 py-4">{transaction.internalReference}</td>
                      <td className="px-3 py-4">
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: transaction.currency,
                        }).format(transaction.amount)}
                      </td>
                      <td className="px-3 py-4">{transaction.status}</td>
                      <td className="px-3 py-4">{transaction.providerStatus || '-'}</td>
                      <td className="px-3 py-4">{new Date(transaction.createdAt).toLocaleString('fr-FR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </AdminShell>
  )
}

export default DonationDetailsPage
