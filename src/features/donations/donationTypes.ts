import type { Campaign } from '../campaigns/campaignTypes'

export type DonationType = 'general' | 'program' | 'campaign'
export type DonationFrequency = 'one_time' | 'monthly' | 'weekly' | 'yearly'
export type DonationPaymentMethod =
  | 'paypal'
  | 'card'
  | 'bank_transfer'
  | 'zelle'
  | 'cash_app'
  | 'other'
export type BackendDonationPaymentMethod =
  | 'PAYPAL'
  | 'CARD'
  | 'BANK_TRANSFER'
  | 'ZELLE'
  | 'CASH_APP'
  | 'ON_SITE'
export type DonationStatus =
  | 'DRAFT'
  | 'PENDING'
  | 'PROCESSING'
  | 'UNDER_REVIEW'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'REJECTED'
export type DonationProofStatus =
  | 'NOT_REQUIRED'
  | 'NOT_UPLOADED'
  | 'PENDING_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
export type DonationCurrency = 'USD' | 'HTG' | 'CAD' | 'EUR'
export type DonationDesignation = 'GENERAL' | 'CAMPAIGN' | 'PROGRAM'

export interface DonationPublicInstructions {
  code: BackendDonationPaymentMethod
  name: string
  description: string
  instructions?: string
  publicConfiguration?: Record<string, unknown>
}

export interface Donation {
  _id: string
  reference: string
  donor?:
    | string
    | {
        _id: string
        firstName?: string
        lastName?: string
        email?: string
        role?: string
      }
    | null
  donorFirstName: string
  donorLastName: string
  donorEmail: string
  donorPhone?: string
  donorCountry?: string
  campaign?: Campaign | null
  program?: string | null
  designation: DonationDesignation
  amount: number
  currency: DonationCurrency
  paymentMethod: BackendDonationPaymentMethod
  frequency: 'ONE_TIME' | 'MONTHLY'
  anonymous: boolean
  message?: string
  transactionReference?: string
  status: DonationStatus
  proofStatus: DonationProofStatus
  completedAt?: string | null
  cancelledAt?: string | null
  createdAt: string
  updatedAt: string
}

export interface DonationListResponse {
  items: Donation[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface CreateDonationPayload {
  donationType: DonationType
  campaign?: string
  program?: string
  amount: number
  currency: DonationCurrency
  paymentMethod: DonationPaymentMethod
  frequency: DonationFrequency
  anonymous: boolean
  message?: string
  donor?: {
    firstName: string
    lastName: string
    email: string
    phone?: string
    country?: string
  }
  transactionReference?: string
}

export interface CreateDonationResponse {
  message: string
  donation: Donation
  paymentInstructions: DonationPublicInstructions
}

export type DonationAnalyticsPeriod =
  | 'TODAY'
  | 'YESTERDAY'
  | 'LAST_7_DAYS'
  | 'LAST_30_DAYS'
  | 'THIS_MONTH'
  | 'LAST_MONTH'
  | 'THIS_YEAR'
  | 'LAST_YEAR'
  | 'CUSTOM'

export interface DonationDashboardMetric {
  current: number
  previous: number
  changePercentage: number
  trend: 'positive' | 'negative' | 'neutral'
}

export interface DonationDashboardStats {
  period: DonationAnalyticsPeriod
  range: {
    current: {
      from: string
      to: string
    }
    previous: {
      from: string
      to: string
    }
  }
  summary: Record<
    | 'totalConfirmedAmount'
    | 'totalPendingAmount'
    | 'totalRefundedAmount'
    | 'totalRejectedAmount'
    | 'donationCount'
    | 'uniqueDonorCount'
    | 'newDonorCount'
    | 'averageDonation'
    | 'medianDonation'
    | 'maxDonation'
    | 'minDonation'
    | 'recurringDonationCount'
    | 'anonymousDonationCount'
    | 'confirmationRate'
    | 'rejectionRate'
    | 'refundRate'
    | 'pendingProofCount'
    | 'activeCampaignCount'
    | 'paypalDonationCount'
    | 'bankTransferDonationCount'
    | 'zelleDonationCount'
    | 'cashAppDonationCount',
    DonationDashboardMetric
  >
}

export interface DonationChartPoint {
  label: string
  amount: number
  count: number
}

export interface DonationBreakdownItem {
  key: string
  label?: string
  amount: number
  count: number
}

export interface DonationStatisticsResponse {
  period: DonationAnalyticsPeriod
  range: DonationDashboardStats['range']
  summary: DonationDashboardStats['summary']
  series: {
    donationsByDay: DonationChartPoint[]
    donationsByWeek: DonationChartPoint[]
    donationsByMonth: DonationChartPoint[]
    donationsByYear: DonationChartPoint[]
    byPaymentMethod: DonationBreakdownItem[]
    byCurrency: DonationBreakdownItem[]
    byStatus: DonationBreakdownItem[]
    byProgram: DonationBreakdownItem[]
    byCountry: DonationBreakdownItem[]
    byCampaign: DonationBreakdownItem[]
    anonymousVsIdentified: DonationBreakdownItem[]
    oneTimeVsRecurring: DonationBreakdownItem[]
  }
}

export interface DonationAdminFilters {
  q?: string
  status?: DonationStatus
  paymentMethod?: BackendDonationPaymentMethod
  proofStatus?: DonationProofStatus
  currency?: DonationCurrency
  frequency?: Donation['frequency']
  anonymous?: boolean
  country?: string
  sortBy?: 'createdAt' | 'amount' | 'status'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface DonationAdminDetail {
  donation: Donation
  paymentProof: {
    _id: string
    paymentMethod: BackendDonationPaymentMethod
    referenceProvided?: string
    fileUrl: string
    originalFileName: string
    mimeType: string
    fileSize: number
    status: DonationProofStatus
    reviewNote?: string
    reviewedAt?: string | null
    reviewedBy?:
      | string
      | {
          _id: string
          firstName?: string
          lastName?: string
          email?: string
          role?: string
        }
      | null
  } | null
  transactions: Array<{
    _id: string
    provider: string
    providerTransactionId?: string
    internalReference: string
    amount: number
    currency: DonationCurrency
    status: DonationStatus
    providerStatus?: string
    errorCode?: string
    errorMessage?: string
    processedAt?: string | null
    createdAt: string
    updatedAt: string
  }>
  history: Array<{
    _id: string
    action: string
    paymentMethod: BackendDonationPaymentMethod
    donationReference: string
    transactionReference?: string
    actorRole?: string
    actorIp?: string
    actorEmail?: string
    note?: string
    previousDonationStatus: DonationStatus
    newDonationStatus: DonationStatus
    previousProofStatus: DonationProofStatus
    newProofStatus: DonationProofStatus
    createdAt: string
    actorUser?:
      | string
      | {
          _id: string
          firstName?: string
          lastName?: string
          email?: string
          role?: string
        }
      | null
  }>
  donorSummary: {
    totalDonations: number
    totalAmount: number
    firstDonationAt: string
    lastDonationAt: string
  }
}

export interface DonationTransactionListResponse {
  items: Array<{
    _id: string
    provider: string
    providerTransactionId?: string
    internalReference: string
    amount: number
    currency: DonationCurrency
    status: DonationStatus
    providerStatus?: string
    errorCode?: string
    errorMessage?: string
    processedAt?: string | null
    createdAt: string
    updatedAt: string
    donation?: {
      _id: string
      reference: string
      donorFirstName: string
      donorLastName: string
      donorEmail: string
      amount: number
      currency: DonationCurrency
      status: DonationStatus
      paymentMethod: BackendDonationPaymentMethod
    }
  }>
  pagination: DonationListResponse['pagination']
}

export interface DonationAuditLogListResponse {
  items: Array<{
    _id: string
    action: string
    paymentMethod: BackendDonationPaymentMethod
    donationReference: string
    transactionReference?: string
    actorRole?: string
    actorIp?: string
    actorEmail?: string
    note?: string
    previousDonationStatus: DonationStatus
    newDonationStatus: DonationStatus
    previousProofStatus: DonationProofStatus
    newProofStatus: DonationProofStatus
    createdAt: string
    actorUser?:
      | string
      | {
          _id: string
          firstName?: string
          lastName?: string
          email?: string
          role?: string
        }
      | null
    donation?: {
      _id: string
      reference: string
      donorFirstName: string
      donorLastName: string
      donorEmail: string
      amount: number
      currency: DonationCurrency
      status: DonationStatus
    }
  }>
  pagination: DonationListResponse['pagination']
}
