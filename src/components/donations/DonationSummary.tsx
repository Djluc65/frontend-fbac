import { Clock3, HeartHandshake, Landmark, WalletCards } from 'lucide-react'
import type { Campaign } from '../../features/campaigns/campaignTypes'
import type { DonationFrequency, DonationType } from '../../features/donations/donationTypes'
import type { PaymentMethodId } from '../../features/payments/paymentTypes'

interface DonationSummaryProps {
  donationType: DonationType
  amount: number
  frequency: DonationFrequency
  paymentMethod: PaymentMethodId | null
  selectedProgram?: string
  selectedCampaign?: Campaign | null
}

const donationTypeLabels: Record<DonationType, string> = {
  general: 'Don général',
  program: 'Programme',
  campaign: 'Campagne',
}

const frequencyLabels: Record<DonationFrequency, string> = {
  one_time: 'Don unique',
  monthly: 'Mensuel',
  weekly: 'Hebdomadaire',
  yearly: 'Annuel',
}

const paymentLabels: Record<PaymentMethodId, string> = {
  PAYPAL: 'PayPal',
  CARD: 'Carte bancaire',
  BANK_TRANSFER: 'Virement bancaire',
  ZELLE: 'Zelle',
  CASH_APP: 'Cash App',
  ON_SITE: 'Paiement sur place',
}

const DonationSummary = ({
  donationType,
  amount,
  frequency,
  paymentMethod,
  selectedProgram,
  selectedCampaign,
}: DonationSummaryProps) => {
  const progress = selectedCampaign
    ? Math.min(100, Math.round((selectedCampaign.raisedAmount / Math.max(selectedCampaign.goalAmount, 1)) * 100))
    : 0

  return (
    <aside className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-orange-100">
      <h2 className="font-display text-xl font-bold text-soft-black">Résumé du don</h2>

      <div className="mt-5 space-y-4 text-sm text-slate-600">
        <div className="rounded-3xl bg-gradient-to-br from-orange-500 to-orange-600 p-5 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-100">Montant</p>
          <p className="mt-2 text-3xl font-bold">{amount} USD</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-medium">
            <Clock3 className="h-4 w-4" aria-hidden="true" />
            {frequencyLabels[frequency]}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-soft-black">
              <HeartHandshake className="h-4 w-4 text-orange-500" aria-hidden="true" />
              <p className="font-semibold">Type</p>
            </div>
            <p className="mt-2">{donationTypeLabels[donationType]}</p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-soft-black">
              <WalletCards className="h-4 w-4 text-orange-500" aria-hidden="true" />
              <p className="font-semibold">Paiement</p>
            </div>
            <p className="mt-2">{paymentMethod ? paymentLabels[paymentMethod] : 'À sélectionner'}</p>
          </div>
        </div>

        {selectedProgram ? (
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="font-semibold text-soft-black">Programme</p>
            <p className="mt-2">{selectedProgram}</p>
          </div>
        ) : null}

        {selectedCampaign ? (
          <div className="space-y-4 rounded-3xl border border-orange-100 p-4">
            <img
              src={selectedCampaign.image}
              alt={selectedCampaign.title}
              className="h-40 w-full rounded-2xl object-cover"
            />

            <div className="flex items-center gap-2 text-soft-black">
              <Landmark className="h-4 w-4 text-orange-500" aria-hidden="true" />
              <p className="font-semibold">{selectedCampaign.title}</p>
            </div>

            <p className="text-sm text-slate-600">
              {selectedCampaign.raisedAmount} / {selectedCampaign.goalAmount} USD
            </p>

            <div className="h-2 rounded-full bg-slate-100">
              <div className="h-2 rounded-full bg-orange-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  )
}

export default DonationSummary
