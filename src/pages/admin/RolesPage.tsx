import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Layers3, Plus } from 'lucide-react'
import AdminShell from '../../components/admin/AdminShell'
import AdminCard from '../../components/admin/AdminCard'
import PermissionBadge from '../../components/admin/PermissionBadge'
import Button from '../../components/common/Button'
import { useDeleteRoleMutation, useGetRolesQuery } from '../../features/admin/rolesApi'
import { formatRoleLabel } from '../../features/admin/adminDisplay'

const getErrorMessage = (error: unknown) => {
  if (error && typeof error === 'object' && 'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data) {
    return String(error.data.message)
  }
  return 'Une erreur est survenue.'
}

const RolesPage = () => {
  const { data, isLoading } = useGetRolesQuery()
  const [deleteRole] = useDeleteRoleMutation()

  return (
    <AdminShell
      title="Rôles"
      description="Consultez les rôles système et créez des rôles personnalisés pour l’administration."
      actions={
        <Link to="/admin/roles/nouveau">
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Nouveau rôle
          </Button>
        </Link>
      }
    >
      {isLoading ? (
        <div className="rounded-[24px] bg-white p-6 shadow-panel">Chargement des rôles...</div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {(data?.items ?? []).map((role) => (
            <AdminCard
              key={role._id}
              icon={Layers3}
              title={formatRoleLabel(role.code || role.name)}
              description={role.description || 'Aucune description pour ce rôle.'}
            >
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((permission) => (
                  <PermissionBadge key={permission} permission={permission} />
                ))}
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                {!role.isSystem ? (
                  <>
                    <Link to={`/admin/roles/${role._id}/modifier`}>
                      <Button variant="secondary" className="w-full sm:w-auto">
                        Modifier
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      onClick={async () => {
                        try {
                          await deleteRole(role._id).unwrap()
                          toast.success('Rôle supprimé.')
                        } catch (error) {
                          toast.error(getErrorMessage(error))
                        }
                      }}
                    >
                      Supprimer
                    </Button>
                  </>
                ) : (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">Rôle système</span>
                )}
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </AdminShell>
  )
}

export default RolesPage
