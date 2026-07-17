import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, UserPlus2 } from 'lucide-react'
import { toast } from 'sonner'
import AdminShell from '../../components/admin/AdminShell'
import AdminCard from '../../components/admin/AdminCard'
import AdministratorTable from '../../components/admin/AdministratorTable'
import AdministratorCard from '../../components/admin/AdministratorCard'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import { useGetAdministratorsQuery, useUpdateAdministratorStatusMutation } from '../../features/admin/administratorsApi'
import { formatRoleLabel } from '../../features/admin/adminDisplay'

const getErrorMessage = (error: unknown) => {
  if (error && typeof error === 'object' && 'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data) {
    return String(error.data.message)
  }
  return 'Une erreur est survenue.'
}

const AdministratorsPage = () => {
  const [search, setSearch] = useState('')
  const { data, isLoading } = useGetAdministratorsQuery()
  const [updateStatus] = useUpdateAdministratorStatusMutation()

  const filteredAdministrators = useMemo(
    () =>
      (data?.items ?? []).filter((administrator) =>
        `${administrator.firstName} ${administrator.lastName} ${administrator.email} ${administrator.role} ${formatRoleLabel(administrator.role)}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [data?.items, search]
  )

  return (
    <AdminShell
      title="Administrateurs"
      description="Créez, filtrez et contrôlez les comptes administratifs avec leurs rôles et permissions."
      actions={
        <Link to="/admin/administrateurs/nouveau">
          <Button className="w-full sm:w-auto">
            <UserPlus2 className="h-4 w-4" />
            Nouvel administrateur
          </Button>
        </Link>
      }
    >
      <div className="space-y-4 sm:space-y-6">
        <AdminCard icon={ShieldCheck} title="Gestion des comptes" description="Consultez les profils actifs, leur rôle et leur statut.">
          <Input label="Recherche" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Nom, email, rôle..." />
        </AdminCard>

        {isLoading ? (
          <div className="rounded-[24px] bg-white p-6 shadow-panel">Chargement des administrateurs...</div>
        ) : (
          <>
            <div className="hidden xl:block">
              <AdministratorTable
                administrators={filteredAdministrators}
                onToggleStatus={async (administrator) => {
                  try {
                    await updateStatus({
                      id: administrator._id,
                      isActive: !administrator.isActive,
                    }).unwrap()
                    toast.success('Statut administrateur mis à jour.')
                  } catch (error) {
                    toast.error(getErrorMessage(error))
                  }
                }}
              />
            </div>
            <div className="grid gap-4 xl:hidden">
              {filteredAdministrators.map((administrator) => (
                <AdministratorCard
                  key={administrator._id}
                  administrator={administrator}
                  onToggleStatus={async (targetAdministrator) => {
                    try {
                      await updateStatus({
                        id: targetAdministrator._id,
                        isActive: !targetAdministrator.isActive,
                      }).unwrap()
                      toast.success('Statut administrateur mis à jour.')
                    } catch (error) {
                      toast.error(getErrorMessage(error))
                    }
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </AdminShell>
  )
}

export default AdministratorsPage
