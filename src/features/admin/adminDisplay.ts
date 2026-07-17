const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super administrateur',
  admin: 'Administrateur',
  manager: 'Responsable',
  finance_manager: 'Responsable finance',
  donations_manager: 'Responsable des dons',
  content_editor: 'Editeur de contenu',
  beneficiary_manager: 'Responsable des beneficiaires',
  content_manager: 'Responsable du contenu',
  campaign_manager: 'Responsable des campagnes',
  editor: 'Editeur',
  reviewer: 'Relecteur',
  support_manager: 'Responsable support',
  benefactor: 'Bienfaiteur',
  user: 'Utilisateur',
}

const PERMISSION_GROUP_LABELS: Record<string, string> = {
  users: 'Utilisateurs',
  admins: 'Administrateurs',
  staff: 'Equipe administrative',
  content: 'Contenu',
  campaigns: 'Campagnes',
  news: 'Actualites',
  donations: 'Dons',
  payments: 'Paiements',
  reports: 'Rapports',
  audit: 'Audit',
  settings: 'Parametres',
  roles: 'Roles',
  dashboard: 'Tableau de bord',
  beneficiaries: 'Beneficiaires',
}

const PERMISSION_LABELS: Record<string, string> = {
  '*': 'Acces complet',
  'users.read': 'Consulter les utilisateurs',
  'users.create': 'Creer des utilisateurs',
  'users.update': 'Modifier les utilisateurs',
  'users.delete': 'Supprimer les utilisateurs',
  'admins.read': 'Consulter les administrateurs',
  'admins.create': 'Creer des administrateurs',
  'admins.update': 'Modifier les administrateurs',
  'admins.disable': 'Desactiver des administrateurs',
  'admins.delete': 'Supprimer des administrateurs',
  'admins.assign_roles': 'Attribuer des roles',
  'admins.assign_permissions': 'Attribuer des permissions',
  'admins.revoke_sessions': 'Revoquer des sessions admin',
  'staff.manage': 'Gerer les comptes du staff',
  'content.read': 'Consulter le contenu',
  'content.manage': 'Gerer le contenu',
  'campaigns.read': 'Consulter les campagnes',
  'campaigns.manage': 'Gerer les campagnes',
  'news.read': 'Consulter les actualites',
  'news.create': 'Creer des actualites',
  'news.update': 'Modifier les actualites',
  'news.delete': 'Supprimer des actualites',
  'news.publish': 'Publier les actualites',
  'donations.read': 'Consulter les dons',
  'donations.manage': 'Gerer les dons',
  'donations.approve': 'Approuver les dons',
  'donations.reject': 'Rejeter les dons',
  'donations.refund': 'Rembourser les dons',
  'donations.export': 'Exporter les dons',
  'payments.read': 'Consulter les paiements',
  'payments.manage': 'Gerer les paiements',
  'payments.verify': 'Verifier les paiements',
  'reports.read': 'Consulter les rapports',
  'reports.export': 'Exporter les rapports',
  'audit.read': 'Consulter les journaux d audit',
  'settings.read': 'Consulter les parametres',
  'settings.manage': 'Gerer les parametres',
  'roles.read': 'Consulter les roles',
  'roles.create': 'Creer des roles',
  'roles.update': 'Modifier les roles',
  'roles.delete': 'Supprimer les roles',
  'dashboard.read': 'Acceder au tableau de bord',
  'beneficiaries.manage': 'Gerer les beneficiaires',
}

const INVITATION_STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  accepted: 'Acceptee',
  expired: 'Expiree',
  revoked: 'Revoquee',
}

const AUDIT_ACTION_LABELS: Record<string, string> = {
  AUTH_SESSION_REVOKED: 'Session revoquee',
  AUTH_ALL_SESSIONS_REVOKED: 'Toutes les sessions revoquees',
  AUTH_OTHER_SESSIONS_REVOKED: 'Autres sessions revoquees',
  ADMIN_ROLE_CREATED: 'Role cree',
  ADMIN_ROLE_UPDATED: 'Role mis a jour',
  ADMIN_ROLE_DELETED: 'Role supprime',
  ADMIN_ACCOUNT_CREATED: 'Compte administrateur cree',
  ADMIN_ACCOUNT_UPDATED: 'Compte administrateur mis a jour',
  ADMIN_ACCOUNT_ROLE_UPDATED: 'Role administrateur mis a jour',
  ADMIN_ACCOUNT_PERMISSIONS_UPDATED: 'Permissions administrateur mises a jour',
  ADMIN_ACCOUNT_DISABLED: 'Compte administrateur desactive',
  ADMIN_PASSWORD_RESET_SENT: 'Reinitialisation du mot de passe demandee',
  ADMIN_ACCOUNT_SESSIONS_REVOKED: 'Sessions administrateur revoquees',
  ADMIN_ACCOUNT_ARCHIVED: 'Compte administrateur archive',
  ADMIN_INVITATION_CREATED: 'Invitation admin creee',
  ADMIN_INVITATION_RESENT: 'Invitation admin renvoyee',
  ADMIN_INVITATION_REVOKED: 'Invitation admin revoquee',
  ADMIN_INVITATION_ACCEPTED: 'Invitation admin acceptee',
  ADMIN_PROFILE_UPDATED: 'Profil administrateur mis a jour',
  ADMIN_EMAIL_CHANGED: 'Adresse email modifiee',
  ADMIN_PASSWORD_CHANGED: 'Mot de passe modifie',
  ADMIN_AVATAR_UPDATED: 'Avatar mis a jour',
  ADMIN_AVATAR_REMOVED: 'Avatar supprime',
  ADMIN_PROFILE_SESSION_REVOKED: 'Session du profil revoquee',
  ADMIN_PROFILE_OTHER_SESSIONS_REVOKED: 'Autres sessions du profil revoquees',
}

const capitalizeFirst = (value: string) => (value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : value)

const humanizeTechnicalLabel = (value: string) =>
  capitalizeFirst(
    value
      .replace(/[._]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  )

export const formatRoleLabel = (role?: string | null) => {
  if (!role) {
    return ''
  }

  return ROLE_LABELS[role] ?? humanizeTechnicalLabel(role)
}

export const formatPermissionLabel = (permission?: string | null) => {
  if (!permission) {
    return ''
  }

  return PERMISSION_LABELS[permission] ?? (permission.includes('.') || permission.includes('_') ? humanizeTechnicalLabel(permission) : permission)
}

export const formatPermissionGroupLabel = (group?: string | null) => {
  if (!group) {
    return ''
  }

  return PERMISSION_GROUP_LABELS[group] ?? humanizeTechnicalLabel(group)
}

export const formatInvitationStatusLabel = (status?: string | null) => {
  if (!status) {
    return ''
  }

  return INVITATION_STATUS_LABELS[status] ?? humanizeTechnicalLabel(status)
}

export const formatAuditActionLabel = (action?: string | null) => {
  if (!action) {
    return ''
  }

  return AUDIT_ACTION_LABELS[action] ?? humanizeTechnicalLabel(action)
}
