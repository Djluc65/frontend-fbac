import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Heart, CreditCard, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useSiteContent } from '../features/siteContent/useSiteContent'

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
  const { content } = useSiteContent()
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: content.donatePage.presetAmounts[1] ?? 50,
      isMonthly: false,
    },
  })

  const selectedAmount = watch('amount')
  const isMonthly = watch('isMonthly')

  const onSubmit = async (_data: FormData) => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setSuccess(true)
    toast.success(content.donatePage.successDescription)
    setIsSubmitting(false)
  }

  if (success) {
    return (
      <>
        <Helmet>
          <title>{content.donatePage.successTitle}</title>
        </Helmet>
        <section className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 px-4 py-20">
          <div className="mx-auto max-w-lg text-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-orange-500">
                <CheckCircle2 className="h-12 w-12 text-white" />
              </div>
              <h1 className="mb-4 font-display text-3xl font-bold text-soft-black md:text-4xl">
                {content.donatePage.successTitle}
              </h1>
              <p className="mb-8 text-xl text-gray-600">{content.donatePage.successDescription}</p>
              <button
                type="button"
                onClick={() => {
                  setSuccess(false)
                  reset()
                }}
                className="rounded-full bg-orange-500 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-orange-600"
              >
                {content.donatePage.resetLabel}
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
        <title>{content.donatePage.seoTitle}</title>
        <meta name="description" content={content.donatePage.seoDescription} />
      </Helmet>

      <section className="bg-gradient-to-br from-orange-50 to-orange-100 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="mb-6 font-display text-4xl font-bold text-soft-black md:text-5xl">
              {content.donatePage.heroTitle}
            </h1>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              {content.donatePage.heroDescription}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="grid lg:grid-cols-5">
              <div className="bg-orange-500 p-8 text-white lg:col-span-2">
                <div className="mb-8 flex items-center gap-3">
                  <Heart className="h-8 w-8 fill-current" />
                  <span className="font-display text-2xl font-bold">
                    {content.donatePage.impactTitle}
                  </span>
                </div>
                <div className="space-y-6">
                  <div className="border-b border-orange-400 pb-4">
                    <div className="mb-1 font-display text-3xl font-bold">{selectedAmount} $</div>
                    <div className="text-orange-100">
                      {isMonthly ? 'par mois' : 'une fois'}
                    </div>
                  </div>
                  <div className="space-y-4">
                    {content.donatePage.impactRules
                      .filter((rule) => selectedAmount >= rule.threshold)
                      .map((rule, index) => (
                        <div key={`${rule.label}-${index}`} className="flex items-start gap-3">
                          <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0" />
                          <span>{rule.label}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="p-8 lg:col-span-3">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="mb-8 flex gap-4">
                    <button
                      type="button"
                      onClick={() => setValue('isMonthly', false)}
                      className={`flex-1 rounded-xl border-2 py-3 font-semibold transition-all ${
                        !isMonthly
                          ? 'border-orange-500 bg-orange-500 text-white'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-orange-300'
                      }`}
                    >
                      {content.donatePage.oneTimeLabel}
                    </button>
                    <button
                      type="button"
                      onClick={() => setValue('isMonthly', true)}
                      className={`flex-1 rounded-xl border-2 py-3 font-semibold transition-all ${
                        isMonthly
                          ? 'border-orange-500 bg-orange-500 text-white'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-orange-300'
                      }`}
                    >
                      {content.donatePage.monthlyLabel}
                    </button>
                  </div>

                  <div className="mb-8">
                    <label className="mb-4 block text-sm font-medium text-gray-700">
                      Choisissez un montant
                    </label>
                    <div className="mb-4 grid grid-cols-5 gap-3">
                      {content.donatePage.presetAmounts.map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => setValue('amount', amount)}
                          className={`rounded-xl border-2 py-3 font-semibold transition-all ${
                            selectedAmount === amount
                              ? 'border-orange-500 bg-orange-500 text-white'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-orange-300'
                          }`}
                        >
                          {amount} $
                        </button>
                      ))}
                    </div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        value={selectedAmount}
                        onChange={(event) => setValue('amount', parseFloat(event.target.value) || 0)}
                        className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 transition-all focus:border-transparent focus:ring-2 focus:ring-orange-500"
                        placeholder="Montant personnalisé"
                      />
                    </div>
                    {errors.amount ? <p className="mt-2 text-sm text-red-500">{errors.amount.message}</p> : null}
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-display text-xl font-semibold text-soft-black">
                      {content.donatePage.donorInfoTitle}
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Prénom</label>
                        <input
                          type="text"
                          {...register('firstName')}
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-orange-500"
                          placeholder="Prénom"
                        />
                        {errors.firstName ? (
                          <p className="mt-2 text-sm text-red-500">{errors.firstName.message}</p>
                        ) : null}
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Nom</label>
                        <input
                          type="text"
                          {...register('lastName')}
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-orange-500"
                          placeholder="Nom"
                        />
                        {errors.lastName ? (
                          <p className="mt-2 text-sm text-red-500">{errors.lastName.message}</p>
                        ) : null}
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        {...register('email')}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-orange-500"
                        placeholder="votre@email.com"
                      />
                      {errors.email ? <p className="mt-2 text-sm text-red-500">{errors.email.message}</p> : null}
                    </div>
                  </div>

                  <div className="space-y-4 border-t border-gray-100 pt-4">
                    <h3 className="flex items-center gap-2 font-display text-xl font-semibold text-soft-black">
                      <CreditCard className="h-5 w-5" />
                      {content.donatePage.paymentTitle}
                    </h3>
                    <p className="text-sm text-gray-500">{content.donatePage.paymentNotice}</p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-orange-500 py-4 font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? 'Traitement...' : content.donatePage.submitLabel}
                  </button>
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
