import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Heart, CreditCard, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

const formSchema = z.object({
  amount: z.number().min(5, 'Le montant minimum est de 5 $'),
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Veuillez entrer un email valide'),
  isMonthly: z.boolean().default(false),
})

type FormData = z.infer<typeof formSchema>

const Donate = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 50,
      isMonthly: false,
    }
  })

  const selectedAmount = watch('amount')
  const isMonthly = watch('isMonthly')

  const presetAmounts = [25, 50, 100, 200, 500]

  const onSubmit = async (_data: FormData) => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setSuccess(true)
    toast.success('Merci pour votre don ! Votre contribution va changer des vies.')
    setIsSubmitting(false)
  }

  if (success) {
    return (
      <>
        <Helmet>
          <title>Merci - Fondation Bien Aimé Cassis</title>
        </Helmet>
        <section className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center py-20 px-4">
          <div className="max-w-lg mx-auto text-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-soft-black mb-4">Merci pour votre don !</h1>
              <p className="text-xl text-gray-600 mb-8">
                Votre générosité va changer la vie d'enfants en Haïti. Un email de confirmation vous a été envoyé.
              </p>
              <button
                onClick={() => {
                  setSuccess(false)
                  reset()
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-colors"
              >
                Faire un autre don
              </button>
            </motion.div>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>Faire un don - Fondation Bien Aimé Cassis</title>
        <meta name="description" content="Faites un don pour aider les enfants en Haïti. Chaque contribution compte !" />
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 to-orange-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-soft-black mb-6">Faire un don</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Votre soutien permet de transformer la vie des enfants en Haïti. Chaque don, petit ou grand, compte.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Donation Form */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid lg:grid-cols-5">
              {/* Info Sidebar */}
              <div className="lg:col-span-2 bg-orange-500 p-8 text-white">
                <div className="flex items-center gap-3 mb-8">
                  <Heart className="w-8 h-8 fill-current" />
                  <span className="font-display font-bold text-2xl">Votre impact</span>
                </div>
                <div className="space-y-6">
                  <div className="border-b border-orange-400 pb-4">
                    <div className="text-3xl font-display font-bold mb-1">{selectedAmount} $</div>
                    <div className="text-orange-100">{isMonthly ? 'par mois' : 'une fois'}</div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Ce que votre don permet :</h3>
                    {selectedAmount >= 25 && (
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span>Kit scolaire pour un enfant</span>
                      </div>
                    )}
                    {selectedAmount >= 50 && (
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span>Uniforme, chaussures et sac scolaire</span>
                      </div>
                    )}
                    {selectedAmount >= 100 && (
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span>Soutien alimentaire pour un enfant pendant 3 mois</span>
                      </div>
                    )}
                    {selectedAmount >= 200 && (
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span>Parrainage scolaire complet pour un enfant pendant 6 mois</span>
                      </div>
                    )}
                    {selectedAmount >= 500 && (
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span>Accompagnement de plusieurs enfants pendant une année</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="lg:col-span-3 p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Frequency */}
                  <div className="flex gap-4 mb-8">
                    <button
                      type="button"
                      onClick={() => setValue('isMonthly', false)}
                      className={`flex-1 py-3 rounded-xl font-semibold transition-all border-2 ${
                        !isMonthly ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      Une fois
                    </button>
                    <button
                      type="button"
                      onClick={() => setValue('isMonthly', true)}
                      className={`flex-1 py-3 rounded-xl font-semibold transition-all border-2 ${
                        isMonthly ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      Mensuel
                    </button>
                  </div>

                  {/* Amount Selection */}
                  <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-4">Choisissez un montant</label>
                    <div className="grid grid-cols-5 gap-3 mb-4">
                      {presetAmounts.map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => setValue('amount', amount)}
                          className={`py-3 rounded-xl font-semibold transition-all border-2 ${
                            selectedAmount === amount ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300'
                          }`}
                        >
                          {amount} $
                        </button>
                      ))}
                    </div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
                      <input
                        type="number"
                        value={selectedAmount}
                        onChange={(e) => setValue('amount', parseFloat(e.target.value) || 0)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="Montant personnalisé"
                      />
                    </div>
                    {errors.amount && <p className="text-red-500 text-sm mt-2">{errors.amount.message}</p>}
                  </div>

                  {/* Personal Info */}
                  <div className="space-y-4">
                    <h3 className="font-display font-semibold text-xl text-soft-black">Vos informations</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                        <input
                          type="text"
                          {...register('firstName')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                          placeholder="Prénom"
                        />
                        {errors.firstName && <p className="text-red-500 text-sm mt-2">{errors.firstName.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                        <input
                          type="text"
                          {...register('lastName')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                          placeholder="Nom"
                        />
                        {errors.lastName && <p className="text-red-500 text-sm mt-2">{errors.lastName.message}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        {...register('email')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="votre@email.com"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email.message}</p>}
                    </div>
                  </div>

                  {/* Payment Info (Placeholder) */}
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <h3 className="font-display font-semibold text-xl text-soft-black flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Paiement
                    </h3>
                    <p className="text-gray-500 text-sm">
                      (Ceci est une démonstration. Aucun paiement réel ne sera effectué.)
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      'Traitement en cours...'
                    ) : (
                      <>
                        <Heart className="w-5 h-5 fill-current" />
                        Donner {selectedAmount} $
                      </>
                    )}
                  </button>

                  <p className="text-center text-gray-500 text-sm">
                    Vos données sont sécurisées et ne seront jamais partagées.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Donate
