import {
  Building2,
  CreditCard,
  Landmark,
  type LucideIcon,
  WalletCards,
} from 'lucide-react'
import type { PaymentMethodId, PaymentMethodOption } from '../../features/payments/paymentTypes'

interface PaymentMethodCardProps {
  method: PaymentMethodOption
  selected: boolean
  onSelect: (methodId: PaymentMethodId) => void
}

const iconByMethod: Record<PaymentMethodId, LucideIcon> = {
  PAYPAL: WalletCards,
  CARD: CreditCard,
  BANK_TRANSFER: Landmark,
  ZELLE: Building2,
  CASH_APP: CreditCard,
  ON_SITE: Building2,
}

const PaymentMethodCard = ({ method, selected, onSelect }: PaymentMethodCardProps) => {
  const Icon = iconByMethod[method.id]
  const disabled = !method.enabled

  return (
    <button
      type="button"
      onClick={() => {
        if (!disabled) {
          onSelect(method.id)
        }
      }}
      disabled={disabled}
      aria-pressed={selected}
      className={`group relative rounded-3xl border bg-white p-5 text-left shadow-sm transition-all duration-200 ${
        selected
          ? 'border-orange-500 ring-2 ring-orange-200'
          : 'border-slate-200 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md'
      } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${method.brandAccent} text-white shadow-sm`}
          aria-hidden="true"
        >
          <Icon className="h-5 w-5" />
        </div>

        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            method.enabled ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'
          }`}
        >
          {method.badgeLabel}
        </span>
      </div>

      <div className="mt-5 flex items-start gap-3">
        <input
          type="radio"
          checked={selected}
          readOnly
          aria-label={`Choisir ${method.name}`}
          className="mt-1 h-4 w-4 border-slate-300 text-orange-500 focus:ring-orange-500"
        />
        <div className="min-w-0">
          <h3 className="font-display text-lg font-semibold text-soft-black">{method.name}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{method.description}</p>
          {method.id === 'CARD' ? (
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Visa • Mastercard
            </p>
          ) : null}
          {method.id === 'ZELLE' ? (
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-violet-600">Zelle</p>
          ) : null}
          {method.id === 'CASH_APP' ? (
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">Cash App</p>
          ) : null}
        </div>
      </div>
    </button>
  )
}

export default PaymentMethodCard
