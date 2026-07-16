import type { DonationAdminDetail } from '../../features/donations/donationTypes'

interface DonationDetailsPanelProps {
  detail: DonationAdminDetail
}

const DonationDetailsPanel = ({ detail }: DonationDetailsPanelProps) => {
  const { donation, donorSummary } = detail

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <article className="rounded-3xl bg-white p-6 shadow-panel">
        <h3 className="font-display text-xl font-semibold text-slate-900">Informations du don</h3>
        <dl className="mt-4 grid gap-3 text-sm text-slate-600">
          <div>
            <dt className="font-medium text-slate-900">Référence</dt>
            <dd>{donation.reference}</dd>
          </div>
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
            <dt className="font-medium text-slate-900">Méthode</dt>
            <dd>{donation.paymentMethod}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">Fréquence</dt>
            <dd>{donation.frequency}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">Statut</dt>
            <dd>{donation.status}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">Campagne</dt>
            <dd>{donation.campaign?.title ?? 'Don général'}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">Programme</dt>
            <dd>{donation.program ?? 'Non renseigné'}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">Message</dt>
            <dd>{donation.message || 'Aucun message'}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">Anonyme</dt>
            <dd>{donation.anonymous ? 'Oui' : 'Non'}</dd>
          </div>
        </dl>
      </article>

      <article className="rounded-3xl bg-white p-6 shadow-panel">
        <h3 className="font-display text-xl font-semibold text-slate-900">Donateur</h3>
        <dl className="mt-4 grid gap-3 text-sm text-slate-600">
          <div>
            <dt className="font-medium text-slate-900">Nom complet</dt>
            <dd>
              {donation.donorFirstName} {donation.donorLastName}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">Email</dt>
            <dd>{donation.donorEmail}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">Téléphone</dt>
            <dd>{donation.donorPhone || 'Non renseigné'}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">Pays</dt>
            <dd>{donation.donorCountry || 'Non renseigné'}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">Nombre total de dons</dt>
            <dd>{donorSummary.totalDonations}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">Montant total donné</dt>
            <dd>
              {new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: donation.currency,
              }).format(donorSummary.totalAmount)}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">Premier don</dt>
            <dd>{new Date(donorSummary.firstDonationAt).toLocaleString('fr-FR')}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">Dernier don</dt>
            <dd>{new Date(donorSummary.lastDonationAt).toLocaleString('fr-FR')}</dd>
          </div>
        </dl>
      </article>
    </div>
  )
}

export default DonationDetailsPanel
