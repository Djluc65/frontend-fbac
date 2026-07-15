import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Heart, BookOpen, Utensils, Shirt, Award, ArrowRight, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'

const Home = () => {
  const stats = [
    { number: '250', label: 'Enfants accompagnés' },
    { number: '1 200', label: 'Kits distribués' },
    { number: '35 000', label: 'Repas servis' },
    { number: '80', label: 'Bénévoles' },
  ]

  const programs = [
    { icon: BookOpen, title: 'Parrainage scolaire', description: 'Financer les frais de scolarité, les livres et les fournitures pour les enfants défavorisés.' },
    { icon: Utensils, title: 'Programme alimentaire', description: 'Offrir un repas par jour aux élèves pour favoriser leur concentration et leur santé.' },
    { icon: Shirt, title: 'Vêtements et chaussures', description: 'Distribuer des uniformes, des vêtements et des chaussures adaptés.' },
    { icon: Award, title: 'Excellence scolaire', description: 'Récompenser les élèves méritants avec des bourses et des encouragements.' },
  ]

  const campaigns = [
    { id: 1, title: 'Une rentrée scolaire pour 100 enfants', raised: 4500, goal: 6000, image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=600&h=400&fit=crop' },
    { id: 2, title: '500 kits scolaires pour les communautés vulnérables', raised: 3200, goal: 5000, image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop' },
    { id: 3, title: 'Un repas par jour pour 200 élèves', raised: 5800, goal: 8000, image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop' },
  ]

  return (
    <>
      <Helmet>
        <title>Fondation Bien Aimé Cassis - Accueil</title>
        <meta name="description" content="Nous aidons les enfants vulnérables d'Haïti à accéder à l'école, à une alimentation suffisante et aux ressources nécessaires à leur développement." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 to-orange-100 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-soft-black leading-tight mb-6">
                L'éducation, la dignité et l'espoir pour{' '}
                <span className="text-orange-500">chaque enfant</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-xl">
                Nous aidons les enfants vulnérables d'Haïti à accéder à l'école, à une alimentation suffisante, aux livres, aux vêtements et aux fournitures nécessaires à leur développement.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/faire-un-don"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  Faire un don
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/a-propos"
                  className="bg-white hover:bg-gray-50 text-soft-black px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-md hover:shadow-lg border border-gray-200"
                >
                  En savoir plus
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=600&fit=crop"
                  alt="Enfants apprenant en classe"
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-orange-400 rounded-full opacity-30"></div>
              <div className="absolute -top-6 -right-6 w-48 h-48 bg-orange-200 rounded-full opacity-40"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="font-display text-4xl md:text-5xl font-extrabold text-orange-500 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-gray-400 text-sm mt-6">* Données de démonstration</p>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-soft-black mb-4">Nos programmes</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Nous intervenons sur plusieurs axes pour assurer le bien-être et l'éducation des enfants.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {programs.map((program, index) => {
              const Icon = program.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow"
                >
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-orange-500" />
                  </div>
                  <h3 className="font-display font-semibold text-xl text-soft-black mb-3">{program.title}</h3>
                  <p className="text-gray-600">{program.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Campaigns Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-soft-black mb-4">Nos campagnes</h2>
              <p className="text-gray-600">Participez à nos collectes pour faire une différence.</p>
            </div>
            <Link
              to="/campagnes"
              className="hidden md:flex items-center gap-2 text-orange-500 font-semibold hover:text-orange-600"
            >
              Voir toutes les campagnes
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {campaigns.map((campaign, index) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={campaign.image}
                    alt={campaign.title}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display font-semibold text-xl text-soft-black mb-4">{campaign.title}</h3>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-orange-500 font-semibold">{campaign.raised.toLocaleString()} $ collectés</span>
                      <span className="text-gray-500">Objectif: {campaign.goal.toLocaleString()} $</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-orange-500 h-2.5 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min((campaign.raised / campaign.goal) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <Link
                    to="/faire-un-don"
                    className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition-colors"
                  >
                    Faire un don
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link
              to="/campagnes"
              className="inline-flex items-center gap-2 text-orange-500 font-semibold hover:text-orange-600"
            >
              Voir toutes les campagnes
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Heart className="w-16 h-16 text-white mx-auto mb-6" />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">
              Ensemble, nous pouvons changer des vies
            </h2>
            <p className="text-orange-100 text-lg mb-8 max-w-2xl mx-auto">
              Chaque don, petit ou grand, contribue à offrir un avenir meilleur à un enfant en Haïti. Rejoignez-nous dans cette mission de solidarité.
            </p>
            <Link
              to="/faire-un-don"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-orange-500 px-10 py-4 rounded-full font-semibold text-lg transition-all shadow-lg"
            >
              Devenez un donateur aujourd'hui
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-soft-black mb-6">
                Pourquoi nous faire confiance ?
              </h2>
              <p className="text-gray-600 mb-8">
                La transparence et l'intégrité sont au cœur de notre action. Nous nous engageons à utiliser chaque don de manière responsable et à rendre compte de nos actions.
              </p>
              <ul className="space-y-4">
                {[
                  '100% des dons dédiés aux programmes',
                  'Rapports financiers publics',
                  'Équipe locale engagée',
                  'Partenariats avec des écoles vérifiées',
                  'Suivi individuel des bénéficiaires',
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-orange-500 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/transparence"
                className="inline-flex items-center gap-2 mt-8 text-orange-500 font-semibold hover:text-orange-600"
              >
                Voir nos rapports
                <ArrowRight className="w-5 h-5" />
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
                src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=500&fit=crop"
                alt="Équipe de la fondation"
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
