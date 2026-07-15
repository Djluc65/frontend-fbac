import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Calendar, Users } from 'lucide-react'
import { motion } from 'framer-motion'

const Campaigns = () => {
  const campaigns = [
    {
      id: 1,
      title: 'Une rentrée scolaire pour 100 enfants',
      description: 'Aidez-nous à offrir une rentrée scolaire digne à 100 enfants défavorisés : frais de scolarité, fournitures et uniformes.',
      raised: 4500,
      goal: 6000,
      donors: 89,
      daysLeft: 15,
      image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=600&h=400&fit=crop'
    },
    {
      id: 2,
      title: '500 kits scolaires pour les communautés vulnérables',
      description: 'Distribuer des kits scolaires complets à 500 enfants dans les régions les plus démunies d\'Haïti.',
      raised: 3200,
      goal: 5000,
      donors: 67,
      daysLeft: 22,
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop'
    },
    {
      id: 3,
      title: 'Un repas par jour pour 200 élèves',
      description: 'Financer un programme alimentaire pour 200 élèves pendant toute l\'année scolaire.',
      raised: 5800,
      goal: 8000,
      donors: 112,
      daysLeft: 10,
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop'
    },
    {
      id: 4,
      title: 'Une bibliothèque pour une communauté',
      description: 'Créer une bibliothèque communautaire avec des livres en français, créole et anglais.',
      raised: 2100,
      goal: 4000,
      donors: 45,
      daysLeft: 30,
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop'
    },
    {
      id: 5,
      title: 'Des uniformes et chaussures pour 150 enfants',
      description: 'Offrir des uniformes scolaires et des chaussures adaptées à 150 enfants.',
      raised: 1800,
      goal: 3500,
      donors: 38,
      daysLeft: 25,
      image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&h=400&fit=crop'
    },
    {
      id: 6,
      title: 'Ordinateurs pour l\'école communautaire',
      description: 'Équiper l\'école communautaire de 10 ordinateurs pour initier les enfants au numérique.',
      raised: 3500,
      goal: 6000,
      donors: 56,
      daysLeft: 18,
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop'
    }
  ]

  return (
    <>
      <Helmet>
        <title>Nos campagnes - Fondation Bien Aimé Cassis</title>
        <meta name="description" content="Participez à nos campagnes de collecte pour aider les enfants en Haïti : rentrée scolaire, repas, kits scolaires et plus." />
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
            <h1 className="font-display text-4xl md:text-5xl font-bold text-soft-black mb-6">Nos campagnes</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choisissez une campagne qui vous parle et contribuez à faire une différence dans la vie des enfants.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Campaigns Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  <h3 className="font-display font-semibold text-xl text-soft-black mb-3">{campaign.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{campaign.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-orange-500 font-semibold">{campaign.raised.toLocaleString()} $ collectés</span>
                      <span className="text-gray-500">Objectif: {campaign.goal.toLocaleString()} $</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                      <div
                        className="bg-orange-500 h-2.5 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min((campaign.raised / campaign.goal) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {campaign.donors} donateurs
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {campaign.daysLeft} jours restants
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
        </div>
      </section>
    </>
  )
}

export default Campaigns
