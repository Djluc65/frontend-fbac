import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type DonationChartType = 'line-area' | 'bar' | 'pie'
type DonationChartDataPoint = Record<string, string | number | undefined>

interface DonationChartProps {
  title: string
  description?: string
  type: DonationChartType
  data: DonationChartDataPoint[]
  dataKey: string
  categoryKey: string
  colors?: string[]
}

const defaultColors = ['#f97316', '#fb923c', '#fdba74', '#38bdf8', '#6366f1', '#10b981']

const DonationChart = ({
  title,
  description,
  type,
  data,
  dataKey,
  categoryKey,
  colors = defaultColors,
}: DonationChartProps) => {
  return (
    <article className="rounded-3xl bg-white p-6 shadow-panel">
      <div className="mb-4">
        <h3 className="font-display text-xl font-semibold text-slate-900">{title}</h3>
        {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'pie' ? (
            <PieChart>
              <Tooltip />
              <Legend />
              <Pie data={data} dataKey={String(dataKey)} nameKey={String(categoryKey)} innerRadius={70} outerRadius={105}>
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
            </PieChart>
          ) : type === 'bar' ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey={String(categoryKey)} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey={String(dataKey)} fill={colors[0]} radius={[10, 10, 0, 0]} />
            </BarChart>
          ) : (
            <AreaChart data={data}>
              <defs>
                <linearGradient id="donationAreaChart" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors[0]} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={colors[0]} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey={String(categoryKey)} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey={String(dataKey)}
                stroke={colors[0]}
                fillOpacity={1}
                fill="url(#donationAreaChart)"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </article>
  )
}

export default DonationChart
