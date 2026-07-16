import { Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
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

const DonationTable = ({ donations }: DonationTableProps) => {
  return (
    <section className="rounded-3xl bg-white p-5 shadow-panel">
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
                <td className="px-3 py-4">
                  {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: donation.currency,
                  }).format(donation.amount)}
                </td>
                <td className="px-3 py-4">{paymentLabels[donation.paymentMethod] ?? donation.paymentMethod}</td>
                <td className="px-3 py-4">{statusLabels[donation.status] ?? donation.status}</td>
                <td className="px-3 py-4">{proofStatusLabels[donation.proofStatus] ?? donation.proofStatus}</td>
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
            <article key={donation._id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">{donation.reference}</p>
                  <p className="text-sm text-slate-500">
                    {donation.donorFirstName} {donation.donorLastName}
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {statusLabels[donation.status] ?? donation.status}
                </span>
              </div>

              <dl className="mt-4 grid gap-2 text-sm text-slate-600">
                <div>
                  <dt className="font-medium text-slate-900">Montant</dt>
                  <dd>
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: donation.currency,
                    }).format(donation.amount)}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-900">Paiement</dt>
                  <dd>{paymentLabels[donation.paymentMethod] ?? donation.paymentMethod}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-900">Preuve</dt>
                  <dd>{proofStatusLabels[donation.proofStatus] ?? donation.proofStatus}</dd>
                </div>
              </dl>

              <Link
                to={`/admin/donations/${donation._id}`}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
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
