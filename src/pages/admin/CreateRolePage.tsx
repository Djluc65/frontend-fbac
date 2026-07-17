import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Layers3 } from 'lucide-react'
import AdminShell from '../../components/admin/AdminShell'
import AdminCard from '../../components/admin/AdminCard'
import RoleForm from '../../components/admin/RoleForm'
import { useCreateRoleMutation, useGetPermissionsQuery } from '../../features/admin/rolesApi'

const getErrorMessage = (error: unknown) => {
  if (error && typeof error === 'object' && 'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data) {
    return String(error.data.message)
  }
  return 'Une erreur est survenue.'
}

const CreateRolePage = () => {
  const navigate = useNavigate()
  const { data: permissionsData } = useGetPermissionsQuery()
  const [createRole, { isLoading }] = useCreateRoleMutation()

  return (
    <AdminShell title="Nouveau rôle" description="Créez un rôle personnalisé et définissez sa matrice de permissions.">
      <AdminCard icon={Layers3} title="Création du rôle" description="Les permissions proposées sont filtrées selon votre propre niveau d’accès.">
        <RoleForm
          permissions={permissionsData?.items ?? []}
          isLoading={isLoading}
          onSubmit={async (values) => {
            try {
              await createRole(values).unwrap()
              toast.success('Rôle créé.')
              navigate('/admin/roles')
            } catch (error) {
              toast.error(getErrorMessage(error))
            }
          }}
        />
      </AdminCard>
    </AdminShell>
  )
}

export default CreateRolePage
