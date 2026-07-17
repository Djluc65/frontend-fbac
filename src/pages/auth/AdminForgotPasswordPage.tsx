import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, RotateCcw } from 'lucide-react'
import { z } from 'zod'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import AuthCard from '../../components/auth/AuthCard'
import AuthStatusMessage from '../../components/auth/AuthStatusMessage'
import { useForgotAdminPasswordMutation } from '../../features/auth/authApi'

const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email('Veuillez saisir une adresse email valide'),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

const getErrorMessage = (error: unknown) => {
  if (!error || typeof error !== 'object') {
    return "Impossible d'envoyer le lien pour le moment."
  }

  if ('data' in error && error.data && typeof error.data === 'object' && 'message' in error.data) {
    return String(error.data.message)
  }

  if ('message' in error && typeof error.message === 'string') {
    return error.message
  }

  return "Impossible d'envoyer le lien pour le moment."
}

const genericSuccessMessage =
  'Si un compte correspondant existe, un lien de reinitialisation a ete envoye.'

const AdminForgotPasswordPage = () => {
  const [forgotAdminPassword, { isLoading }] = useForgotAdminPasswordMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const [status, setStatus] = useState<{ tone: 'success' | 'error'; message: string } | null>(null)

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      const response = await forgotAdminPassword(values).unwrap()
      setStatus({
        tone: 'success',
        message: response.message || genericSuccessMessage,
      })
    } catch (error) {
      setStatus({
        tone: 'error',
        message: getErrorMessage(error),
      })
    }
  }

  return (
    <>
      <Helmet>
        <title>Mot de passe oublie - Administration Fondation Bien Aime Cassis</title>
        <meta
          name="description"
          content="Demandez un lien securise pour reinitialiser le mot de passe de votre compte administrateur."
        />
      </Helmet>

      <AuthCard
        title="Mot de passe oublie"
        description="Entrez l'adresse email associee a votre compte administrateur. Si ce compte existe, vous recevrez un lien securise permettant de definir un nouveau mot de passe."
        footer={
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
            <Link to="/admin/login" className="font-medium text-orange-700 transition hover:text-orange-800">
              Retour a la connexion
            </Link>
            <Link to="/" className="font-medium text-slate-500 transition hover:text-slate-700">
              Retour au site
            </Link>
          </div>
        }
      >
        <div className="space-y-5">
          <AuthStatusMessage
            tone="info"
            message="Pour votre securite, nous affichons toujours une reponse generique. Verifiez aussi votre dossier spam si besoin."
          />

          {status ? <AuthStatusMessage tone={status.tone} message={status.message} /> : null}

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Input
              id="forgot-password-email"
              type="email"
              label="Adresse email"
              placeholder="admin@fondation.ht"
              leftIcon={<Mail className="h-5 w-5" />}
              error={errors.email?.message}
              autoComplete="email"
              autoFocus
              {...register('email')}
            />

            <Button type="submit" fullWidth isLoading={isLoading}>
              Envoyer le lien de reinitialisation
            </Button>
          </form>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            <div className="flex items-start gap-3">
              <RotateCcw className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
              <p className="min-w-0 break-words">
                Le lien de reinitialisation est temporaire et ne peut etre utilise qu'une seule fois.
              </p>
            </div>
          </div>
        </div>
      </AuthCard>
    </>
  )
}

export default AdminForgotPasswordPage
