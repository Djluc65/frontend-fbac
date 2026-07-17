import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { MailPlus } from 'lucide-react'
import AdminShell from '../../components/admin/AdminShell'
import AdminCard from '../../components/admin/AdminCard'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import RoleSelector from '../../components/admin/RoleSelector'
import PermissionMatrix from '../../components/admin/PermissionMatrix'
import { useCreateInvitationMutation, useGetInvitationsQuery, useResendInvitationMutation, useRevokeInvitationMutation } from '../../features/admin/administratorsApi'
import { useGetPermissionsQuery, useGetRolesQuery } from '../../features/admin/rolesApi'
import type { CreateInvitationPayload } from '../../features/admin/adminManagementTypes'
import { formatInvitationStatusLabel, formatRoleLabel } from '../../features/admin/adminDisplay'

const getErrorMessage = (error: unknown) => {
  if (error && typeof error === 'object' && 'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data) {
    return String(error.data.message)
  }
  return 'Une erreur est survenue.'
}

const InvitationsPage = () => {
  const { data } = useGetInvitationsQuery()
  const { data: rolesData } = useGetRolesQuery()
  const { data: permissionsData } = useGetPermissionsQuery()
  const [createInvitation, { isLoading }] = useCreateInvitationMutation()
  const [resendInvitation] = useResendInvitationMutation()
  const [revokeInvitation] = useRevokeInvitationMutation()
  const { register, handleSubmit, watch, setValue, reset } = useForm<CreateInvitationPayload>({
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      role: '',
      permissions: [],
      preferredLanguage: 'fr',
      timezone: 'America/Port-au-Prince',
    },
  })

  const selectedPermissions = watch('permissions') ?? []

  return (
    <AdminShell title="Invitations" description="Invitez de nouveaux administrateurs à activer leur compte de manière sécurisée.">
      <div className="space-y-4 sm:space-y-6">
        <AdminCard icon={MailPlus} title="Nouvelle invitation" description="Le lien retourné peut être utilisé directement ou envoyé par email.">
          <form
            className="space-y-4"
            onSubmit={handleSubmit(async (values) => {
              try {
                const response = await createInvitation(values).unwrap()
                toast.success(response.message ?? 'Invitation créée.')
                reset()
              } catch (error) {
                toast.error(getErrorMessage(error))
              }
            })}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Prénom" {...register('firstName')} />
              <Input label="Nom" {...register('lastName')} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Email" type="email" {...register('email')} />
              <RoleSelector
                value={watch('role')}
                roles={(rolesData?.items ?? []).map((role) => ({ code: role.code, name: role.name }))}
                onChange={(value) => setValue('role', value, { shouldDirty: true })}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Langue préférée" {...register('preferredLanguage')} />
              <Input label="Fuseau horaire" {...register('timezone')} />
            </div>
            <PermissionMatrix
              permissions={permissionsData?.items ?? []}
              selectedPermissions={selectedPermissions}
              onToggle={(permission) => {
                const nextPermissions = selectedPermissions.includes(permission)
                  ? selectedPermissions.filter((item) => item !== permission)
                  : [...selectedPermissions, permission]
                setValue('permissions', nextPermissions, { shouldDirty: true })
              }}
            />
            <Button type="submit" isLoading={isLoading} className="w-full sm:w-auto">
              Créer l’invitation
            </Button>
          </form>
        </AdminCard>

        <AdminCard icon={MailPlus} title="Invitations en cours" description="Renvoyez ou révoquez une invitation avant acceptation.">
          <div className="space-y-3">
            {(data?.items ?? []).map((invitation) => (
              <article key={invitation._id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900">{invitation.firstName} {invitation.lastName}</p>
                    <p className="break-all text-sm text-slate-500">{invitation.email}</p>
                    <p className="text-xs text-slate-400">
                      {formatRoleLabel(invitation.role)} • {formatInvitationStatusLabel(invitation.status)} • expire le{' '}
                      {new Date(invitation.expiresAt).toLocaleString('fr-FR')}
                    </p>
                    {invitation.activationLink ? (
                      <p className="mt-2 break-all text-xs text-orange-600">{invitation.activationLink}</p>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button
                      variant="secondary"
                      onClick={async () => {
                        try {
                          const response = await resendInvitation(invitation._id).unwrap()
                          toast.success(response.message ?? 'Invitation renvoyée.')
                        } catch (error) {
                          toast.error(getErrorMessage(error))
                        }
                      }}
                    >
                      Renvoyer
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={async () => {
                        try {
                          await revokeInvitation(invitation._id).unwrap()
                          toast.success('Invitation révoquée.')
                        } catch (error) {
                          toast.error(getErrorMessage(error))
                        }
                      }}
                    >
                      Révoquer
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </AdminCard>
      </div>
    </AdminShell>
  )
}

export default InvitationsPage
