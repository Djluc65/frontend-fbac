import { History } from 'lucide-react'
import AdminShell from '../../components/admin/AdminShell'

const ExportHistoryPage = () => {
  return (
    <AdminShell
      title="Historique des exports"
      description="Cette page servira à suivre les générations de fichiers, leur disponibilité et leur expiration."
    >
      <section className="rounded-3xl bg-white p-6 shadow-panel">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-orange-100 p-3 text-orange-600">
            <History className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-slate-900">Historique à brancher</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              L’emplacement de l’historique est déjà prévu pour accueillir les jobs d’export asynchrones et leurs liens
              de téléchargement.
            </p>
          </div>
        </div>
      </section>
    </AdminShell>
  )
}

export default ExportHistoryPage
