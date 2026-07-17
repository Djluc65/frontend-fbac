export const hasPermission = (permissions: string[] | undefined, required: string[]) => {
  if (!permissions?.length) {
    return false
  }

  if (permissions.includes('*')) {
    return true
  }

  return required.some((permission) => permissions.includes(permission))
}

export const getAdminCapabilities = (permissions: string[] | undefined) => ({
  canManageCampaigns: hasPermission(permissions, ['campaigns.manage']),
  canManagePublications: hasPermission(permissions, ['news.create', 'news.update', 'news.delete']),
  canManageContent: hasPermission(permissions, ['content.manage']),
  canManagePayments: hasPermission(permissions, ['donations.manage', 'donations.read']),
})

export type AdminCapabilities = ReturnType<typeof getAdminCapabilities>
