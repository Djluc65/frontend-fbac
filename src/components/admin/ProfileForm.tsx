import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Input from '../common/Input'
import Button from '../common/Button'
import type { User } from '../../types/user'
import type { UpdateAdminProfilePayload } from '../../features/admin/adminManagementTypes'

interface ProfileFormProps {
  user: User
  onSubmit: (values: UpdateAdminProfilePayload) => void
  isLoading?: boolean
}

const ProfileForm = ({ user, onSubmit, isLoading = false }: ProfileFormProps) => {
  const { register, handleSubmit, reset } = useForm<UpdateAdminProfilePayload>({
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone ?? '',
      preferredLanguage: user.preferredLanguage ?? 'fr',
      timezone: user.timezone ?? 'America/Port-au-Prince',
      notificationPreferences: {
        email: user.notificationPreferences?.email ?? true,
        security: user.notificationPreferences?.security ?? true,
        donations: user.notificationPreferences?.donations ?? true,
        content: user.notificationPreferences?.content ?? true,
      },
    },
  })

  useEffect(() => {
    reset({
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone ?? '',
      preferredLanguage: user.preferredLanguage ?? 'fr',
      timezone: user.timezone ?? 'America/Port-au-Prince',
      notificationPreferences: {
        email: user.notificationPreferences?.email ?? true,
        security: user.notificationPreferences?.security ?? true,
        donations: user.notificationPreferences?.donations ?? true,
        content: user.notificationPreferences?.content ?? true,
      },
    })
  }, [reset, user])

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Prénom" {...register('firstName')} />
        <Input label="Nom" {...register('lastName')} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Téléphone" {...register('phone')} />
        <Input label="Langue préférée" {...register('preferredLanguage')} />
      </div>
      <Input label="Fuseau horaire" {...register('timezone')} />
      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
        <h3 className="text-sm font-semibold text-slate-900">Préférences de notification</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {[
            ['notificationPreferences.email', 'Emails'],
            ['notificationPreferences.security', 'Sécurité'],
            ['notificationPreferences.donations', 'Dons'],
            ['notificationPreferences.content', 'Contenu'],
          ].map(([name, label]) => (
            <label key={name} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm text-slate-700">
              <input type="checkbox" {...register(name as keyof UpdateAdminProfilePayload)} className="h-4 w-4 rounded border-slate-300 text-orange-600" />
              {label}
            </label>
          ))}
        </div>
      </div>
      <Button type="submit" isLoading={isLoading} className="w-full sm:w-auto">
        Enregistrer le profil
      </Button>
    </form>
  )
}

export default ProfileForm
