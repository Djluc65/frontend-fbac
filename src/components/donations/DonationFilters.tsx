import { Filter, RotateCcw, Search } from 'lucide-react'
import Button from '../common/Button'

type Option = {
  label: string
  value: string
}

interface DonationFiltersProps {
  search: string
  status: string
  paymentMethod: string
  proofStatus: string
  onSearchChange: (value: string) => void
  onStatusChange: (value: string) => void
  onPaymentMethodChange: (value: string) => void
  onProofStatusChange: (value: string) => void
  onReset: () => void
  statusOptions: Option[]
  paymentMethodOptions: Option[]
  proofStatusOptions: Option[]
}

const DonationFilters = ({
  search,
  status,
  paymentMethod,
  proofStatus,
  onSearchChange,
  onStatusChange,
  onPaymentMethodChange,
  onProofStatusChange,
  onReset,
  statusOptions,
  paymentMethodOptions,
  proofStatusOptions,
}: DonationFiltersProps) => {
  return (
    <section className="rounded-3xl bg-white p-5 shadow-panel">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-2xl bg-orange-100 p-3 text-orange-600">
          <Filter className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold text-slate-900">Recherche et filtres</h2>
          <p className="mt-1 text-sm text-slate-500">Affinez la liste des dons par référence, statut ou mode de paiement.</p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))_auto]">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Recherche</span>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Référence, donateur, email, transaction"
              className="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Statut</span>
          <select
            value={status}
            onChange={(event) => onStatusChange(event.target.value)}
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
          <span className="text-sm font-medium text-slate-700">Paiement</span>
          <select
            value={paymentMethod}
            onChange={(event) => onPaymentMethodChange(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          >
            {paymentMethodOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Preuve</span>
          <select
            value={proofStatus}
            onChange={(event) => onProofStatusChange(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          >
            {proofStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-end">
          <Button variant="secondary" onClick={onReset} className="w-full lg:w-auto">
            <RotateCcw className="h-4 w-4" />
            Réinitialiser
          </Button>
        </div>
      </div>
    </section>
  )
}

export default DonationFilters
