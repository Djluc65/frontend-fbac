import { useMemo, useState } from 'react'
import {
  BadgeDollarSign,
  BarChart3,
  CheckCircle2,
  Clock3,
  CreditCard,
  HandCoins,
  Landmark,
  ShieldAlert,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import AdminShell from '../../components/admin/AdminShell'
import DonationChart from '../../components/donations/DonationChart'
import DonationStatsCard from '../../components/donations/DonationStatsCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { useGetDashboardStatsQuery, useGetDonationStatisticsQuery } from '../../features/donations/donationsAdminApi'
import type { DonationAnalyticsPeriod } from '../../features/donations/donationTypes'

const periodOptions: Array<{ value: DonationAnalyticsPeriod; label: string }> = [
  { value: 'TODAY', label: "Aujourd'hui" },
  { value: 'LAST_7_DAYS', label: '7 derniers jours' },
  { value: 'LAST_30_DAYS', label: '30 derniers jours' },
  { value: 'THIS_MONTH', label: 'Mois en cours' },
  { value: 'THIS_YEAR', label: 'Année en cours' },
]

const DonationDashboardPage = () => {
  const [period, setPeriod] = useState<DonationAnalyticsPeriod>('LAST_30_DAYS')
  const { data: dashboard, isLoading } = useGetDashboardStatsQuery({ period })
  const { data: statistics } = useGetDonationStatisticsQuery({ period })

  const cards = useMemo(
    () =>
      dashboard
        ? [
            {
              title: 'Montant confirmé',
              metric: dashboard.summary.totalConfirmedAmount,
              icon: BadgeDollarSign,
              valueFormat: 'currency' as const,
            },
            {
              title: 'Montant en attente',
              metric: dashboard.summary.totalPendingAmount,
              icon: Clock3,
              valueFormat: 'currency' as const,
            },
            {
              title: 'Nombre de dons',
              metric: dashboard.summary.donationCount,
              icon: HandCoins,
              valueFormat: 'number' as const,
            },
            {
              title: 'Donateurs uniques',
              metric: dashboard.summary.uniqueDonorCount,
              icon: Users,
              valueFormat: 'number' as const,
            },
            {
              title: 'Taux de confirmation',
              metric: dashboard.summary.confirmationRate,
              icon: CheckCircle2,
              valueFormat: 'percent' as const,
            },
            {
              title: 'Preuves en attente',
              metric: dashboard.summary.pendingProofCount,
              icon: ShieldAlert,
              valueFormat: 'number' as const,
            },
            {
              title: 'Paiements PayPal',
              metric: dashboard.summary.paypalDonationCount,
              icon: CreditCard,
              valueFormat: 'number' as const,
            },
            {
              title: 'Virements bancaires',
              metric: dashboard.summary.bankTransferDonationCount,
              icon: Landmark,
              valueFormat: 'number' as const,
            },
          ]
        : [],
    [dashboard]
  )

  return (
    <AdminShell
      title="Vue d’ensemble des dons"
      description="Suivez les principaux indicateurs de collecte, les paiements manuels à vérifier et l’évolution des dons confirmés."
      actions={
        <label className="flex h-10 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 text-sm">
          <BarChart3 className="h-4 w-4" />
          <span className="hidden sm:inline">Période</span>
          <select
            value={period}
            onChange={(event) => setPeriod(event.target.value as DonationAnalyticsPeriod)}
            className="min-w-0 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white outline-none"
            aria-label="Choisir une période d’analyse"
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
      {isLoading || !dashboard || !statistics ? (
        <section className="rounded-3xl bg-white p-6 shadow-panel">
          <LoadingSpinner className="justify-center py-10" />
        </section>
      ) : (
        <div className="space-y-6">
          <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
            {cards.map((card) => (
              <DonationStatsCard
                key={card.title}
                title={card.title}
                metric={card.metric}
                icon={card.icon}
                valueFormat={card.valueFormat}
              />
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <DonationChart
              title="Évolution quotidienne"
              description="Montant collecté par jour sur la période sélectionnée."
              type="line-area"
              data={statistics.series.donationsByDay.map((item) => ({ ...item }))}
              dataKey="amount"
              categoryKey="label"
            />
            <DonationChart
              title="Répartition par moyen de paiement"
              description="Nombre de dons enregistrés selon le canal utilisé."
              type="pie"
              data={statistics.series.byPaymentMethod.map((item) => ({
                ...item,
                label: item.key,
              }))}
              dataKey="count"
              categoryKey="label"
            />
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <DonationChart
              title="Évolution mensuelle"
              description="Montant cumulé par mois pour visualiser la dynamique de collecte."
              type="bar"
              data={statistics.series.donationsByMonth.map((item) => ({ ...item }))}
              dataKey="amount"
              categoryKey="label"
            />
            <DonationChart
              title="Statuts des dons"
              description="Répartition du volume de dons par statut administratif."
              type="bar"
              data={statistics.series.byStatus.map((item) => ({
                ...item,
                label: item.key,
              }))}
              dataKey="count"
              categoryKey="label"
            />
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: 'Tous les dons',
                description: 'Parcourir la liste complète avec filtres et pagination.',
                to: '/admin/donations',
              },
              {
                title: 'Paiements à vérifier',
                description: 'Traiter les preuves manuelles en attente.',
                to: '/admin/donations/review',
              },
              {
                title: 'Transactions',
                description: 'Consulter les traces de paiements et les statuts providers.',
                to: '/admin/donations/transactions',
              },
              {
                title: 'Journal d’audit',
                description: 'Suivre l’historique des actions administratives.',
                to: '/admin/audit-logs',
              },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-3xl bg-white p-5 shadow-panel transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <h3 className="font-display text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                <span className="mt-4 inline-flex text-sm font-semibold text-orange-600">Ouvrir</span>
              </Link>
            ))}
          </section>
        </div>
      )}
    </AdminShell>
  )
}

export default DonationDashboardPage
