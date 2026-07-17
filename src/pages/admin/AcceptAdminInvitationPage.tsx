import { useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import { useAcceptInvitationMutation } from '../../features/admin/administratorsApi'

const getErrorMessage = (error: unknown) => {
  if (error && typeof error === 'object' && 'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data) {
    return String(error.data.message)
  }
  return 'Une erreur est survenue.'
}

const AcceptAdminInvitationPage = () => {
  const [searchParams] = useSearchParams()
  const token = useMemo(() => searchParams.get('token') ?? '', [searchParams])
  const [acceptInvitation, { isLoading, isSuccess }] = useAcceptInvitationMutation()
  const { register, handleSubmit } = useForm<{ password: string }>()

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-xl rounded-[28px] bg-white p-6 shadow-panel sm:p-8">
        <h1 className="font-display text-3xl font-semibold text-slate-900">Activation du compte administrateur</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Définissez votre mot de passe pour activer votre accès à l’espace administrateur.
        </p>

        {isSuccess ? (
          <div className="mt-6 space-y-4">
            <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Votre compte a été activé avec succès.
            </p>
            <Link to="/admin/login">
              <Button>Se connecter</Button>
            </Link>
          </div>
        ) : (
          <form
            className="mt-6 space-y-4"
            onSubmit={handleSubmit(async ({ password }) => {
              try {
                await acceptInvitation({ token, password }).unwrap()
                toast.success('Compte activé avec succès.')
              } catch (error) {
                toast.error(getErrorMessage(error))
              }
            })}
          >
            <Input label="Mot de passe" type="password" {...register('password')} />
            <Button type="submit" isLoading={isLoading} className="w-full">
              Activer mon compte
            </Button>
          </form>
        )}
      </div>
    </main>
  )
}

export default AcceptAdminInvitationPage
