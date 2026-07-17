import { Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import AdminStatusBadge from '../admin/AdminStatusBadge'
import type { Donation } from '../../features/donations/donationTypes'

interface DonationTableProps {
  donations: Donation[]
}

const statusLabels: Record<string, string> = {
  DRAFT: 'Brouillon',
  PENDING: 'En attente',
  PROCESSING: 'Traitement',
  UNDER_REVIEW: 'Sous revue',
  COMPLETED: 'Confirmé',
  FAILED: 'Échoué',
  CANCELLED: 'Annulé',
  REFUNDED: 'Remboursé',
  REJECTED: 'Rejeté',
}

const proofStatusLabels: Record<string, string> = {
  NOT_REQUIRED: 'Non requise',
  NOT_UPLOADED: 'Non envoyée',
  PENDING_REVIEW: 'À vérifier',
  APPROVED: 'Approuvée',
  REJECTED: 'Rejetée',
}

const paymentLabels: Record<string, string> = {
  PAYPAL: 'PayPal',
  BANK_TRANSFER: 'Virement',
  ZELLE: 'Zelle',
  CASH_APP: 'Cash App',
  ON_SITE: 'Sur place',
  CARD: 'Carte',
}

const getDonationStatusTone = (status: string) => {
  if (status === 'COMPLETED') {
    return 'success' as const
  }

  if (status === 'UNDER_REVIEW' || status === 'PROCESSING' || status === 'PENDING') {
    return 'warning' as const
  }

  if (status === 'FAILED' || status === 'REJECTED' || status === 'CANCELLED') {
    return 'danger' as const
  }

  return 'neutral' as const
}

const getProofStatusTone = (status: string) => {
  if (status === 'APPROVED') {
    return 'success' as const
  }

  if (status === 'PENDING_REVIEW') {
    return 'warning' as const
  }

  if (status === 'REJECTED') {
    return 'danger' as const
  }

  return 'neutral' as const
}

const DonationTable = ({ donations }: DonationTableProps) => {
  if (donations.length === 0) {
    return (
      <section className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-panel sm:p-6">
        <div className="rounded-[20px] border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center text-sm leading-6 text-slate-500">
          Aucun don ne correspond aux filtres actuellement appliqués.
        </div>
      </section>
    )
  }

  return (
    <section className="rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-panel sm:p-5">
      <div className="overflow-x-auto">
        <table className="hidden min-w-full text-left text-sm lg:table">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="px-3 py-3 font-semibold">Référence</th>
              <th className="px-3 py-3 font-semibold">Donateur</th>
              <th className="px-3 py-3 font-semibold">Montant</th>
              <th className="px-3 py-3 font-semibold">Paiement</th>
              <th className="px-3 py-3 font-semibold">Statut</th>
              <th className="px-3 py-3 font-semibold">Preuve</th>
              <th className="px-3 py-3 font-semibold">Date</th>
              <th className="px-3 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation) => (
              <tr key={donation._id} className="border-b border-slate-100 text-slate-700 last:border-0">
                <td className="px-3 py-4 font-semibold text-slate-900">{donation.reference}</td>
                <td className="px-3 py-4">
                  <div className="font-medium text-slate-900">
                    {donation.donorFirstName} {donation.donorLastName}
                  </div>
                  <div className="text-xs text-slate-500">{donation.donorEmail}</div>
                </td>
                <td className="px-3 py-4 font-semibold text-slate-900">
                  {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: donation.currency,
                  }).format(donation.amount)}
                </td>
                <td className="px-3 py-4">{paymentLabels[donation.paymentMethod] ?? donation.paymentMethod}</td>
                <td className="px-3 py-4">
                  <AdminStatusBadge
                    label={statusLabels[donation.status] ?? donation.status}
                    tone={getDonationStatusTone(donation.status)}
                  />
                </td>
                <td className="px-3 py-4">
                  <AdminStatusBadge
                    label={proofStatusLabels[donation.proofStatus] ?? donation.proofStatus}
                    tone={getProofStatusTone(donation.proofStatus)}
                  />
                </td>
                <td className="px-3 py-4">{new Date(donation.createdAt).toLocaleDateString('fr-FR')}</td>
                <td className="px-3 py-4">
                  <Link
                    to={`/admin/donations/${donation._id}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700"
                  >
                    <Eye className="h-4 w-4" />
                    Voir
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="space-y-4 lg:hidden">
          {donations.map((donation) => (
            <article
              key={donation._id}
              className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4 transition duration-200 hover:border-orange-200 hover:bg-orange-50/70"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                    {donation.reference}
                  </p>
                  <p className="mt-1 break-words text-base font-semibold text-slate-900">
                    {donation.donorFirstName} {donation.donorLastName}
                  </p>
                  <p className="mt-1 break-words text-sm text-slate-500">{donation.donorEmail}</p>
                </div>
                <AdminStatusBadge
                  label={statusLabels[donation.status] ?? donation.status}
                  tone={getDonationStatusTone(donation.status)}
                />
              </div>

              <dl className="mt-4 grid gap-3 text-sm text-slate-600 min-[430px]:grid-cols-2">
                <div className="rounded-2xl bg-white px-4 py-3">
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Montant</dt>
                  <dd>
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: donation.currency,
                    }).format(donation.amount)}
                  </dd>
                </div>
                <div className="rounded-2xl bg-white px-4 py-3">
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Paiement</dt>
                  <dd>{paymentLabels[donation.paymentMethod] ?? donation.paymentMethod}</dd>
                </div>
                <div className="rounded-2xl bg-white px-4 py-3">
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Preuve</dt>
                  <dd className="mt-1">
                    <AdminStatusBadge
                      label={proofStatusLabels[donation.proofStatus] ?? donation.proofStatus}
                      tone={getProofStatusTone(donation.proofStatus)}
                    />
                  </dd>
                </div>
                <div className="rounded-2xl bg-white px-4 py-3">
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Date</dt>
                  <dd>{new Date(donation.createdAt).toLocaleDateString('fr-FR')}</dd>
                </div>
              </dl>

              <Link
                to={`/admin/donations/${donation._id}`}
                className="mt-4 inline-flex h-11 items-center gap-2 rounded-xl bg-orange-500 px-4 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                <Eye className="h-4 w-4" />
                Ouvrir le détail
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default DonationTable
