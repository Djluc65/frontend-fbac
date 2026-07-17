import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { UserCog } from 'lucide-react'
import AdminShell from '../../components/admin/AdminShell'
import AdminCard from '../../components/admin/AdminCard'
import AdministratorForm from '../../components/admin/AdministratorForm'
import { useGetAdministratorByIdQuery, useUpdateAdministratorMutation } from '../../features/admin/administratorsApi'
import { useGetPermissionsQuery, useGetRolesQuery } from '../../features/admin/rolesApi'

const getErrorMessage = (error: unknown) => {
  if (error && typeof error === 'object' && 'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data) {
    return String(error.data.message)
  }
  return 'Une erreur est survenue.'
}

const EditAdministratorPage = () => {
  const navigate = useNavigate()
  const { id = '' } = useParams<{ id: string }>()
  const { data } = useGetAdministratorByIdQuery(id, { skip: !id })
  const { data: rolesData } = useGetRolesQuery()
  const { data: permissionsData } = useGetPermissionsQuery()
  const [updateAdministrator, { isLoading }] = useUpdateAdministratorMutation()

  const roles = useMemo(
    () => (rolesData?.items ?? []).map((role) => ({ code: role.code, name: role.name })),
    [rolesData?.items]
  )

  if (!data?.administrator) {
    return (
      <AdminShell title="Modifier un administrateur" description="Mettez à jour les informations d’un compte administratif.">
        <div className="rounded-[24px] bg-white p-6 shadow-panel">Administrateur introuvable.</div>
      </AdminShell>
    )
  }

  return (
    <AdminShell title="Modifier un administrateur" description="Mettez à jour le rôle, les permissions et les informations d’un compte administratif.">
      <AdminCard icon={UserCog} title="Édition du compte" description="Les permissions sont filtrées selon votre propre niveau d’accès.">
        <AdministratorForm
          isEditMode
          roles={roles}
          permissions={permissionsData?.items ?? []}
          isLoading={isLoading}
          defaultValues={{
            firstName: data.administrator.firstName,
            lastName: data.administrator.lastName,
            email: data.administrator.email,
            phone: data.administrator.phone ?? '',
            role: data.administrator.role,
            permissions: data.administrator.permissions ?? [],
            isActive: data.administrator.isActive ?? true,
            isVerified: data.administrator.isVerified,
            preferredLanguage: data.administrator.preferredLanguage ?? 'fr',
            timezone: data.administrator.timezone ?? 'America/Port-au-Prince',
            passwordMode: 'invitation',
            password: '',
          }}
          onSubmit={async (values) => {
            try {
              await updateAdministrator({
                id,
                body: values,
              }).unwrap()
              toast.success('Administrateur mis à jour.')
              navigate(`/admin/administrateurs/${id}`)
            } catch (error) {
              toast.error(getErrorMessage(error))
            }
          }}
        />
      </AdminCard>
    </AdminShell>
  )
}

export default EditAdministratorPage
