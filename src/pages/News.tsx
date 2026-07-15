import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Calendar, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

const News = () => {
  const news = [
    {
      id: 1,
      title: 'Distribution de 200 kits scolaires dans la région de Port-au-Prince',
      excerpt: 'Nous avons eu la joie de distribuer 200 kits scolaires complets aux enfants de l\'école communautaire de Cité Soleil.',
      date: '15 décembre 2024',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop'
    },
    {
      id: 2,
      title: 'Lancement du programme alimentaire dans 3 écoles partenaires',
      excerpt: 'Notre nouveau programme alimentaire est maintenant opérationnel dans 3 écoles, offrant un repas par jour à 200 élèves.',
      date: '1 décembre 2024',
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop'
    },
    {
      id: 3,
      title: 'Rentrée scolaire : 100 enfants parrainés cette année',
      excerpt: 'Grâce à votre générosité, 100 enfants ont pu commencer l\'année scolaire dans de bonnes conditions.',
      date: '15 septembre 2024',
      image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=600&h=400&fit=crop'
    },
    {
      id: 4,
      title: 'Renforcement des capacités des enseignants',
      excerpt: 'Organisation d\'un atelier de formation pour 30 enseignants sur les nouvelles méthodes pédagogiques.',
      date: '20 août 2024',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=400&fit=crop'
    },
    {
      id: 5,
      title: 'Inauguration de la bibliothèque communautaire',
      excerpt: 'Notre première bibliothèque communautaire est maintenant accessible aux enfants et aux parents.',
      date: '10 juillet 2024',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop'
    },
    {
      id: 6,
      title: 'Campagne de collecte de vêtements réussie',
      excerpt: 'Merci à tous nos donateurs pour cette belle collecte : 500 vêtements et 150 paires de chaussures distribuées !',
      date: '5 juin 2024',
      image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&h=400&fit=crop'
    }
  ]

  return (
    <>
      <Helmet>
        <title>Actualités - Fondation Bien Aimé Cassis</title>
        <meta name="description" content="Découvrez nos dernières actualités et l'impact de vos dons sur la vie des enfants en Haïti." />
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
            <h1 className="font-display text-4xl md:text-5xl font-bold text-soft-black mb-6">Actualités</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Suivez nos dernières nouvelles et découvrez l'impact de votre générosité.
            </p>
          </motion.div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                    <Calendar className="w-4 h-4" />
                    {item.date}
                  </div>
                  <h2 className="font-display font-semibold text-xl text-soft-black mb-3 group-hover:text-orange-500 transition-colors">
                    {item.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{item.excerpt}</p>
                  <Link
                    to="#"
                    className="inline-flex items-center gap-2 text-orange-500 font-semibold hover:text-orange-600"
                  >
                    Lire la suite
                    <ArrowRight className="w-4 h-4" />
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
