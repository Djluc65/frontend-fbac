import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Send } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import ContactLinks from '../components/common/ContactLinks'
import { useSiteContent } from '../features/siteContent/useSiteContent'

const formSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Veuillez entrer un email valide'),
  subject: z.string().min(5, 'Le sujet doit contenir au moins 5 caractères'),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
})

type FormData = z.infer<typeof formSchema>

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { content } = useSiteContent()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (_data: FormData) => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    toast.success(content.contactPage.successMessage)
    reset()
    setIsSubmitting(false)
  }

  const contactInfo = {
    address: content.contactPage.address,
    phoneDisplay: content.contactPage.phone,
    email: content.contactPage.email,
  }

  return (
    <>
      <Helmet>
        <title>{content.contactPage.seoTitle}</title>
        <meta name="description" content={content.contactPage.seoDescription} />
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
              {content.contactPage.heroTitle}
            </h1>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              {content.contactPage.heroDescription}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-6 font-display text-3xl font-bold text-soft-black">
                {content.contactPage.infoTitle}
              </h2>
              <p className="mb-8 text-gray-600">{content.contactPage.infoDescription}</p>

              <ContactLinks
                contactInfo={contactInfo}
                className="grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-3"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="rounded-2xl bg-white p-8 shadow-lg"
            >
              <h2 className="mb-6 font-display text-2xl font-bold text-soft-black">
                {content.contactPage.formTitle}
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                    Nom complet
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register('name')}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-orange-500"
                    placeholder="Votre nom"
                  />
                  {errors.name ? <p className="mt-2 text-sm text-red-500">{errors.name.message}</p> : null}
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register('email')}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-orange-500"
                    placeholder="votre@email.com"
                  />
                  {errors.email ? <p className="mt-2 text-sm text-red-500">{errors.email.message}</p> : null}
                </div>
                <div>
                  <label htmlFor="subject" className="mb-2 block text-sm font-medium text-gray-700">
                    Sujet
                  </label>
                  <input
                    id="subject"
                    type="text"
                    {...register('subject')}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-orange-500"
                    placeholder="Sujet de votre message"
                  />
                  {errors.subject ? <p className="mt-2 text-sm text-red-500">{errors.subject.message}</p> : null}
                </div>
                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    {...register('message')}
                    className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-orange-500"
                    placeholder="Votre message..."
                  />
                  {errors.message ? <p className="mt-2 text-sm text-red-500">{errors.message.message}</p> : null}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-4 font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    'Envoi en cours...'
                  ) : (
                    <>
                      {content.contactPage.submitLabel}
                      <Send className="h-5 w-5" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Contact
