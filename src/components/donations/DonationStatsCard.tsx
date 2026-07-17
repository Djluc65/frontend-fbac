import type { LucideIcon } from 'lucide-react'
import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react'
import type { DonationDashboardMetric } from '../../features/donations/donationTypes'

type ValueFormat = 'currency' | 'percent' | 'number'

interface DonationStatsCardProps {
  title: string
  metric: DonationDashboardMetric
  icon: LucideIcon
  valueFormat?: ValueFormat
}

const formatValue = (value: number, valueFormat: ValueFormat) => {
  if (valueFormat === 'currency') {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(value)
  }

  if (valueFormat === 'percent') {
    return `${value.toFixed(2)} %`
  }

  return new Intl.NumberFormat('fr-FR').format(value)
}

const DonationStatsCard = ({
  title,
  metric,
  icon: Icon,
  valueFormat = 'number',
}: DonationStatsCardProps) => {
  const TrendIcon =
    metric.trend === 'positive' ? ArrowUpRight : metric.trend === 'negative' ? ArrowDownRight : ArrowRight
  const trendClass =
    metric.trend === 'positive'
      ? 'bg-emerald-50 text-emerald-600'
      : metric.trend === 'negative'
        ? 'bg-red-50 text-red-600'
        : 'bg-slate-100 text-slate-600'

  return (
    <article className="rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-panel transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.12)] sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 break-words text-[1.65rem] font-bold leading-tight text-slate-900 sm:text-3xl">
            {formatValue(metric.current, valueFormat)}
          </p>
        </div>
        <div className="rounded-2xl bg-orange-100 p-3 text-orange-600">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold">
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 ${trendClass}`}>
          <TrendIcon className="h-3.5 w-3.5" />
          {metric.changePercentage >= 0 ? '+' : ''}
          {metric.changePercentage.toFixed(2)} %
        </span>
        <span className="break-words text-slate-500">
          Période précédente: {formatValue(metric.previous, valueFormat)}
        </span>
      </div>
    </article>
  )
}

export default DonationStatsCard
