import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Calendar, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useGetPublicNewsQuery } from '../features/news/newsApi'
import { useSiteContent } from '../features/siteContent/useSiteContent'

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))

const News = () => {
  const { content } = useSiteContent()
  const { data: news = [] } = useGetPublicNewsQuery()

  return (
    <>
      <Helmet>
        <title>{content.newsPage.seoTitle}</title>
        <meta name="description" content={content.newsPage.seoDescription} />
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
              {content.newsPage.heroTitle}
            </h1>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              {content.newsPage.heroDescription}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {news.map((item, index) => (
              <motion.article
                key={item._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:shadow-xl"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <div className="mb-3 flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    {formatDate(item.createdAt)}
                  </div>
                  <h2 className="mb-3 font-display text-xl font-semibold text-soft-black transition-colors group-hover:text-orange-500">
                    {item.title}
                  </h2>
                  <p className="mb-4 text-gray-600">{item.excerpt}</p>
                  <Link
                    to="#"
                    className="inline-flex items-center gap-2 font-semibold text-orange-500 hover:text-orange-600"
                  >
                    {content.newsPage.readMoreLabel}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default News
