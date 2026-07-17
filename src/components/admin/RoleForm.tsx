import { useForm } from 'react-hook-form'
import Input from '../common/Input'
import Button from '../common/Button'
import PermissionMatrix from './PermissionMatrix'
import type { RolePayload } from '../../features/admin/adminManagementTypes'

interface RoleFormProps {
  defaultValues?: RolePayload
  permissions: string[]
  onSubmit: (values: RolePayload) => void
  isLoading?: boolean
}

const RoleForm = ({ defaultValues, permissions, onSubmit, isLoading = false }: RoleFormProps) => {
  const { register, handleSubmit, watch, setValue } = useForm<RolePayload>({
    defaultValues:
      defaultValues ?? {
        name: '',
        code: '',
        description: '',
        permissions: [],
        isActive: true,
      },
  })

  const selectedPermissions = watch('permissions') ?? []

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Nom du rôle" {...register('name')} />
        <Input label="Code du rôle" {...register('code')} />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">Description</label>
        <textarea
          rows={4}
          {...register('description')}
          className="block w-full rounded-xl border border-slate-200 px-3 py-3 text-base text-slate-900 shadow-sm outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100 sm:px-4 sm:text-sm"
        />
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
      <label className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
        <input type="checkbox" {...register('isActive')} className="h-4 w-4 rounded border-slate-300 text-orange-600" />
        Rôle actif
      </label>
      <Button type="submit" isLoading={isLoading} className="w-full sm:w-auto">
        Enregistrer le rôle
      </Button>
    </form>
  )
}

export default RoleForm
