import { Helmet } from 'react-helmet-async'
import { BookOpen, Utensils, Shirt, Award, BookHeart, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSiteContent } from '../features/siteContent/useSiteContent'

const programIcons = [BookOpen, Utensils, Shirt, BookHeart, Award, Users]

const Programs = () => {
  const { content } = useSiteContent()

  return (
    <>
      <Helmet>
        <title>{content.programsPage.seoTitle}</title>
        <meta name="description" content={content.programsPage.seoDescription} />
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
              {content.programsPage.heroTitle}
            </h1>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              {content.programsPage.heroDescription}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {content.programsPage.programs.map((program, index) => {
              const Icon = programIcons[index % programIcons.length]

              return (
                <motion.div
                  key={`${program.title}-${index}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="rounded-2xl bg-white p-8 shadow-md transition-all hover:shadow-xl"
                >
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                    <Icon className="h-8 w-8 text-orange-500" />
                  </div>
                  <h3 className="mb-4 font-display text-2xl font-semibold text-soft-black">
                    {program.title}
                  </h3>
                  <p className="mb-6 text-gray-600">{program.description}</p>
                  <ul className="space-y-2">
                    {program.features.map((feature, featureIndex) => (
                      <li key={`${feature}-${featureIndex}`} className="flex items-center gap-2 text-gray-700">
                        <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )
            })}
          </div>
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
                {content.programsPage.impactTitle}
              </h2>
              {content.programsPage.impactParagraphs.map((paragraph, index) => (
                <p key={index} className="mb-6 text-gray-600 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6"
            >
              {content.programsPage.impactStats.map((stat, index) => (
                <div key={`${stat.label}-${index}`} className="rounded-xl bg-white p-6 text-center shadow-md">
                  <div className="mb-2 font-display text-4xl font-bold text-orange-500">
                    {stat.value}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Programs
