import { useState } from 'react'
import { Activity, CalendarRange } from 'lucide-react'
import AdminShell from '../../components/admin/AdminShell'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import DonationChart from '../../components/donations/DonationChart'
import { useGetDonationStatisticsQuery } from '../../features/donations/donationsAdminApi'
import type { DonationAnalyticsPeriod } from '../../features/donations/donationTypes'

const periodOptions: Array<{ value: DonationAnalyticsPeriod; label: string }> = [
  { value: 'TODAY', label: "Aujourd'hui" },
  { value: 'LAST_7_DAYS', label: '7 derniers jours' },
  { value: 'LAST_30_DAYS', label: '30 derniers jours' },
  { value: 'THIS_MONTH', label: 'Mois en cours' },
  { value: 'THIS_YEAR', label: 'Année en cours' },
]

const DonationStatisticsPage = () => {
  const [period, setPeriod] = useState<DonationAnalyticsPeriod>('LAST_30_DAYS')
  const { data, isLoading } = useGetDonationStatisticsQuery({ period })

  return (
    <AdminShell
      title="Statistiques"
      description="Analysez la collecte par période, par statut, par devise, par campagne et par comportement donateur."
      actions={
        <label className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-sm">
          <CalendarRange className="h-4 w-4" />
          <span>Période</span>
          <select
            value={period}
            onChange={(event) => setPeriod(event.target.value as DonationAnalyticsPeriod)}
            className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white outline-none"
          >
            {periodOptions.map((option) => (
              <option key={option.value} value={option.value} className="text-slate-900">
                {option.label}
              </option>
            ))}
          </select>
        </label>
      }
    >
      {isLoading || !data ? (
        <section className="rounded-3xl bg-white p-6 shadow-panel">
          <LoadingSpinner className="justify-center py-10" />
        </section>
      ) : (
        <div className="space-y-6">
          <section className="rounded-3xl bg-white p-5 shadow-panel">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-orange-100 p-3 text-orange-600">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold text-slate-900">Vue analytique</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Les graphiques se recalculent automatiquement selon la période sélectionnée.
                </p>
              </div>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <DonationChart
              title="Dons par jour"
              description="Montants journaliers sur la période active."
              type="line-area"
              data={data.series.donationsByDay.map((item) => ({ ...item }))}
              dataKey="amount"
              categoryKey="label"
            />
            <DonationChart
              title="Dons par semaine"
              description="Regroupement hebdomadaire pour lisser les variations."
              type="bar"
              data={data.series.donationsByWeek.map((item) => ({ ...item }))}
              dataKey="amount"
              categoryKey="label"
            />
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <DonationChart
              title="Modes de paiement"
              description="Répartition du volume par canal de paiement."
              type="pie"
              data={data.series.byPaymentMethod.map((item) => ({
                ...item,
                label: item.key,
              }))}
              dataKey="count"
              categoryKey="label"
            />
            <DonationChart
              title="Devises"
              description="Répartition des dons selon la devise utilisée."
              type="bar"
              data={data.series.byCurrency.map((item) => ({
                ...item,
                label: item.key,
              }))}
              dataKey="amount"
              categoryKey="label"
            />
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <DonationChart
              title="Campagnes"
              description="Campagnes les plus soutenues sur la période."
              type="bar"
              data={data.series.byCampaign.map((item) => ({
                ...item,
                label: item.label ?? item.key,
              }))}
              dataKey="amount"
              categoryKey="label"
            />
            <DonationChart
              title="Anonymes vs identifiés"
              description="Comparaison entre les dons anonymes et nominatifs."
              type="pie"
              data={data.series.anonymousVsIdentified.map((item) => ({ ...item }))}
              dataKey="count"
              categoryKey="label"
            />
          </section>
        </div>
      )}
    </AdminShell>
  )
}

export default DonationStatisticsPage
