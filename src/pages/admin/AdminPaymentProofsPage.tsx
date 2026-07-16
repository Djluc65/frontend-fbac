import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  BadgeCheck,
  Download,
  Eye,
  FileSearch,
  Filter,
  ImageIcon,
  LoaderCircle,
  SearchCheck,
} from 'lucide-react'
import { toast } from 'sonner'
import AdminShell from '../../components/admin/AdminShell'
import Button from '../../components/common/Button'
import { useAppSelector } from '../../app/hooks'
import { selectCurrentUser } from '../../features/auth/authSelectors'
import {
  useApproveAdminPaymentProofMutation,
  useGetAdminPaymentProofsQuery,
  useRejectAdminPaymentProofMutation,
} from '../../features/payments/paymentApi'
import type { PaymentMethodId, PaymentProofRecord } from '../../features/payments/paymentTypes'

const hasPaymentAccess = (permissions: string[] | undefined) =>
  Boolean(
    permissions?.includes('*') ||
      permissions?.includes('donations.manage') ||
      permissions?.includes('donations.read')
  )

const getApiErrorMessage = (error: unknown) => {
  if (!error || typeof error !== 'object') {
    return 'Une erreur est survenue.'
  }

  if ('data' in error && error.data && typeof error.data === 'object' && 'message' in error.data) {
    return String(error.data.message)
  }

  if ('message' in error && typeof error.message === 'string') {
    return error.message
  }

  return 'Impossible de traiter la demande.'
}

const proofStatusLabels: Record<PaymentProofRecord['status'], string> = {
  NOT_REQUIRED: 'Non requise',
  NOT_UPLOADED: 'Non envoyée',
  PENDING_REVIEW: 'À vérifier',
  APPROVED: 'Approuvée',
  REJECTED: 'Rejetée',
}

const paymentMethodLabels: Record<PaymentMethodId, string> = {
  PAYPAL: 'PayPal',
  CARD: 'Carte bancaire',
  BANK_TRANSFER: 'Virement bancaire',
  ZELLE: 'Zelle',
  CASH_APP: 'Cash App',
  ON_SITE: 'Paiement sur place',
}

const extractDonationField = (proof: PaymentProofRecord | null, field: string) => {
  if (!proof || !proof.donation || typeof proof.donation !== 'object') {
    return undefined
  }

  return proof.donation[field as keyof typeof proof.donation]
}

const buildDonorDisplayName = (proof: PaymentProofRecord | null) => {
  const firstName = extractDonationField(proof, 'donorFirstName')
  const lastName = extractDonationField(proof, 'donorLastName')
  return [firstName, lastName].filter(Boolean).join(' ') || 'Donateur inconnu'
}

const formatFileSize = (size: number) => `${(size / (1024 * 1024)).toFixed(size >= 1024 * 1024 ? 2 : 1)} Mo`

const AdminPaymentProofsPage = () => {
  const user = useAppSelector(selectCurrentUser)
  const permissions = user?.permissions
  const canManagePayments = hasPaymentAccess(permissions)
  const [statusFilter, setStatusFilter] = useState<string>('PENDING_REVIEW')
  const [methodFilter, setMethodFilter] = useState<string>('ALL')
  const [selectedProofId, setSelectedProofId] = useState<string | null>(null)
  const [approvalNote, setApprovalNote] = useState('')
  const [rejectReason, setRejectReason] = useState('')

  const queryArgs = canManagePayments
    ? {
        page: 1,
        limit: 50,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        paymentMethod: methodFilter === 'ALL' ? undefined : methodFilter,
      }
    : undefined

  const { data, isLoading, isFetching } = useGetAdminPaymentProofsQuery(queryArgs, {
    skip: !canManagePayments,
  })
  const [approvePaymentProof, { isLoading: isApproving }] = useApproveAdminPaymentProofMutation()
  const [rejectPaymentProof, { isLoading: isRejecting }] = useRejectAdminPaymentProofMutation()

  const proofs = data?.items ?? []
  const selectedProof = useMemo(
    () => proofs.find((proof) => proof._id === selectedProofId) ?? proofs[0] ?? null,
    [proofs, selectedProofId]
  )

  useEffect(() => {
    if (!selectedProofId && proofs.length > 0) {
      setSelectedProofId(proofs[0]._id)
    }
  }, [selectedProofId, proofs])

  useEffect(() => {
    if (selectedProof && selectedProof.status !== 'PENDING_REVIEW') {
      setApprovalNote(selectedProof.reviewNote ?? '')
      setRejectReason(selectedProof.reviewNote ?? '')
    } else {
      setApprovalNote('')
      setRejectReason('')
    }
  }, [selectedProof])

  const pendingCount = proofs.filter((proof) => proof.status === 'PENDING_REVIEW').length

  const handleApprove = async () => {
    if (!selectedProof) {
      return
    }

    try {
      await approvePaymentProof({
        proofId: selectedProof._id,
        reviewNote: approvalNote.trim() || undefined,
      }).unwrap()
      toast.success('Le paiement manuel a été approuvé.')
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    }
  }

  const handleReject = async () => {
    if (!selectedProof) {
      return
    }

    if (!rejectReason.trim()) {
      toast.error('La raison du rejet est obligatoire.')
      return
    }

    try {
      await rejectPaymentProof({
        proofId: selectedProof._id,
        reason: rejectReason.trim(),
      }).unwrap()
      toast.success('Le paiement manuel a été rejeté.')
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    }
  }

  if (!canManagePayments) {
    return (
      <AdminShell
        title="Paiements à vérifier"
        description="Cette zone est réservée aux administrateurs et responsables financiers."
      >
        <section className="rounded-3xl bg-white p-6 shadow-panel">
          <p className="text-sm text-slate-600">
            Votre compte ne dispose pas des permissions nécessaires pour consulter les paiements à vérifier.
          </p>
        </section>
      </AdminShell>
    )
  }

  return (
    <AdminShell
      title="Paiements à vérifier"
      description="Vérifiez les références de transaction et les preuves transmises pour les virements, paiements Zelle et Cash App avant confirmation."
    >
      <div className="space-y-6">
        <section className="grid gap-4 xl:grid-cols-3">
          <article className="rounded-3xl bg-white p-5 shadow-panel">
            <div className="mb-3 inline-flex rounded-2xl bg-orange-100 p-3 text-orange-600">
              <SearchCheck className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-slate-500">En attente de revue</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{pendingCount}</p>
          </article>
          <article className="rounded-3xl bg-white p-5 shadow-panel">
            <div className="mb-3 inline-flex rounded-2xl bg-orange-100 p-3 text-orange-600">
              <BadgeCheck className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-slate-500">Méthodes couvertes</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">3</p>
          </article>
          <article className="rounded-3xl bg-white p-5 shadow-panel">
            <div className="mb-3 inline-flex rounded-2xl bg-orange-100 p-3 text-orange-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-slate-500">Chargement</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{isFetching ? 'En cours' : 'Prêt'}</p>
          </article>
        </section>

        <section className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
          <article className="space-y-4 rounded-3xl bg-white p-5 shadow-panel">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-semibold text-slate-900">File d’attente</h2>
                <p className="mt-1 text-sm text-slate-500">Sélectionnez un paiement pour afficher son détail.</p>
              </div>
              {isLoading ? <LoaderCircle className="h-5 w-5 animate-spin text-orange-500" /> : null}
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <label className="space-y-2">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Filter className="h-4 w-4 text-orange-500" />
                  Statut
                </span>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="ALL">Tous</option>
                  <option value="PENDING_REVIEW">À vérifier</option>
                  <option value="APPROVED">Approuvés</option>
                  <option value="REJECTED">Rejetés</option>
                </select>
              </label>

              <label className="space-y-2">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Filter className="h-4 w-4 text-orange-500" />
                  Méthode
                </span>
                <select
                  value={methodFilter}
                  onChange={(event) => setMethodFilter(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="ALL">Toutes</option>
                  <option value="BANK_TRANSFER">Virement bancaire</option>
                  <option value="ZELLE">Zelle</option>
                  <option value="CASH_APP">Cash App</option>
                </select>
              </label>
            </div>

            {proofs.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                Aucun paiement manuel ne correspond aux filtres sélectionnés.
              </div>
            ) : (
              <div className="space-y-3">
                {proofs.map((proof) => {
                  const donationReference = extractDonationField(proof, 'reference')
                  const amount = extractDonationField(proof, 'amount')
                  const email = extractDonationField(proof, 'donorEmail')
                  const active = selectedProof?._id === proof._id

                  return (
                    <button
                      key={proof._id}
                      type="button"
                      onClick={() => setSelectedProofId(proof._id)}
                      className={`w-full rounded-3xl border p-4 text-left transition ${
                        active ? 'border-orange-300 bg-orange-50' : 'border-slate-200 hover:border-orange-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900">{buildDonorDisplayName(proof)}</p>
                          <p className="mt-1 text-sm text-slate-500">{email ? String(email) : 'Email indisponible'}</p>
                        </div>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-orange-600">
                          {proofStatusLabels[proof.status]}
                        </span>
                      </div>
                      <div className="mt-4 grid gap-2 text-sm text-slate-600">
                        <p>Méthode : {paymentMethodLabels[proof.paymentMethod]}</p>
                        <p>Référence : {proof.referenceProvided ?? 'Non fournie'}</p>
                        <p>Don : {donationReference ? String(donationReference) : 'Inconnu'}</p>
                        <p>Montant : {amount ? `${String(amount)} USD` : 'N/A'}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </article>

          <article className="space-y-6 rounded-3xl bg-white p-5 shadow-panel">
            {!selectedProof ? (
              <div className="rounded-3xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
                Sélectionnez un paiement dans la colonne de gauche pour afficher son détail.
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h2 className="font-display text-2xl font-semibold text-slate-900">Détail du paiement</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Don {String(extractDonationField(selectedProof, 'reference') ?? 'inconnu')} ·{' '}
                      {paymentMethodLabels[selectedProof.paymentMethod]}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={selectedProof.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-600"
                    >
                      <Eye className="h-4 w-4" />
                      Ouvrir
                    </a>
                    <a
                      href={selectedProof.fileUrl}
                      download={selectedProof.originalFileName}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-600"
                    >
                      <Download className="h-4 w-4" />
                      Télécharger
                    </a>
                  </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 p-5">
                    <h3 className="font-display text-xl font-semibold text-slate-900">Informations du don</h3>
                    <div className="mt-4 grid gap-3 text-sm text-slate-600">
                      <p><span className="font-semibold text-slate-900">Nom :</span> {buildDonorDisplayName(selectedProof)}</p>
                      <p><span className="font-semibold text-slate-900">Email :</span> {String(extractDonationField(selectedProof, 'donorEmail') ?? 'N/A')}</p>
                      <p><span className="font-semibold text-slate-900">Montant :</span> {String(extractDonationField(selectedProof, 'amount') ?? 'N/A')} USD</p>
                      <p><span className="font-semibold text-slate-900">Méthode :</span> {paymentMethodLabels[selectedProof.paymentMethod]}</p>
                      <p><span className="font-semibold text-slate-900">Référence transaction :</span> {selectedProof.referenceProvided ?? 'Non fournie'}</p>
                      <p><span className="font-semibold text-slate-900">Statut preuve :</span> {proofStatusLabels[selectedProof.status]}</p>
                      <p><span className="font-semibold text-slate-900">Date :</span> {new Date(selectedProof.createdAt).toLocaleString('fr-FR')}</p>
                      <p><span className="font-semibold text-slate-900">Fichier :</span> {selectedProof.originalFileName} ({formatFileSize(selectedProof.fileSize)})</p>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 p-5">
                    <h3 className="font-display text-xl font-semibold text-slate-900">Preuve fournie</h3>
                    <div className="mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
                      {selectedProof.mimeType === 'application/pdf' ? (
                        <iframe
                          src={selectedProof.fileUrl}
                          title={`Preuve ${selectedProof.originalFileName}`}
                          className="h-[420px] w-full bg-white"
                        />
                      ) : (
                        <img
                          src={selectedProof.fileUrl}
                          alt={`Preuve ${selectedProof.originalFileName}`}
                          className="max-h-[420px] w-full object-contain bg-white"
                        />
                      )}
                    </div>
                    <p className="mt-3 inline-flex items-center gap-2 text-sm text-slate-500">
                      <ImageIcon className="h-4 w-4 text-orange-500" />
                      Cliquez sur "Ouvrir" pour zoomer dans un nouvel onglet.
                    </p>
                  </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                  <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5">
                    <h3 className="font-display text-xl font-semibold text-slate-900">Approuver</h3>
                    <p className="mt-2 text-sm text-slate-600">
                      Cette action confirme le don, approuve la preuve et marque le paiement comme complété.
                    </p>
                    <textarea
                      value={approvalNote}
                      onChange={(event) => setApprovalNote(event.target.value)}
                      rows={4}
                      className="mt-4 w-full rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Note interne optionnelle de validation"
                    />
                    <Button
                      className="mt-4 bg-emerald-600 hover:bg-emerald-700"
                      onClick={handleApprove}
                      disabled={selectedProof.status !== 'PENDING_REVIEW'}
                      isLoading={isApproving}
                    >
                      <BadgeCheck className="h-4 w-4" />
                      Approuver
                    </Button>
                  </div>

                  <div className="rounded-3xl border border-red-100 bg-red-50 p-5">
                    <h3 className="font-display text-xl font-semibold text-slate-900">Rejeter</h3>
                    <p className="mt-2 text-sm text-slate-600">
                      Une raison est obligatoire. Le donateur pourra envoyer une nouvelle preuve après rejet.
                    </p>
                    <textarea
                      value={rejectReason}
                      onChange={(event) => setRejectReason(event.target.value)}
                      rows={4}
                      className="mt-4 w-full rounded-2xl border border-red-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Expliquez précisément pourquoi la preuve est rejetée"
                    />
                    <Button
                      variant="secondary"
                      className="mt-4 border-red-300 bg-white text-red-700 hover:bg-red-100"
                      onClick={handleReject}
                      disabled={selectedProof.status !== 'PENDING_REVIEW'}
                      isLoading={isRejecting}
                    >
                      <FileSearch className="h-4 w-4" />
                      Rejeter
                    </Button>
                  </div>
                </div>
              </>
            )}
          </article>
        </section>
      </div>
    </AdminShell>
  )
}

export default AdminPaymentProofsPage
