import { useMemo, useState } from 'react'
import { Mail, ShieldCheck, UserCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import AdminShell from '../../components/admin/AdminShell'
import AdminCard from '../../components/admin/AdminCard'
import AvatarUploader from '../../components/admin/AvatarUploader'
import ProfileForm from '../../components/admin/ProfileForm'
import ChangePasswordForm from '../../components/admin/ChangePasswordForm'
import ActiveSessionsList from '../../components/admin/ActiveSessionsList'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import {
  useChangeAdminEmailMutation,
  useChangeAdminPasswordMutation,
  useDeleteAdminAvatarMutation,
  useGetAdminProfileQuery,
  useGetAdminSessionsQuery,
  useRevokeAdminSessionMutation,
  useRevokeOtherAdminSessionsMutation,
  useUpdateAdminProfileMutation,
  useUploadAdminAvatarMutation,
} from '../../features/admin/adminProfileApi'
import { formatRoleLabel } from '../../features/admin/adminDisplay'

const getErrorMessage = (error: unknown) => {
  if (error && typeof error === 'object' && 'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data) {
    return String(error.data.message)
  }
  return 'Une erreur est survenue.'
}

type TabId = 'profile' | 'security' | 'sessions'

interface AdminProfilePageProps {
  initialTab?: TabId
}

const AdminProfilePage = ({ initialTab = 'profile' }: AdminProfilePageProps) => {
  const [activeTab, setActiveTab] = useState<TabId>(initialTab)
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const { data, isLoading } = useGetAdminProfileQuery()
  const { data: sessionsData, isLoading: isSessionsLoading } = useGetAdminSessionsQuery()
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateAdminProfileMutation()
  const [changeEmail, { isLoading: isChangingEmail }] = useChangeAdminEmailMutation()
  const [changePassword, { isLoading: isChangingPassword }] = useChangeAdminPasswordMutation()
  const [uploadAvatar, { isLoading: isUploadingAvatar }] = useUploadAdminAvatarMutation()
  const [deleteAvatar, { isLoading: isDeletingAvatar }] = useDeleteAdminAvatarMutation()
  const [revokeSession] = useRevokeAdminSessionMutation()
  const [revokeOtherSessions, { isLoading: isRevokingOthers }] = useRevokeOtherAdminSessionsMutation()

  const user = data?.profile

  const tabs = useMemo(
    () => [
      { id: 'profile' as const, label: 'Informations personnelles' },
      { id: 'security' as const, label: 'Sécurité' },
      { id: 'sessions' as const, label: 'Sessions actives' },
    ],
    []
  )

  if (!user) {
    return (
      <AdminShell title="Mon profil" description="Gérez votre identité administrateur, votre sécurité et vos sessions.">
        <div className="rounded-[24px] bg-white p-6 shadow-panel">{isLoading ? 'Chargement...' : 'Profil introuvable.'}</div>
      </AdminShell>
    )
  }

  return (
    <AdminShell title="Mon profil" description="Gérez votre identité administrateur, votre sécurité et vos sessions.">
      <div className="space-y-4 sm:space-y-6">
        <AdminCard icon={UserCircle2} title="Compte administrateur" description="Visualisez vos informations principales et vos permissions effectives.">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Nom</p>
              <p className="mt-2 font-medium text-slate-900">{user.firstName} {user.lastName}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Rôle</p>
              <p className="mt-2 font-medium text-slate-900">{formatRoleLabel(user.role)}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Créé le</p>
              <p className="mt-2 font-medium text-slate-900">{user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'Inconnue'}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Dernière connexion</p>
              <p className="mt-2 font-medium text-slate-900">{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString('fr-FR') : 'Inconnue'}</p>
            </div>
          </div>
        </AdminCard>

        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={[
                'rounded-full px-4 py-2 text-sm font-semibold transition',
                activeTab === tab.id ? 'bg-orange-500 text-white' : 'bg-white text-slate-600 shadow-panel',
              ].join(' ')}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'profile' ? (
          <div className="space-y-4 sm:space-y-6">
            <AvatarUploader
              avatarUrl={user.avatarUrl}
              isUploading={isUploadingAvatar || isDeletingAvatar}
              onUpload={async (file) => {
                try {
                  await uploadAvatar(file).unwrap()
                  toast.success('Avatar mis à jour.')
                } catch (error) {
                  toast.error(getErrorMessage(error))
                }
              }}
              onDelete={async () => {
                try {
                  await deleteAvatar().unwrap()
                  toast.success('Avatar supprimé.')
                } catch (error) {
                  toast.error(getErrorMessage(error))
                }
              }}
            />
            <AdminCard icon={UserCircle2} title="Informations personnelles" description="Modifiez vos informations de profil et vos préférences.">
              <ProfileForm
                user={user}
                isLoading={isUpdatingProfile}
                onSubmit={async (values) => {
                  try {
                    await updateProfile(values).unwrap()
                    toast.success('Profil mis à jour.')
                  } catch (error) {
                    toast.error(getErrorMessage(error))
                  }
                }}
              />
            </AdminCard>
          </div>
        ) : null}

        {activeTab === 'security' ? (
          <div className="grid gap-4 xl:grid-cols-2">
            <AdminCard icon={Mail} title="Adresse e-mail" description="La modification de l’adresse email requiert votre mot de passe actuel.">
              <div className="space-y-4">
                <Input label="Nouvelle adresse email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
                <Input label="Mot de passe actuel" type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} />
                <Button
                  isLoading={isChangingEmail}
                  onClick={async () => {
                    try {
                      await changeEmail({ email, currentPassword }).unwrap()
                      toast.success('Adresse email mise à jour.')
                      setCurrentPassword('')
                    } catch (error) {
                      toast.error(getErrorMessage(error))
                    }
                  }}
                >
                  Mettre à jour l’email
                </Button>
              </div>
            </AdminCard>
            <AdminCard icon={ShieldCheck} title="Mot de passe" description="Renforcez la sécurité de votre compte administrateur.">
              <ChangePasswordForm
                isLoading={isChangingPassword}
                onSubmit={async (values) => {
                  try {
                    await changePassword(values).unwrap()
                    toast.success('Mot de passe modifié.')
                  } catch (error) {
                    toast.error(getErrorMessage(error))
                  }
                }}
              />
            </AdminCard>
          </div>
        ) : null}

        {activeTab === 'sessions' ? (
          <AdminCard icon={ShieldCheck} title="Sessions actives" description="Gardez le contrôle sur les navigateurs connectés à votre compte.">
            <ActiveSessionsList
              sessions={sessionsData?.items ?? []}
              isLoading={isRevokingOthers || isSessionsLoading}
              onRevokeOne={async (id) => {
                try {
                  await revokeSession(id).unwrap()
                  toast.success('Session révoquée.')
                } catch (error) {
                  toast.error(getErrorMessage(error))
                }
              }}
              onRevokeOthers={async () => {
                try {
                  await revokeOtherSessions().unwrap()
                  toast.success('Autres sessions révoquées.')
                } catch (error) {
                  toast.error(getErrorMessage(error))
                }
              }}
            />
          </AdminCard>
        ) : null}
      </div>
    </AdminShell>
  )
}

export default AdminProfilePage
