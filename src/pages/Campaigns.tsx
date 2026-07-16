import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import { useGetCampaignsQuery } from '../features/campaigns/campaignApi'
import { useSiteContent } from '../features/siteContent/useSiteContent'

const getDaysLeft = (endDate: string) => {
  const end = new Date(endDate)
  const diff = Math.ceil((end.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  return Math.max(diff, 0)
}

const Campaigns = () => {
  const { content } = useSiteContent()
  const { data: campaigns = [] } = useGetCampaignsQuery()

  return (
    <>
      <Helmet>
        <title>{content.campaignsPage.seoTitle}</title>
        <meta name="description" content={content.campaignsPage.seoDescription} />
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
              {content.campaignsPage.heroTitle}
            </h1>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              {content.campaignsPage.heroDescription}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign, index) => (
              <motion.div
                key={campaign._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:shadow-xl"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={campaign.image}
                    alt={campaign.title}
                    className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="mb-3 font-display text-xl font-semibold text-soft-black">
                    {campaign.title}
                  </h3>
                  <p className="mb-4 line-clamp-3 text-gray-600">{campaign.description}</p>

                  <div className="mb-4">
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="font-semibold text-orange-500">
                        {campaign.raisedAmount.toLocaleString()} $ collectés
                      </span>
                      <span className="text-gray-500">
                        Objectif: {campaign.goalAmount.toLocaleString()} $
                      </span>
                    </div>
                    <div className="mb-4 h-2.5 w-full rounded-full bg-gray-200">
                      <div
                        className="h-2.5 rounded-full bg-orange-500 transition-all duration-1000"
                        style={{
                          width: `${Math.min((campaign.raisedAmount / campaign.goalAmount) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="mb-6 flex justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {getDaysLeft(campaign.endDate)} jours restants
                    </div>
                    <span className="capitalize">{campaign.status}</span>
                  </div>

                  <Link
                    to={`/faire-un-don?type=campaign&campaignId=${campaign._id}&step=2`}
                    className="block w-full rounded-xl bg-orange-500 py-3 text-center font-semibold text-white transition-colors hover:bg-orange-600"
                  >
                    {content.campaignsPage.donateLabel}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default Campaigns
