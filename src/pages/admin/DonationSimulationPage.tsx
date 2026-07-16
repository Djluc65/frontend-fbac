import { FlaskConical } from 'lucide-react'
import AdminShell from '../../components/admin/AdminShell'

const DonationSimulationPage = () => {
  return (
    <AdminShell
      title="Simulations"
      description="Cette base de page est prête pour la prochaine phase dédiée aux projections financières et scénarios de collecte."
    >
      <section className="rounded-3xl bg-white p-6 shadow-panel">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-orange-100 p-3 text-orange-600">
            <FlaskConical className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-slate-900">Phase suivante préparée</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              La structure de navigation est en place. Les simulations seront branchées sur une collection dédiée et des
              calculs sans impact sur les données réelles.
            </p>
          </div>
        </div>
      </section>
    </AdminShell>
  )
}

export default DonationSimulationPage
