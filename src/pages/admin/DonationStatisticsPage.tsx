import { useState } from 'react'
import { Activity, CalendarRange } from 'lucide-react'
import AdminShell from '../../components/admin/AdminShell'
import AdminCard from '../../components/admin/AdminCard'
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
        <label className="flex h-10 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 text-sm">
          <CalendarRange className="h-4 w-4" />
          <span className="hidden sm:inline">Période</span>
          <select
            value={period}
            onChange={(event) => setPeriod(event.target.value as DonationAnalyticsPeriod)}
            className="min-w-0 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white outline-none"
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
        <section className="rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-panel">
          <LoadingSpinner className="justify-center py-10" />
        </section>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          <AdminCard
            icon={Activity}
            title="Vue analytique"
            description="Les graphiques se recalculent automatiquement selon la période sélectionnée."
          />

          <section className="grid gap-4 xl:grid-cols-2 xl:gap-6">
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

          <section className="grid gap-4 xl:grid-cols-2 xl:gap-6">
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

          <section className="grid gap-4 xl:grid-cols-2 xl:gap-6">
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
