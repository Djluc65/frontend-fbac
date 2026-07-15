import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react'
import { z } from 'zod'
import { toast } from 'sonner'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import { useAppSelector } from '../../app/hooks'
import { useLoginMutation, useLogoutMutation } from '../../features/auth/authApi'
import { selectCanAccessAdminPanel, selectCurrentUser } from '../../features/auth/authSelectors'
import { canAccessAdminPanel } from '../../features/auth/authTypes'

const loginSchema = z.object({
  email: z.string().email('Veuillez saisir une adresse email valide'),
  password: z.string().min(6, 'Le mot de passe doit comporter au moins 6 caractères'),
})

type LoginFormValues = z.infer<typeof loginSchema>

type NavigationState = {
  from?: {
    pathname?: string
  }
}

const getErrorMessage = (error: unknown) => {
  if (!error || typeof error !== 'object') {
    return 'Une erreur est survenue. Veuillez réessayer.'
  }

  if ('data' in error && error.data && typeof error.data === 'object' && 'message' in error.data) {
    return String(error.data.message)
  }

  if ('message' in error && typeof error.message === 'string') {
    return error.message
  }

  return 'Impossible de vous connecter pour le moment.'
}

const AdminLoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const currentUser = useAppSelector(selectCurrentUser)
  const canAccess = useAppSelector(selectCanAccessAdminPanel)
  const [showPassword, setShowPassword] = useState(false)
  const [login, { isLoading }] = useLoginMutation()
  const [logout] = useLogoutMutation()

  const state = location.state as NavigationState | null
  const redirectTo = useMemo(() => state?.from?.pathname || '/admin/dashboard', [state])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  useEffect(() => {
    if (currentUser && canAccess) {
      navigate('/admin/dashboard', { replace: true })
    }
  }, [canAccess, currentUser, navigate])

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const response = await login(values).unwrap()

      if (!canAccessAdminPanel(response.user)) {
        await logout().unwrap().catch(() => undefined)
        toast.error("Ce compte n'a pas accès à l'interface d'administration.")
        return
      }

      toast.success('Connexion réussie.')
      navigate(redirectTo, { replace: true })
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <>
      <Helmet>
        <title>Connexion administrateur - Fondation Bien Aimé Cassis</title>
        <meta
          name="description"
          content="Connexion sécurisée à l'administration de la Fondation Bien Aimé Cassis."
        />
      </Helmet>

      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100 px-4 py-10">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-panel lg:grid-cols-[1.1fr_0.9fr]">
          <section className="hidden bg-gradient-to-br from-orange-600 to-orange-700 p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div className="inline-flex w-fit items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              <ShieldCheck className="h-4 w-4" />
              Fondation Bien Aimé Cassis
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-orange-100">
                  Administration sécurisée
                </p>
                <h1 className="mt-4 font-display text-4xl font-bold leading-tight">
                  Gérez la fondation depuis une interface claire et moderne.
                </h1>
              </div>
              <p className="max-w-xl text-base leading-7 text-orange-50">
                Cette connexion est réservée aux profils autorisés par le backend. Les sessions sont
                protégées via cookies HttpOnly, rafraîchissement automatique et contrôle d'accès.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 text-sm text-orange-50">
              Le backend réel utilise actuellement les routes <code>/api/auth/*</code> avec
              authentification par cookies sécurisés.
            </div>
          </section>

          <section className="p-6 sm:p-10">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-8 space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-orange-700 lg:hidden">
                  <ShieldCheck className="h-4 w-4" />
                  Fondation Bien Aimé Cassis
                </div>
                <h2 className="font-display text-3xl font-bold text-slate-900">
                  Connexion administrateur
                </h2>
                <p className="text-sm leading-6 text-slate-500">
                  Connectez-vous avec un compte disposant d'un accès à l'administration.
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
                <Input
                  id="admin-email"
                  type="email"
                  label="Adresse email"
                  placeholder="admin@fondation.ht"
                  leftIcon={<Mail className="h-5 w-5" />}
                  error={errors.email?.message}
                  autoComplete="email"
                  {...register('email')}
                />

                <Input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  label="Mot de passe"
                  placeholder="••••••••"
                  leftIcon={<Lock className="h-5 w-5" />}
                  rightElement={
                    <button
                      type="button"
                      className="rounded-md text-slate-400 transition hover:text-slate-600"
                      onClick={() => setShowPassword((current) => !current)}
                      aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  }
                  error={errors.password?.message}
                  autoComplete="current-password"
                  {...register('password')}
                />

                <div className="flex items-center justify-between gap-4">
                  <Link
                    to="/contact"
                    className="text-sm font-medium text-orange-700 transition hover:text-orange-800"
                  >
                    Mot de passe oublié ?
                  </Link>
                  <Link
                    to="/"
                    className="text-sm font-medium text-slate-500 transition hover:text-slate-700"
                  >
                    Retour au site
                  </Link>
                </div>

                <Button type="submit" fullWidth isLoading={isLoading}>
                  Se connecter
                </Button>
              </form>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}

export default AdminLoginPage
