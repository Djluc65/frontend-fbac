import { Helmet } from 'react-helmet-async';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FileText, Download, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Transparency = () => {
  const data = [
    { name: 'Programmes éducatifs', value: 65, color: '#f97316' },
    { name: 'Programme alimentaire', value: 20, color: '#fb923c' },
    { name: 'Administration', value: 10, color: '#fdba74' },
    { name: 'Collectes', value: 5, color: '#fed7aa' },
  ];

  const reports = [
    { year: 2024, title: 'Rapport annuel 2024', download: '#', status: 'Disponible' },
    { year: 2023, title: 'Rapport annuel 2023', download: '#', status: 'Disponible' },
    { year: 2022, title: 'Rapport annuel 2022', download: '#', status: 'Disponible' },
  ];

  const principles = [
    { title: 'Utilisation responsable des fonds', description: '100% des dons sont dédiés aux programmes, moins les frais administratifs limités à 10%.' },
    { title: 'Rapports réguliers', description: 'Publication annuelle de nos rapports financiers et d\'impact.' },
    { title: 'Audit indépendant', description: 'Nos comptes sont vérifiés annuellement par un cabinet indépendant.' },
    { title: 'Suivi des bénéficiaires', description: 'Suivi individuel de chaque enfant accompagné.' },
  ];

  return (
    <>
      <Helmet>
        <title>Transparence - Fondation Bien Aimé Cassis</title>
        <meta name="description" content="Découvrez comment nous utilisons vos dons : rapports financiers, impact et transparence totale." />
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
            <h1 className="font-display text-4xl md:text-5xl font-bold text-soft-black mb-6">Transparence</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              La transparence et l'intégrité sont au cœur de notre action. Découvrez comment nous utilisons vos dons.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold text-soft-black mb-4">Nos principes</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">L'impact de vos dons.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {principles.map((principle, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-2xl shadow-md"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="font-display font-semibold text-xl text-soft-black mb-3">{principle.title}</h3>
                <p className="text-gray-600">{principle.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Allocation */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl font-bold text-soft-black mb-6">Allocation des dons</h2>
              <p className="text-gray-600 mb-6">
                Nous nous engageons à utiliser chaque don de manière responsable et efficace. Voici comment sont alloués les fonds que nous recevons.
              </p>
              <div className="space-y-4">
                {data.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-700 font-medium">{item.name}</span>
                        <span className="text-gray-700 font-bold">{item.value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-2xl shadow-md"
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Bar dataKey="value" fill="#f97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Reports */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold text-soft-black mb-4">Nos rapports</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Téléchargez nos rapports annuels pour découvrir en savoir plus sur notre impact.</p>
          </div>
          <div className="space-y-4">
            {reports.map((report, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-xl text-soft-black">{report.title}</h3>
                    <span className="text-green-600 text-sm">{report.status}</span>
                  </div>
                </div>
                <a
                  href={report.download}
                  className="flex items-center gap-2 text-orange-500 font-semibold hover:text-orange-600"
                >
                  Télécharger
                  <Download className="w-4 h-4" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 bg-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-white">
              <div className="font-display text-4xl md:text-5xl font-bold mb-2">250</div>
              <div className="text-orange-100">Enfants accompagnés</div>
            </div>
            <div className="text-white">
              <div className="font-display text-4xl md:text-5xl font-bold mb-2">35k</div>
              <div className="text-orange-100">Repas servis</div>
            </div>
            <div className="text-white">
              <div className="font-display text-4xl md:text-5xl font-bold mb-2">1.2k</div>
              <div className="text-orange-100">Kits distribués</div>
            </div>
            <div className="text-white">
              <div className="font-display text-4xl md:text-5xl font-bold mb-2">12</div>
              <div className="text-orange-100">Écoles partenaires</div>
            </div>
          </div>
          <p className="text-orange-100 text-sm mt-6">* Données de démonstration</p>
        </div>
      </section>
    </>
  );
};

export default Transparency;
