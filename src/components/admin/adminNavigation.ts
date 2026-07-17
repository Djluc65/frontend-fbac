import type { LucideIcon } from 'lucide-react'
import {
  BarChart3,
  Download,
  FileBadge2,
  FilePenLine,
  LayoutDashboard,
  Layers3,
  Megaphone,
  Newspaper,
  ReceiptText,
  ScrollText,
  ShieldCheck,
  Sigma,
  UserCog2,
  UserRound,
  Wallet,
  WalletCards,
} from 'lucide-react'
import type { AdminCapabilities } from './adminPermissions'

export interface AdminNavigationItem {
  to: string
  label: string
  icon: LucideIcon
  visible: boolean
  matchPrefixes?: string[]
}

const adminNavigationConfig = (capabilities: AdminCapabilities): AdminNavigationItem[] => [
  {
    to: '/admin/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    visible: true,
  },
  {
    to: '/admin/profil',
    label: 'Mon profil',
    icon: UserRound,
    visible: true,
    matchPrefixes: ['/admin/profil/'],
  },
  {
    to: '/admin/administrateurs',
    label: 'Administrateurs',
    icon: UserCog2,
    visible: capabilities.canManageAdministrators,
    matchPrefixes: ['/admin/administrateurs/'],
  },
  {
    to: '/admin/roles',
    label: 'Rôles',
    icon: Layers3,
    visible: capabilities.canManageRoles,
    matchPrefixes: ['/admin/roles/'],
  },
  {
    to: '/admin/invitations',
    label: 'Invitations',
    icon: ShieldCheck,
    visible: capabilities.canManageAdministrators,
  },
  {
    to: '/admin/contenu',
    label: 'Gestion du contenu',
    icon: FilePenLine,
    visible: capabilities.canManageContent,
  },
  {
    to: '/admin/campagnes',
    label: 'Campagnes',
    icon: Megaphone,
    visible: capabilities.canManageCampaigns,
  },
  {
    to: '/admin/publications',
    label: 'Publications',
    icon: Newspaper,
    visible: capabilities.canManagePublications,
  },
  {
    to: '/admin/paiements',
    label: 'Paiements',
    icon: WalletCards,
    visible: capabilities.canManagePayments,
    matchPrefixes: ['/admin/settings/payment-methods'],
  },
  {
    to: '/admin/paiements/verifications',
    label: 'Vérifications',
    icon: ShieldCheck,
    visible: capabilities.canManagePayments,
    matchPrefixes: ['/admin/donations/review'],
  },
  {
    to: '/admin/donations/dashboard',
    label: 'Dons',
    icon: Wallet,
    visible: capabilities.canManagePayments,
    matchPrefixes: ['/admin/donations/'],
  },
  {
    to: '/admin/donations/transactions',
    label: 'Transactions',
    icon: ReceiptText,
    visible: capabilities.canManagePayments,
  },
  {
    to: '/admin/donations/statistics',
    label: 'Statistiques',
    icon: BarChart3,
    visible: capabilities.canManagePayments,
  },
  {
    to: '/admin/donations/simulations',
    label: 'Simulations',
    icon: Sigma,
    visible: capabilities.canManagePayments,
  },
  {
    to: '/admin/donations/reports',
    label: 'Rapports',
    icon: FileBadge2,
    visible: capabilities.canManagePayments,
  },
  {
    to: '/admin/donations/exports',
    label: 'Exports',
    icon: Download,
    visible: capabilities.canManagePayments,
  },
  {
    to: '/admin/audit-logs',
    label: 'Audit',
    icon: ScrollText,
    visible: capabilities.canManagePayments,
  },
]

export const getAdminNavigation = (capabilities: AdminCapabilities) =>
  adminNavigationConfig(capabilities).filter((item) => item.visible)

export const isAdminNavigationItemActive = (pathname: string, item: AdminNavigationItem) => {
  if (pathname === item.to || pathname.startsWith(`${item.to}/`)) {
    return true
  }

  return item.matchPrefixes?.some((prefix) => pathname.startsWith(prefix)) ?? false
}

export const getAdminQuickAccessNavigation = (capabilities: AdminCapabilities) =>
  adminNavigationConfig(capabilities)
    .filter((item) =>
      [
        '/admin/contenu',
        '/admin/administrateurs',
        '/admin/roles',
        '/admin/campagnes',
        '/admin/publications',
        '/admin/paiements',
        '/admin/paiements/verifications',
        '/admin/donations/statistics',
      ].includes(item.to)
    )
    .map((item) => {
      const metadataByRoute: Record<string, { title: string; description: string; buttonLabel: string }> = {
        '/admin/contenu': {
          title: 'Gérer le contenu',
          description: 'Textes, équipes et sections clés du site public.',
          buttonLabel: 'Ouvrir',
        },
        '/admin/administrateurs': {
          title: 'Administrateurs',
          description: 'Rôles, permissions, statuts et invitations.',
          buttonLabel: 'Gérer',
        },
        '/admin/roles': {
          title: 'Rôles',
          description: 'Matrice de permissions et rôles personnalisés.',
          buttonLabel: 'Gérer',
        },
        '/admin/campagnes': {
          title: 'Campagnes',
          description: 'Collectes, visuels, objectifs et périodes.',
          buttonLabel: 'Ouvrir',
        },
        '/admin/publications': {
          title: 'Publications',
          description: 'Actualités, brouillons, mises en avant et images.',
          buttonLabel: 'Ouvrir',
        },
        '/admin/paiements': {
          title: 'Paiements',
          description: 'Activation des moyens de paiement et consignes.',
          buttonLabel: 'Ouvrir',
        },
        '/admin/paiements/verifications': {
          title: 'Vérifications',
          description: 'Contrôle des preuves de paiement manuel.',
          buttonLabel: 'Ouvrir',
        },
        '/admin/donations/statistics': {
          title: 'Statistiques',
          description: 'Analyse de collecte, tendances et performance.',
          buttonLabel: 'Ouvrir',
        },
      }

      return {
        ...item,
        ...metadataByRoute[item.to],
      }
    })
