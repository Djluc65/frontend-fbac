import { Helmet } from 'react-helmet-async'
import { Heart, Target, Eye, Users, Award, Shield } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSiteContent } from '../features/siteContent/useSiteContent'

const valueIcons = [Heart, Shield, Users, Award]

const About = () => {
  const { content } = useSiteContent()

  return (
    <>
      <Helmet>
        <title>{content.about.seoTitle}</title>
        <meta name="description" content={content.about.seoDescription} />
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
              {content.about.heroTitle}
            </h1>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              {content.about.heroDescription}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <img
                src={content.about.storyImageUrl}
                alt={content.about.storyImageAlt}
                className="rounded-2xl shadow-xl"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-6 font-display text-3xl font-bold text-soft-black">
                {content.about.storyTitle}
              </h2>
              {content.about.storyParagraphs.map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-600 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="rounded-2xl bg-white p-8 shadow-md"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">
                <Target className="h-7 w-7 text-orange-500" />
              </div>
              <h3 className="mb-4 font-display text-2xl font-bold text-soft-black">
                {content.about.missionTitle}
              </h3>
              <p className="text-gray-600">{content.about.missionDescription}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="rounded-2xl bg-white p-8 shadow-md"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">
                <Eye className="h-7 w-7 text-orange-500" />
              </div>
              <h3 className="mb-4 font-display text-2xl font-bold text-soft-black">
                {content.about.visionTitle}
              </h3>
              <p className="text-gray-600">{content.about.visionDescription}</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-display text-3xl font-bold text-soft-black md:text-4xl">
              {content.about.valuesTitle}
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">{content.about.valuesDescription}</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {content.about.values.map((value, index) => {
              const Icon = valueIcons[index % valueIcons.length]

              return (
                <motion.div
                  key={`${value.title}-${index}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-500">
                    <Icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="mb-3 font-display text-xl font-semibold text-soft-black">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-display text-3xl font-bold text-soft-black md:text-4xl">
              {content.about.teamTitle}
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">{content.about.teamDescription}</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {content.about.team.map((member, index) => (
              <motion.div
                key={`${member.name}-${index}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="overflow-hidden rounded-2xl bg-white text-center shadow-md"
              >
                <img src={member.imageUrl} alt={member.name} className="h-64 w-full object-cover" />
                <div className="p-6">
                  <h3 className="mb-1 font-display text-xl font-semibold text-soft-black">
                    {member.name}
                  </h3>
                  <p className="font-medium text-orange-500">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default About
