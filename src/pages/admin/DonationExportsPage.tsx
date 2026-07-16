import { useState } from 'react'
import { CheckCircle2, Download, FileSpreadsheet, Filter, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import AdminShell from '../../components/admin/AdminShell'
import Button from '../../components/common/Button'
import { useAppSelector } from '../../app/hooks'
import { selectAccessToken } from '../../features/auth/authSelectors'
import type {
  BackendDonationPaymentMethod,
  DonationCurrency,
  DonationProofStatus,
  DonationStatus,
} from '../../features/donations/donationTypes'

const getApiBaseUrl = () => import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

const extractFileName = (contentDisposition: string | null) => {
  if (!contentDisposition) {
    return 'dons-export.xls'
  }

  const match = contentDisposition.match(/filename="?(.*?)"?$/i)
  return match?.[1] || 'dons-export.xls'
}

const statusOptions: Array<{ value: '' | DonationStatus; label: string }> = [
  { value: '', label: 'Tous les statuts' },
  { value: 'PENDING', label: 'En attente' },
  { value: 'UNDER_REVIEW', label: 'Sous revue' },
  { value: 'COMPLETED', label: 'Confirmés' },
  { value: 'REJECTED', label: 'Rejetés' },
  { value: 'REFUNDED', label: 'Remboursés' },
]

const paymentMethodOptions: Array<{ value: '' | BackendDonationPaymentMethod; label: string }> = [
  { value: '', label: 'Toutes les méthodes' },
  { value: 'PAYPAL', label: 'PayPal' },
  { value: 'BANK_TRANSFER', label: 'Virement bancaire' },
  { value: 'ZELLE', label: 'Zelle' },
  { value: 'CASH_APP', label: 'Cash App' },
  { value: 'ON_SITE', label: 'Sur place' },
  { value: 'CARD', label: 'Carte' },
]

const proofStatusOptions: Array<{ value: '' | DonationProofStatus; label: string }> = [
  { value: '', label: 'Tous les statuts de preuve' },
  { value: 'NOT_REQUIRED', label: 'Non requise' },
  { value: 'NOT_UPLOADED', label: 'Non envoyée' },
  { value: 'PENDING_REVIEW', label: 'À vérifier' },
  { value: 'APPROVED', label: 'Approuvée' },
  { value: 'REJECTED', label: 'Rejetée' },
]

const currencyOptions: Array<{ value: '' | DonationCurrency; label: string }> = [
  { value: '', label: 'Toutes les devises' },
  { value: 'USD', label: 'USD' },
  { value: 'HTG', label: 'HTG' },
  { value: 'CAD', label: 'CAD' },
  { value: 'EUR', label: 'EUR' },
]

const DonationExportsPage = () => {
  const accessToken = useAppSelector(selectAccessToken)
  const [isDownloading, setIsDownloading] = useState(false)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'' | DonationStatus>('')
  const [paymentMethod, setPaymentMethod] = useState<'' | BackendDonationPaymentMethod>('')
  const [proofStatus, setProofStatus] = useState<'' | DonationProofStatus>('')
  const [currency, setCurrency] = useState<'' | DonationCurrency>('')
  const [anonymous, setAnonymous] = useState<'all' | 'true' | 'false'>('all')

  const handleExportDonations = async () => {
    try {
      setIsDownloading(true)
      const queryParams = new URLSearchParams()

      if (search.trim()) {
        queryParams.set('q', search.trim())
      }

      if (status) {
        queryParams.set('status', status)
      }

      if (paymentMethod) {
        queryParams.set('paymentMethod', paymentMethod)
      }

      if (proofStatus) {
        queryParams.set('proofStatus', proofStatus)
      }

      if (currency) {
        queryParams.set('currency', currency)
      }

      if (anonymous !== 'all') {
        queryParams.set('anonymous', anonymous)
      }

      queryParams.set('sortBy', 'createdAt')
      queryParams.set('sortOrder', 'desc')

      const response = await fetch(`${getApiBaseUrl()}/admin/donations/export?${queryParams.toString()}`, {
        method: 'GET',
        credentials: 'include',
        headers: accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : undefined,
      })

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null
        throw new Error(payload?.message || "Impossible d'exporter les dons pour le moment.")
      }

      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const fileName = extractFileName(response.headers.get('content-disposition'))
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(downloadUrl)

      toast.success('Le fichier Excel des dons a été téléchargé.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Impossible d'exporter les dons.")
    } finally {
      setIsDownloading(false)
    }
  }

  const resetFilters = () => {
    setSearch('')
    setStatus('')
    setPaymentMethod('')
    setProofStatus('')
    setCurrency('')
    setAnonymous('all')
  }

  return (
    <AdminShell
      title="Exports"
      description="Téléchargez les données clés de collecte. Le premier export disponible génère la liste des dons dans un format compatible Excel."
    >
      <div className="space-y-6">
        <section className="rounded-3xl bg-white p-6 shadow-panel">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-orange-100 p-3 text-orange-600">
                <Download className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold text-slate-900">Exporter les dons</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  Téléchargez un fichier Excel contenant la liste complète des dons avec les informations donateur,
                  campagne, montant, statut, preuve et référence de transaction.
                </p>
              </div>
            </div>

            <Button onClick={handleExportDonations} isLoading={isDownloading}>
              <FileSpreadsheet className="h-4 w-4" />
              Exporter les dons Excel
            </Button>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-panel">
          <div className="mb-5 flex items-start gap-4">
            <div className="rounded-2xl bg-orange-100 p-3 text-orange-600">
              <Filter className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-slate-900">Filtres d’export</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Le fichier téléchargé respectera exactement les filtres définis ci-dessous.
              </p>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            <label className="space-y-2 xl:col-span-3">
              <span className="text-sm font-medium text-slate-700">Recherche</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Référence, donateur, email, transaction, programme"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Statut</span>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as '' | DonationStatus)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              >
                {statusOptions.map((option) => (
                  <option key={option.label} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Paiement</span>
              <select
                value={paymentMethod}
                onChange={(event) => setPaymentMethod(event.target.value as '' | BackendDonationPaymentMethod)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              >
                {paymentMethodOptions.map((option) => (
                  <option key={option.label} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Preuve</span>
              <select
                value={proofStatus}
                onChange={(event) => setProofStatus(event.target.value as '' | DonationProofStatus)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              >
                {proofStatusOptions.map((option) => (
                  <option key={option.label} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Devise</span>
              <select
                value={currency}
                onChange={(event) => setCurrency(event.target.value as '' | DonationCurrency)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              >
                {currencyOptions.map((option) => (
                  <option key={option.label} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Anonymat</span>
              <select
                value={anonymous}
                onChange={(event) => setAnonymous(event.target.value as 'all' | 'true' | 'false')}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              >
                <option value="all">Tous</option>
                <option value="true">Anonymes</option>
                <option value="false">Identifiés</option>
              </select>
            </label>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
            <p className="text-sm text-slate-500">
              Les filtres sélectionnés seront appliqués au fichier téléchargé.
            </p>
            <Button variant="secondary" onClick={resetFilters}>
              <RotateCcw className="h-4 w-4" />
              Réinitialiser les filtres
            </Button>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <article className="rounded-3xl bg-white p-6 shadow-panel">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-slate-900">Contenu du fichier</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Colonnes incluses: référence, date, identité du donateur, email, téléphone, pays, désignation,
                  campagne, programme, montant, devise, méthode de paiement, fréquence, statut, preuve, anonymat,
                  référence de transaction et message.
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-3xl bg-white p-6 shadow-panel">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-orange-100 p-3 text-orange-600">
                <Download className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-slate-900">Format livré</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Le téléchargement produit un fichier Excel `.xls` directement exploitable pour le suivi comptable,
                  le contrôle interne et les analyses rapides.
                </p>
              </div>
            </div>
          </article>
        </section>
      </div>
    </AdminShell>
  )
}

export default DonationExportsPage
