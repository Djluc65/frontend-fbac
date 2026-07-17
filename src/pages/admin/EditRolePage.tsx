import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Layers3 } from 'lucide-react'
import AdminShell from '../../components/admin/AdminShell'
import AdminCard from '../../components/admin/AdminCard'
import RoleForm from '../../components/admin/RoleForm'
import { useGetPermissionsQuery, useGetRoleByIdQuery, useUpdateRoleMutation } from '../../features/admin/rolesApi'

const getErrorMessage = (error: unknown) => {
  if (error && typeof error === 'object' && 'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data) {
    return String(error.data.message)
  }
  return 'Une erreur est survenue.'
}

const EditRolePage = () => {
  const navigate = useNavigate()
  const { id = '' } = useParams<{ id: string }>()
  const { data } = useGetRoleByIdQuery(id, { skip: !id })
  const { data: permissionsData } = useGetPermissionsQuery()
  const [updateRole, { isLoading }] = useUpdateRoleMutation()

  if (!data?.role) {
    return (
      <AdminShell title="Modifier un rôle" description="Mettez à jour un rôle personnalisé et ses permissions.">
        <div className="rounded-[24px] bg-white p-6 shadow-panel">Rôle introuvable.</div>
      </AdminShell>
    )
  }

  return (
    <AdminShell title="Modifier un rôle" description="Mettez à jour un rôle personnalisé et ses permissions.">
      <AdminCard icon={Layers3} title="Édition du rôle" description="Les rôles système restent en lecture seule.">
        <RoleForm
          permissions={permissionsData?.items ?? []}
          isLoading={isLoading}
          defaultValues={{
            name: data.role.name,
            code: data.role.code,
            description: data.role.description,
            permissions: data.role.permissions,
            isActive: data.role.isActive,
          }}
          onSubmit={async (values) => {
            try {
              await updateRole({
                id,
                body: values,
              }).unwrap()
              toast.success('Rôle mis à jour.')
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

export default EditRolePage
