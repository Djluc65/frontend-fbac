import { Helmet } from 'react-helmet-async'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { FileText, Download, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSiteContent } from '../features/siteContent/useSiteContent'

const Transparency = () => {
  const { content } = useSiteContent()
  const page = content.transparencyPage

  return (
    <>
      <Helmet>
        <title>{page.seoTitle}</title>
        <meta name="description" content={page.seoDescription} />
      </Helmet>

      <section className="bg-gradient-to-br from-orange-50 to-orange-100 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="mb-6 font-display text-4xl font-bold text-soft-black md:text-5xl">
              {page.heroTitle}
            </h1>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">{page.heroDescription}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-display text-3xl font-bold text-soft-black">
              {page.principlesTitle}
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">{page.principlesDescription}</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {page.principles.map((principle, index) => (
              <motion.div
                key={`${principle.title}-${index}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="rounded-2xl bg-white p-6 shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                  <CheckCircle2 className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="mb-3 font-display text-xl font-semibold text-soft-black">
                  {principle.title}
                </h3>
                <p className="text-gray-600">{principle.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-6 font-display text-3xl font-bold text-soft-black">
                {page.allocationTitle}
              </h2>
              <p className="mb-6 text-gray-600">{page.allocationDescription}</p>
              <div className="space-y-4">
                {page.allocationItems.map((item, index) => (
                  <div key={`${item.name}-${index}`} className="flex items-center gap-4">
                    <div
                      className="h-4 w-4 flex-shrink-0 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="flex-1">
                      <div className="mb-1 flex justify-between">
                        <span className="font-medium text-gray-700">{item.name}</span>
                        <span className="font-bold text-gray-700">{item.value}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full"
                          style={{ width: `${item.value}%`, backgroundColor: item.color }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="rounded-2xl bg-white p-6 shadow-md"
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={page.allocationItems}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Bar dataKey="value" fill="#f97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-display text-3xl font-bold text-soft-black">
              {page.reportsTitle}
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">{page.reportsDescription}</p>
          </div>
          <div className="space-y-4">
            {page.reports.map((report, index) => (
              <motion.div
                key={`${report.title}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center justify-between rounded-2xl bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                    <FileText className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-soft-black">
                      {report.title}
                    </h3>
                    <span className="text-sm text-green-600">{report.status}</span>
                  </div>
                </div>
                <a
                  href={report.download}
                  className="flex items-center gap-2 font-semibold text-orange-500 hover:text-orange-600"
                >
                  Télécharger
                  <Download className="h-4 w-4" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-orange-500 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {page.impactStats.map((stat, index) => (
              <div key={`${stat.label}-${index}`} className="text-white">
                <div className="mb-2 font-display text-4xl font-bold md:text-5xl">{stat.value}</div>
                <div className="text-orange-100">{stat.label}</div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-orange-100">{page.statsDisclaimer}</p>
        </div>
      </section>
    </>
  )
}

export default Transparency
