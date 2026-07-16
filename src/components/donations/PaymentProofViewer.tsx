import { Download, Eye, FileText } from 'lucide-react'
import type { DonationAdminDetail } from '../../features/donations/donationTypes'

interface PaymentProofViewerProps {
  proof: DonationAdminDetail['paymentProof']
}

const isImage = (mimeType?: string) => Boolean(mimeType?.startsWith('image/'))

const PaymentProofViewer = ({ proof }: PaymentProofViewerProps) => {
  if (!proof) {
    return (
      <article className="rounded-3xl bg-white p-6 shadow-panel">
        <h3 className="font-display text-xl font-semibold text-slate-900">Preuve de paiement</h3>
        <p className="mt-3 text-sm text-slate-500">Aucune preuve n’a encore été associée à ce don.</p>
      </article>
    )
  }

  return (
    <article className="rounded-3xl bg-white p-6 shadow-panel">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-xl font-semibold text-slate-900">Preuve de paiement</h3>
          <p className="mt-1 text-sm text-slate-500">{proof.originalFileName}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href={proof.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700"
          >
            <Eye className="h-4 w-4" />
            Ouvrir
          </a>
          <a
            href={proof.fileUrl}
            download
            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            <Download className="h-4 w-4" />
            Télécharger
          </a>
        </div>
      </div>

      {isImage(proof.mimeType) ? (
        <img
          src={proof.fileUrl}
          alt={`Preuve de paiement ${proof.originalFileName}`}
          className="mt-4 max-h-[420px] w-full rounded-3xl object-contain"
        />
      ) : (
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-600">
          <FileText className="h-5 w-5 text-orange-500" />
          <span className="text-sm">Document non image. Ouvrez-le dans un nouvel onglet pour le consulter.</span>
        </div>
      )}
    </article>
  )
}

export default PaymentProofViewer
