import { useForm } from 'react-hook-form'
import Input from '../common/Input'
import Button from '../common/Button'
import type { ChangeAdminPasswordPayload } from '../../features/admin/adminManagementTypes'

interface ChangePasswordFormProps {
  onSubmit: (values: ChangeAdminPasswordPayload) => void
  isLoading?: boolean
}

const ChangePasswordForm = ({ onSubmit, isLoading = false }: ChangePasswordFormProps) => {
  const { register, handleSubmit, watch } = useForm<ChangeAdminPasswordPayload>()
  const newPassword = watch('newPassword') ?? ''
  const passwordScore = [
    /[A-Z]/.test(newPassword),
    /[a-z]/.test(newPassword),
    /[0-9]/.test(newPassword),
    /[^A-Za-z0-9]/.test(newPassword),
    newPassword.length >= 10,
  ].filter(Boolean).length

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <Input label="Mot de passe actuel" type="password" {...register('currentPassword')} />
      <Input label="Nouveau mot de passe" type="password" {...register('newPassword')} />
      <Input label="Confirmer le mot de passe" type="password" {...register('confirmPassword')} />
      <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
        Robustesse estimée: <span className="font-semibold text-slate-900">{passwordScore}/5</span>
      </div>
      <Button type="submit" isLoading={isLoading} className="w-full sm:w-auto">
        Modifier le mot de passe
      </Button>
    </form>
  )
}

export default ChangePasswordForm
