import type { CreateDonationPayload, CreateDonationResponse } from '../donations/donationTypes'

export const PAYMENT_METHOD_IDS = [
  'PAYPAL',
  'CARD',
  'BANK_TRANSFER',
  'ZELLE',
  'CASH_APP',
  'ON_SITE',
] as const

export type PaymentMethodId = (typeof PAYMENT_METHOD_IDS)[number]

export type PaymentAvailability = 'available' | 'coming_soon'

export interface PaymentMethodOption {
  id: PaymentMethodId
  code: PaymentMethodId
  name: string
  description: string
  enabled: boolean
  availability: PaymentAvailability
  badgeLabel: string
  brandAccent: string
  helperText?: string
  displayOrder?: number
  iconUrl?: string
  instructions?: string
  publicConfiguration?: Record<string, unknown>
}

export interface PaymentProofRecord {
  _id: string
  donation: string | Record<string, unknown>
  paymentMethod: PaymentMethodId
  referenceProvided?: string
  fileUrl: string
  filePublicId?: string
  originalFileName: string
  mimeType: string
  fileSize: number
  status: 'NOT_REQUIRED' | 'NOT_UPLOADED' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED'
  reviewNote?: string
  uploadedBy?: string | Record<string, unknown> | null
  reviewedBy?: string | Record<string, unknown> | null
  reviewedAt?: string | null
  createdAt: string
  updatedAt: string
}

export interface PaginatedPaymentProofResponse {
  items: PaymentProofRecord[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface PaymentProofUploadResult {
  fileName: string
  previewUrl: string
  mimeType: string
  fileSize: number
  file: File
}

export interface PaymentState {
  selectedMethod: PaymentMethodId | null
  methods: PaymentMethodOption[]
  proofFile: PaymentProofUploadResult | null
}

export interface CreateDonationFromPaymentWizardPayload
  extends Omit<CreateDonationPayload, 'paymentMethod'> {
  paymentMethod: PaymentMethodId
  transactionReference?: string
}

export interface UploadProofPayload {
  donationId: string
  referenceProvided?: string
  file: File
}

export interface SubmitManualPaymentPayload {
  donationId: string
  reference: string
  file: File
}

export interface ManualPaymentStatusResponse {
  donationId: string
  reference: string
  paymentMethod: PaymentMethodId
  donationStatus:
    | 'DRAFT'
    | 'PENDING'
    | 'PROCESSING'
    | 'UNDER_REVIEW'
    | 'COMPLETED'
    | 'FAILED'
    | 'CANCELLED'
    | 'REFUNDED'
    | 'REJECTED'
  proofStatus: 'NOT_REQUIRED' | 'NOT_UPLOADED' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED'
  transactionReference?: string | null
  amount: number
  currency: 'USD' | 'HTG' | 'CAD' | 'EUR'
  createdAt: string
  updatedAt: string
  proof: {
    _id: string
    referenceProvided?: string | null
    fileUrl: string
    originalFileName: string
    mimeType: string
    fileSize: number
    status: 'NOT_REQUIRED' | 'NOT_UPLOADED' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED'
    reviewNote?: string | null
    reviewedAt?: string | null
  } | null
  history: Array<{
    _id: string
    action: 'MANUAL_PAYMENT_SUBMITTED' | 'PAYMENT_PROOF_APPROVED' | 'PAYMENT_PROOF_REJECTED'
    paymentMethod: PaymentMethodId
    donationReference: string
    transactionReference?: string | null
    actorIp?: string | null
    actorEmail?: string | null
    actorRole?: string | null
    administrator?: {
      _id: string
      firstName?: string
      lastName?: string
      email?: string
      role?: string
    } | null
    previousDonationStatus: string
    newDonationStatus: string
    previousProofStatus: string
    newProofStatus: string
    note?: string | null
    createdAt: string
  }>
}

export interface ReviewPaymentProofPayload {
  proofId: string
  status: 'APPROVED' | 'REJECTED'
  reviewNote?: string
}

export interface ApprovePaymentProofPayload {
  proofId: string
  reviewNote?: string
}

export interface RejectPaymentProofPayload {
  proofId: string
  reason: string
}

export interface UpdatePaymentMethodPayload {
  id: string
  name?: string
  description?: string
  enabled?: boolean
  displayOrder?: number
  iconUrl?: string
  instructions?: string
  publicConfiguration?: Record<string, unknown>
}

export interface UpdateAdminDonationStatusPayload {
  donationId: string
  status:
    | 'DRAFT'
    | 'PENDING'
    | 'PROCESSING'
    | 'UNDER_REVIEW'
    | 'COMPLETED'
    | 'FAILED'
    | 'CANCELLED'
    | 'REFUNDED'
    | 'REJECTED'
  reviewNote?: string
}

export type PaymentDonationResponse = CreateDonationResponse

export const PAYMENT_METHOD_TO_DONATION_METHOD: Record<
  PaymentMethodId,
  CreateDonationPayload['paymentMethod']
> = {
  PAYPAL: 'paypal',
  CARD: 'card',
  BANK_TRANSFER: 'bank_transfer',
  ZELLE: 'zelle',
  CASH_APP: 'cash_app',
  ON_SITE: 'other',
}

export const DEFAULT_PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    id: 'PAYPAL',
    code: 'PAYPAL',
    name: 'PayPal',
    description: 'Paiement sécurisé avec votre compte PayPal ou votre carte bancaire.',
    enabled: true,
    availability: 'available',
    badgeLabel: 'Disponible',
    brandAccent: 'from-[#0070BA] to-[#003087]',
    helperText: 'Paiement sécurisé par PayPal.',
  },
  {
    id: 'CARD',
    code: 'CARD',
    name: 'Carte bancaire',
    description: 'Paiement sécurisé par carte bancaire.',
    enabled: false,
    availability: 'coming_soon',
    badgeLabel: 'Bientôt disponible',
    brandAccent: 'from-slate-700 to-slate-900',
    helperText: 'Visa et Mastercard seront activées dans la phase suivante.',
  },
  {
    id: 'BANK_TRANSFER',
    code: 'BANK_TRANSFER',
    name: 'Virement bancaire',
    description: 'Effectuez un virement sur le compte officiel de la fondation.',
    enabled: true,
    availability: 'available',
    badgeLabel: 'Disponible',
    brandAccent: 'from-orange-500 to-orange-700',
  },
  {
    id: 'ZELLE',
    code: 'ZELLE',
    name: 'Zelle',
    description: 'Paiement rapide via Zelle.',
    enabled: true,
    availability: 'available',
    badgeLabel: 'Disponible',
    brandAccent: 'from-violet-500 to-fuchsia-600',
  },
  {
    id: 'CASH_APP',
    code: 'CASH_APP',
    name: 'Cash App',
    description: 'Faire un don avec Cash App.',
    enabled: true,
    availability: 'available',
    badgeLabel: 'Disponible',
    brandAccent: 'from-emerald-500 to-green-600',
  },
  {
    id: 'ON_SITE',
    code: 'ON_SITE',
    name: 'Paiement sur place',
    description: 'Je souhaite remettre mon don directement à la fondation.',
    enabled: true,
    availability: 'available',
    badgeLabel: 'Disponible',
    brandAccent: 'from-amber-500 to-orange-600',
  },
]
