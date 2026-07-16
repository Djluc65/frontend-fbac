import { FileBarChart } from 'lucide-react'
import AdminShell from '../../components/admin/AdminShell'

const DonationReportsPage = () => {
  return (
    <AdminShell
      title="Rapports"
      description="La page de rapports est réservée à la phase dédiée aux documents officiels, synthèses périodiques et exports prêts à diffuser."
    >
      <section className="rounded-3xl bg-white p-6 shadow-panel">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-orange-100 p-3 text-orange-600">
            <FileBarChart className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-slate-900">Base prête pour les rapports</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Le module est préparé pour accueillir les rapports journaliers, mensuels, annuels et par campagne lors de
              la prochaine phase.
            </p>
          </div>
        </div>
      </section>
    </AdminShell>
  )
}

export default DonationReportsPage
