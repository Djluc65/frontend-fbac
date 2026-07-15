import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { User, Mail, Lock, Eye, EyeOff, UserPlus, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import BrandLogo from '../../components/common/BrandLogo'

const formSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Veuillez entrer un email valide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
})

type FormData = z.infer<typeof formSchema>

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (_data: FormData) => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setSuccess(true)
    toast.success('Compte créé avec succès !')
    setIsSubmitting(false)
  }

  if (success) {
    return (
      <>
        <Helmet>
          <title>Inscription réussie - Fondation Bien Aimé Cassis</title>
        </Helmet>
        <section className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center py-20 px-4">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl sm:p-8"
          >
            <BrandLogo
              to="/"
              className="mb-5 inline-flex max-w-full justify-center"
              imageClassName="max-w-[170px] sm:max-w-[210px]"
            />
            <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="font-display text-2xl font-bold text-soft-black mb-4">Compte créé avec succès !</h1>
            <p className="text-gray-600 mb-8">
              Votre compte a été créé. Vous pouvez maintenant vous connecter.
            </p>
            <Link
              to="/connexion"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-semibold transition-colors"
            >
              Se connecter
            </Link>
          </motion.div>
        </section>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>Inscription - Fondation Bien Aimé Cassis</title>
      </Helmet>
      <section className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8"
        >
          <div className="text-center mb-8">
            <BrandLogo
              to="/"
              className="mb-5 inline-flex max-w-full justify-center"
              imageClassName="max-w-[170px] sm:max-w-[210px]"
            />
            <h1 className="font-display text-3xl font-bold text-soft-black mb-2">Créer un compte</h1>
            <p className="text-gray-600">Rejoignez notre communauté de donateurs</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="firstName"
                    {...register('firstName')}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="Prénom"
                  />
                </div>
                {errors.firstName && <p className="text-red-500 text-sm mt-2">{errors.firstName.message}</p>}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="lastName"
                    {...register('lastName')}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="Nom"
                  />
                </div>
                {errors.lastName && <p className="text-red-500 text-sm mt-2">{errors.lastName.message}</p>}
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  {...register('email')}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="votre@email.com"
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  {...register('password')}
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-2">{errors.password.message}</p>}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirmer le mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  {...register('confirmPassword')}
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-2">{errors.confirmPassword.message}</p>}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                'Création en cours...'
              ) : (
                <>
                  Créer un compte
                  <UserPlus className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Déjà un compte ?{' '}
              <Link to="/connexion" className="text-orange-500 font-semibold hover:text-orange-600">
                Se connecter
              </Link>
            </p>
          </div>
        </motion.div>
      </section>
    </>
  )
}

export default Register
