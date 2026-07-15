import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  Heart,
  BookOpen,
  Utensils,
  Shirt,
  Award,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useGetCampaignsQuery } from '../features/campaigns/campaignApi'
import { useSiteContent } from '../features/siteContent/useSiteContent'

const programIcons = [BookOpen, Utensils, Shirt, Award]

const Home = () => {
  const { content } = useSiteContent()
  const { data: campaigns = [] } = useGetCampaignsQuery()
  const featuredCampaigns = campaigns.slice(0, 3)

  return (
    <>
      <Helmet>
        <title>{content.home.seoTitle}</title>
        <meta name="description" content={content.home.seoDescription} />
      </Helmet>

      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="mb-6 font-display text-4xl font-extrabold leading-tight text-soft-black md:text-5xl lg:text-6xl">
                {content.home.hero.titlePrefix}{' '}
                <span className="text-orange-500">{content.home.hero.titleHighlight}</span>
              </h1>
              <p className="mb-8 max-w-xl text-lg text-gray-600">{content.home.hero.description}</p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  to={content.home.hero.primaryButtonLink}
                  className="flex items-center justify-center gap-2 rounded-full bg-orange-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-orange-600 hover:shadow-xl"
                >
                  {content.home.hero.primaryButtonLabel}
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to={content.home.hero.secondaryButtonLink}
                  className="rounded-full border border-gray-200 bg-white px-8 py-4 text-center text-lg font-semibold text-soft-black shadow-md transition-all hover:bg-gray-50 hover:shadow-lg"
                >
                  {content.home.hero.secondaryButtonLabel}
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src={content.home.hero.imageUrl}
                  alt={content.home.hero.imageAlt}
                  className="h-auto w-full"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-orange-400 opacity-30" />
              <div className="absolute -right-6 -top-6 h-48 w-48 rounded-full bg-orange-200 opacity-40" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {content.home.stats.map((stat, index) => (
              <motion.div
                key={`${stat.label}-${index}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="mb-2 font-display text-4xl font-extrabold text-orange-500 md:text-5xl">
                  {stat.value}
                </div>
                <div className="font-medium text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-gray-400">{content.home.statsDisclaimer}</p>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-display text-3xl font-bold text-soft-black md:text-4xl">
              {content.home.programsSection.title}
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              {content.home.programsSection.description}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {content.home.programsSection.items.map((program, index) => {
              const Icon = programIcons[index % programIcons.length]

              return (
                <motion.div
                  key={`${program.title}-${index}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="rounded-2xl bg-white p-8 shadow-md transition-shadow hover:shadow-xl"
                >
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                    <Icon className="h-8 w-8 text-orange-500" />
                  </div>
                  <h3 className="mb-3 font-display text-xl font-semibold text-soft-black">
                    {program.title}
                  </h3>
                  <p className="text-gray-600">{program.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="mb-4 font-display text-3xl font-bold text-soft-black md:text-4xl">
                {content.home.campaignsSection.title}
              </h2>
              <p className="text-gray-600">{content.home.campaignsSection.description}</p>
            </div>
            <Link
              to={content.home.campaignsSection.allCampaignsLink}
              className="hidden items-center gap-2 font-semibold text-orange-500 hover:text-orange-600 md:flex"
            >
              {content.home.campaignsSection.allCampaignsLabel}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {featuredCampaigns.map((campaign, index) => (
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
                  <h3 className="mb-4 font-display text-xl font-semibold text-soft-black">
                    {campaign.title}
                  </h3>
                  <div className="mb-4">
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="font-semibold text-orange-500">
                        {campaign.raisedAmount.toLocaleString()} $ collectés
                      </span>
                      <span className="text-gray-500">
                        Objectif: {campaign.goalAmount.toLocaleString()} $
                      </span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-gray-200">
                      <div
                        className="h-2.5 rounded-full bg-orange-500 transition-all duration-1000"
                        style={{
                          width: `${Math.min((campaign.raisedAmount / campaign.goalAmount) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                  <Link
                    to={content.home.campaignsSection.donateLink}
                    className="block w-full rounded-xl bg-orange-500 py-3 text-center font-semibold text-white transition-colors hover:bg-orange-600"
                  >
                    {content.home.campaignsSection.donateLabel}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link
              to={content.home.campaignsSection.allCampaignsLink}
              className="inline-flex items-center gap-2 font-semibold text-orange-500 hover:text-orange-600"
            >
              {content.home.campaignsSection.allCampaignsLabel}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Heart className="mx-auto mb-6 h-16 w-16 text-white" />
            <h2 className="mb-6 font-display text-3xl font-bold text-white md:text-4xl">
              {content.home.ctaSection.title}
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-orange-100">
              {content.home.ctaSection.description}
            </p>
            <Link
              to={content.home.ctaSection.buttonLink}
              className="inline-flex items-center gap-2 rounded-full bg-white px-10 py-4 text-lg font-semibold text-orange-500 shadow-lg transition-all hover:bg-gray-100"
            >
              {content.home.ctaSection.buttonLabel}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-6 font-display text-3xl font-bold text-soft-black md:text-4xl">
                {content.home.trustSection.title}
              </h2>
              <p className="mb-8 text-gray-600">{content.home.trustSection.description}</p>
              <ul className="space-y-4">
                {content.home.trustSection.items.map((item, index) => (
                  <li key={`${item}-${index}`} className="flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-orange-500" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to={content.home.trustSection.reportLink}
                className="mt-8 inline-flex items-center gap-2 font-semibold text-orange-500 hover:text-orange-600"
              >
                {content.home.trustSection.reportLabel}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src={content.home.trustSection.imageUrl}
                alt={content.home.trustSection.imageAlt}
                className="rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
