import { Filter, RotateCcw, Search } from 'lucide-react'
import Button from '../common/Button'
import AdminFilterPanel from '../admin/AdminFilterPanel'

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
    <AdminFilterPanel
      icon={Filter}
      title="Recherche et filtres"
      description="Affinez la liste des dons par référence, statut, preuve ou mode de paiement."
    >
      <div className="grid gap-3 sm:gap-4 min-[430px]:grid-cols-2 xl:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))_auto]">
        <label className="space-y-2 min-[430px]:col-span-2 xl:col-span-1">
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

        <div className="flex items-end min-[430px]:col-span-2 xl:col-span-1">
          <Button variant="secondary" onClick={onReset} className="h-11 w-full xl:w-auto">
            <RotateCcw className="h-4 w-4" />
            Réinitialiser
          </Button>
        </div>
      </div>
    </AdminFilterPanel>
  )
}

export default DonationFilters
