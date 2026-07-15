import { Helmet } from 'react-helmet-async'
import { Heart, Target, Eye, Users, Award, Shield } from 'lucide-react'
import { motion } from 'framer-motion'

const About = () => {
  const values = [
    { icon: Heart, title: 'Amour', description: 'Nous agissons avec amour et compassion envers chaque enfant.' },
    { icon: Shield, title: 'Intégrité', description: 'La transparence et l\'honnêteté guident toutes nos actions.' },
    { icon: Users, title: 'Solidarité', description: 'Nous croyons en la force de la communauté et de l\'entraide.' },
    { icon: Award, title: 'Excellence', description: 'Nous visons l\'excellence dans tous nos programmes éducatifs.' },
  ]

  const team = [
    { name: 'Jean Dupont', role: 'Président', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop' },
    { name: 'Marie Laurent', role: 'Directrice Générale', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop' },
    { name: 'Pierre Bernard', role: 'Responsable Programmes', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop' },
  ]

  return (
    <>
      <Helmet>
        <title>À propos - Fondation Bien Aimé Cassis</title>
        <meta name="description" content="Découvrez notre mission, notre vision et nos valeurs. Nous nous engageons pour l'éducation des enfants en Haïti." />
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 to-orange-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-soft-black mb-6">Notre histoire</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fondée avec amour et détermination, la Fondation Bien Aimé Cassis œuvre pour un avenir meilleur pour les enfants d'Haïti.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <img
                src="https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=600&h=500&fit=crop"
                alt="Notre histoire"
                className="rounded-2xl shadow-xl"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl font-bold text-soft-black mb-6">Qui sommes-nous ?</h2>
              <p className="text-gray-600 mb-4">
                La Fondation Bien Aimé Cassis est une organisation à but non lucratif qui œuvre pour améliorer les conditions de vie des enfants défavorisés en Haïti.
              </p>
              <p className="text-gray-600 mb-4">
                Depuis notre création, nous nous engageons à offrir à chaque enfant accès à l'éducation, à une alimentation saine et aux ressources essentielles nécessaires à leur développement personnel et à leur réussite scolaire.
              </p>
              <p className="text-gray-600">
                Notre équipe dévouée travaille au quotidien pour construire un avenir où chaque enfant haïtien, indépendamment de sa situation économique, a la possibilité de réaliser son plein potentiel.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-md"
            >
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-orange-500" />
              </div>
              <h3 className="font-display text-2xl font-bold text-soft-black mb-4">Notre mission</h3>
              <p className="text-gray-600">
                Améliorer les conditions de vie des enfants défavorisés en Haïti en leur donnant accès à l'éducation, à une alimentation saine et aux ressources essentielles nécessaires à leur développement personnel et à leur réussite scolaire.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-md"
            >
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-orange-500" />
              </div>
              <h3 className="font-display text-2xl font-bold text-soft-black mb-4">Notre vision</h3>
              <p className="text-gray-600">
                Construire un avenir où chaque enfant haïtien, indépendamment de sa situation économique, a la possibilité d'aller à l'école, de se nourrir convenablement et de réaliser pleinement son potentiel.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-soft-black mb-4">Nos valeurs</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Les principes qui guident notre action au quotidien.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="font-display font-semibold text-xl text-soft-black mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-soft-black mb-4">Notre équipe</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Des personnes dévouées qui œuvrent pour le bien-être des enfants.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-md overflow-hidden text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="font-display font-semibold text-xl text-soft-black mb-1">{member.name}</h3>
                  <p className="text-orange-500 font-medium">{member.role}</p>
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
