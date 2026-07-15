import { Helmet } from 'react-helmet-async'
import { BookOpen, Utensils, Shirt, Award, BookHeart, Users } from 'lucide-react'
import { motion } from 'framer-motion'

const Programs = () => {
  const programs = [
    {
      icon: BookOpen,
      title: 'Parrainage scolaire',
      description: 'Financer les frais de scolarité des enfants issus de familles à faible revenu. Notre programme permet à des enfants de poursuivre leur éducation sans avoir à se soucier des coûts.',
      features: ['Frais de scolarité', 'Livres et fournitures', 'Uniformes', 'Suivi scolaire']
    },
    {
      icon: Utensils,
      title: 'Programme alimentaire',
      description: 'Offrir des repas ou des programmes de nutrition aux enfants vulnérables. Un enfant bien nourri apprend mieux et reste en meilleure santé.',
      features: ['Un repas par jour', 'Nutrition équilibrée', 'Suivi de la santé', 'Éducation nutritionnelle']
    },
    {
      icon: Shirt,
      title: 'Vêtements et chaussures',
      description: 'Fournir des vêtements et des chaussures aux enfants dans le besoin. Se sentir bien dans ses vêtements contribue à la confiance en soi.',
      features: ['Uniformes scolaires', 'Vêtements adaptés', 'Chaussures', 'Kits saisonniers']
    },
    {
      icon: BookHeart,
      title: 'Matériel pédagogique',
      description: 'Mettre à disposition des livres et du matériel pédagogique pour soutenir l\'apprentissage des enfants.',
      features: ['Livres scolaires', 'Cahiers et stylos', 'Matériel artistique', 'Équipement sportif']
    },
    {
      icon: Award,
      title: 'Excellence scolaire',
      description: 'Encourager l\'excellence scolaire par des bourses d\'études et des récompenses pour motiver les élèves.',
      features: ['Bourses de mérite', 'Récompenses', 'Mentorat', 'Ateliers']
    },
    {
      icon: Users,
      title: 'Activités éducatives et culturelles',
      description: 'Organiser des activités éducatives, culturelles et sportives pour le développement holistique des enfants.',
      features: ['Ateliers culturels', 'Sports', 'Excursions', 'Événements']
    },
  ]

  return (
    <>
      <Helmet>
        <title>Nos programmes - Fondation Bien Aimé Cassis</title>
        <meta name="description" content="Découvrez nos programmes pour soutenir l'éducation et le bien-être des enfants en Haïti : parrainage scolaire, alimentation, vêtements et plus." />
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
            <h1 className="font-display text-4xl md:text-5xl font-bold text-soft-black mb-6">Nos programmes</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nous intervenons sur plusieurs axes pour assurer le développement holistique des enfants que nous accompagnons.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program, index) => {
              const Icon = program.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all"
                >
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-orange-500" />
                  </div>
                  <h3 className="font-display font-semibold text-2xl text-soft-black mb-4">{program.title}</h3>
                  <p className="text-gray-600 mb-6">{program.description}</p>
                  <ul className="space-y-2">
                    {program.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-700">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
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

      {/* Impact */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-soft-black mb-6">Notre impact</h2>
              <p className="text-gray-600 mb-6">
                Grâce à vos dons et à l'engagement de nos équipes, nous avons pu accompagner des centaines d'enfants dans leur parcours éducatif.
              </p>
              <p className="text-gray-600">
                Chaque programme est conçu pour répondre aux besoins spécifiques des communautés que nous servons, en collaboration avec les écoles et les parents.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6"
            >
              <div className="bg-white p-6 rounded-xl shadow-md text-center">
                <div className="font-display text-4xl font-bold text-orange-500 mb-2">250</div>
                <div className="text-gray-600">Enfants accompagnés</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md text-center">
                <div className="font-display text-4xl font-bold text-orange-500 mb-2">12</div>
                <div className="text-gray-600">Écoles partenaires</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md text-center">
                <div className="font-display text-4xl font-bold text-orange-500 mb-2">35k</div>
                <div className="text-gray-600">Repas servis</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md text-center">
                <div className="font-display text-4xl font-bold text-orange-500 mb-2">1.2k</div>
                <div className="text-gray-600">Kits distribués</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Programs
