import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { UserPlus2 } from 'lucide-react'
import AdminShell from '../../components/admin/AdminShell'
import AdminCard from '../../components/admin/AdminCard'
import AdministratorForm from '../../components/admin/AdministratorForm'
import { useCreateAdministratorMutation } from '../../features/admin/administratorsApi'
import { useGetPermissionsQuery, useGetRolesQuery } from '../../features/admin/rolesApi'
import type { CreateAdministratorPayload } from '../../features/admin/adminManagementTypes'

const getErrorMessage = (error: unknown) => {
  if (error && typeof error === 'object' && 'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data) {
    return String(error.data.message)
  }
  return 'Une erreur est survenue.'
}

const CreateAdministratorPage = () => {
  const navigate = useNavigate()
  const { data: rolesData } = useGetRolesQuery()
  const { data: permissionsData } = useGetPermissionsQuery()
  const [createAdministrator, { isLoading }] = useCreateAdministratorMutation()

  const roles = useMemo(
    () => (rolesData?.items ?? []).map((role) => ({ code: role.code, name: role.name })),
    [rolesData?.items]
  )

  return (
    <AdminShell title="Nouvel administrateur" description="Créez un compte administrateur avec rôle, permissions et stratégie d’accès initial.">
      <AdminCard icon={UserPlus2} title="Création du compte" description="Le compte peut être créé avec mot de passe temporaire ou invitation sécurisée.">
        <AdministratorForm
          roles={roles}
          permissions={permissionsData?.items ?? []}
          isLoading={isLoading}
          onSubmit={async (values: CreateAdministratorPayload) => {
            try {
              const response = await createAdministrator(values).unwrap()
              toast.success(response.message ?? 'Administrateur créé avec succès.')
              navigate('/admin/administrateurs')
            } catch (error) {
              toast.error(getErrorMessage(error))
            }
          }}
        />
      </AdminCard>
    </AdminShell>
  )
}

export default CreateAdministratorPage
