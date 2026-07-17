import { useForm } from 'react-hook-form'
import Input from '../common/Input'
import Button from '../common/Button'
import RoleSelector from './RoleSelector'
import PermissionMatrix from './PermissionMatrix'
import type { CreateAdministratorPayload } from '../../features/admin/adminManagementTypes'

interface AdministratorFormProps {
  defaultValues?: CreateAdministratorPayload
  roles: Array<{ code: string; name: string }>
  permissions: string[]
  onSubmit: (values: CreateAdministratorPayload) => void
  isLoading?: boolean
  isEditMode?: boolean
}

const defaultAdministratorValues: CreateAdministratorPayload = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: '',
  permissions: [],
  isActive: true,
  isVerified: true,
  preferredLanguage: 'fr',
  timezone: 'America/Port-au-Prince',
  passwordMode: 'invitation',
  password: '',
}

const AdministratorForm = ({
  defaultValues,
  roles,
  permissions,
  onSubmit,
  isLoading = false,
  isEditMode = false,
}: AdministratorFormProps) => {
  const { register, handleSubmit, watch, setValue } = useForm<CreateAdministratorPayload>({
    values: defaultValues ?? defaultAdministratorValues,
  })

  const selectedPermissions = watch('permissions') ?? []
  const passwordMode = watch('passwordMode')

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Prénom" {...register('firstName')} />
        <Input label="Nom" {...register('lastName')} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Email" type="email" {...register('email')} disabled={isEditMode} />
        <Input label="Téléphone" {...register('phone')} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <RoleSelector value={watch('role')} roles={roles} onChange={(value) => setValue('role', value, { shouldDirty: true })} />
        <Input label="Fuseau horaire" {...register('timezone')} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Langue préférée" {...register('preferredLanguage')} />
        {!isEditMode ? (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Méthode de mot de passe</label>
            <select
              value={passwordMode}
              onChange={(event) => setValue('passwordMode', event.target.value as CreateAdministratorPayload['passwordMode'])}
              className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base text-slate-900 shadow-sm outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100 sm:px-4 sm:text-sm"
            >
              <option value="invitation">Invitation sécurisée</option>
              <option value="temporary_password">Mot de passe temporaire</option>
              <option value="set_password_now">Définir maintenant</option>
            </select>
          </div>
        ) : null}
      </div>
      {!isEditMode && passwordMode === 'set_password_now' ? (
        <Input label="Mot de passe initial" type="password" {...register('password')} />
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
          <input type="checkbox" {...register('isActive')} className="h-4 w-4 rounded border-slate-300 text-orange-600" />
          Compte actif
        </label>
        <label className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
          <input type="checkbox" {...register('isVerified')} className="h-4 w-4 rounded border-slate-300 text-orange-600" />
          Compte vérifié
        </label>
      </div>
      <PermissionMatrix
        permissions={permissions}
        selectedPermissions={selectedPermissions}
        onToggle={(permission) => {
          const nextPermissions = selectedPermissions.includes(permission)
            ? selectedPermissions.filter((item) => item !== permission)
            : [...selectedPermissions, permission]
          setValue('permissions', nextPermissions, { shouldDirty: true })
        }}
      />
      <Button type="submit" isLoading={isLoading} className="w-full sm:w-auto">
        {isEditMode ? "Mettre à jour l'administrateur" : "Créer l'administrateur"}
      </Button>
    </form>
  )
}

export default AdministratorForm
