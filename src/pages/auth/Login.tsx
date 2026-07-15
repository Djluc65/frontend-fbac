import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import BrandLogo from '../../components/common/BrandLogo'

const formSchema = z.object({
  email: z.string().email('Veuillez entrer un email valide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
})

type FormData = z.infer<typeof formSchema>

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (_data: FormData) => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    toast.success('Connexion réussie ! Bienvenue.')
    setIsSubmitting(false)
  }

  return (
    <>
      <Helmet>
        <title>Connexion - Fondation Bien Aimé Cassis</title>
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
            <h1 className="font-display text-3xl font-bold text-soft-black mb-2">Connexion</h1>
            <p className="text-gray-600">Accédez à votre espace personnel</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                'Connexion en cours...'
              ) : (
                <>
                  Se connecter
                  <LogIn className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Pas encore de compte ?{' '}
              <Link to="/inscription" className="text-orange-500 font-semibold hover:text-orange-600">
                Créer un compte
              </Link>
            </p>
          </div>
        </motion.div>
      </section>
    </>
  )
}

export default Login
