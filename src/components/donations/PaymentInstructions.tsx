import { Copy, Landmark, MapPin, Phone } from 'lucide-react'
import { toast } from 'sonner'
import type { PaymentMethodId, PaymentMethodOption } from '../../features/payments/paymentTypes'
import type { SiteContent } from '../../features/siteContent/siteContentTypes'
import UploadProof from './UploadProof'

interface PaymentInstructionsProps {
  method: PaymentMethodId | null
  methodDetails?: PaymentMethodOption | null
  content: SiteContent
  reference?: string
  proofImage?: string
  proofFileName?: string
  onReferenceChange: (value: string) => void
  onProofUploaded: (payload: {
    previewUrl: string
    fileName: string
    mimeType: string
    fileSize: number
    file: File
  }) => void
  referenceError?: string
  proofError?: string
}

const PaymentInstructions = ({
  method,
  methodDetails,
  content,
  reference,
  proofImage,
  proofFileName,
  onReferenceChange,
  onProofUploaded,
  referenceError,
  proofError,
}: PaymentInstructionsProps) => {
  if (!method) {
    return null
  }

  const publicConfiguration = methodDetails?.publicConfiguration ?? {}
  const bankDetails = [
    `Nom de la banque : ${String(publicConfiguration.bankName ?? 'Banque officielle de la fondation')}`,
    `Nom du titulaire : ${String(publicConfiguration.accountHolder ?? 'Fondation Bien Aimé Cassis')}`,
    `Numéro de compte : ${String(publicConfiguration.accountNumberMasked ?? '0000 0000 0000')}`,
    `IBAN : ${String(publicConfiguration.iban ?? 'HT00 0000 0000 0000 0000 0000')}`,
    `SWIFT : ${String(publicConfiguration.swift ?? 'FBACHTPP')}`,
  ]

  const copyBankDetails = async () => {
    try {
      await navigator.clipboard.writeText(bankDetails.join('\n'))
      toast.success('Les informations bancaires ont été copiées.')
    } catch (_error) {
      toast.error('Impossible de copier les informations bancaires pour le moment.')
    }
  }

  const renderReferenceField = (label = 'Référence obligatoire') => (
    <div>
      <label htmlFor="transactionReference" className="mb-2 block text-sm font-semibold text-soft-black">
        {label}
      </label>
      <input
        id="transactionReference"
        value={reference || ''}
        onChange={(event) => onReferenceChange(event.target.value)}
        className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
        placeholder="Ex. FBAC-2026-001"
      />
      {referenceError ? <p className="mt-2 text-sm font-medium text-red-600">{referenceError}</p> : null}
    </div>
  )

  if (method === 'PAYPAL') {
    return (
      <div className="rounded-3xl border border-orange-100 bg-orange-50 p-5 text-sm text-slate-600">
        <p className="font-semibold text-soft-black">Paiement sécurisé par PayPal.</p>
        <p className="mt-2">
          {methodDetails?.instructions ||
            'Vous serez redirigé vers un parcours sécurisé lors de la phase suivante. Le frontend ne marque jamais un don comme payé.'}
        </p>
      </div>
    )
  }

  if (method === 'CARD') {
    return (
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
        <p className="font-semibold text-soft-black">Carte bancaire bientôt disponible</p>
        <p className="mt-2">
          L’intégration carte sera ajoutée avec Stripe dans la phase suivante.
        </p>
      </div>
    )
  }

  if (method === 'BANK_TRANSFER') {
    return (
      <div className="space-y-5 rounded-3xl border border-orange-100 bg-orange-50 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-soft-black">Virement bancaire</p>
            <p className="mt-1 text-sm text-slate-600">
              Votre don sera marqué en attente jusqu’à validation administrative.
            </p>
          </div>
          <button
            type="button"
            onClick={copyBankDetails}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-orange-600 transition hover:border-orange-300"
          >
            <Copy className="h-4 w-4" aria-hidden="true" />
            Copier les informations bancaires
          </button>
        </div>

        <div className="grid gap-3 rounded-2xl bg-white p-4 text-sm text-slate-600">
          {bankDetails.map((item) => (
            <div key={item} className="flex items-start gap-3">
              <Landmark className="mt-0.5 h-4 w-4 text-orange-500" aria-hidden="true" />
              <span>{item}</span>
            </div>
          ))}
          <p className="rounded-2xl bg-orange-50 px-3 py-2 text-orange-700">
            La référence interne du don sera confirmée côté serveur au moment de la soumission sécurisée.
          </p>
        </div>

        {renderReferenceField()}
        <UploadProof
          value={proofImage}
          fileName={proofFileName}
          onUploaded={onProofUploaded}
          error={proofError}
        />
      </div>
    )
  }

  if (method === 'ZELLE') {
    return (
      <div className="space-y-5 rounded-3xl border border-violet-100 bg-violet-50 p-5">
        <div className="rounded-2xl bg-white p-4 text-sm text-slate-600">
          <p className="font-semibold text-soft-black">Zelle</p>
          <p className="mt-2">
            Nom du bénéficiaire : {String(publicConfiguration.recipientName ?? 'Fondation Bien Aimé Cassis')}
          </p>
          <p>Adresse Zelle : {String(publicConfiguration.zelleEmail ?? 'donations@fondation.ht')}</p>
          {publicConfiguration.zellePhone ? <p>Téléphone : {String(publicConfiguration.zellePhone)}</p> : null}
          <p className="mt-3 rounded-2xl bg-violet-50 px-3 py-2 text-violet-700">
            La référence interne du don sera confirmée côté serveur au moment de la soumission sécurisée.
          </p>
        </div>
        {renderReferenceField('Référence Zelle')}
        <UploadProof
          value={proofImage}
          fileName={proofFileName}
          onUploaded={onProofUploaded}
          error={proofError}
        />
      </div>
    )
  }

  if (method === 'CASH_APP') {
    return (
      <div className="space-y-5 rounded-3xl border border-emerald-100 bg-emerald-50 p-5">
        <div className="rounded-2xl bg-white p-4 text-sm text-slate-600">
          <p className="font-semibold text-soft-black">Cash App</p>
          <p className="mt-2">CashTag : {String(publicConfiguration.cashtag ?? '$FondationCassis')}</p>
          <p>
            Bénéficiaire : {String(publicConfiguration.recipientName ?? 'Fondation Bien Aimé Cassis')}
          </p>
          <p>
            QR Code :{' '}
            {publicConfiguration.qrCodeUrl
              ? 'disponible dans les instructions ci-dessous.'
              : 'sera affiché dans la phase suivante.'}
          </p>
          <p className="mt-3 rounded-2xl bg-emerald-50 px-3 py-2 text-emerald-700">
            La référence interne du don sera confirmée côté serveur au moment de la soumission sécurisée.
          </p>
        </div>
        {renderReferenceField('Référence Cash App')}
        <UploadProof
          value={proofImage}
          fileName={proofFileName}
          onUploaded={onProofUploaded}
          error={proofError}
        />
      </div>
    )
  }

  if (method === 'ON_SITE') {
    return (
      <div className="rounded-3xl border border-amber-100 bg-amber-50 p-5 text-sm text-slate-600">
        <p className="font-semibold text-soft-black">Merci.</p>
        <p className="mt-2">Présentez-vous à la Fondation Bien Aimé Cassis.</p>
        <div className="mt-4 grid gap-3 rounded-2xl bg-white p-4">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 text-orange-500" aria-hidden="true" />
            <span>{String(publicConfiguration.address ?? content.contactPage.address)}</span>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="mt-0.5 h-4 w-4 text-orange-500" aria-hidden="true" />
            <span>{String(publicConfiguration.phone ?? content.contactPage.phone)}</span>
          </div>
          <p>Horaires : {String(publicConfiguration.hours ?? 'du lundi au vendredi, de 9h00 à 16h00.')}</p>
        </div>
      </div>
    )
  }

  return null
}

export default PaymentInstructions
