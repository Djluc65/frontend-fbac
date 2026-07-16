import { baseApi } from '../../services/baseApi'
import type {
  DonationAdminDetail,
  DonationAdminFilters,
  DonationAuditLogListResponse,
  DonationDashboardStats,
  DonationListResponse,
  DonationStatisticsResponse,
  DonationTransactionListResponse,
} from './donationTypes'

type AnalyticsArgs = {
  period?: string
  startDate?: string
  endDate?: string
}

export const donationsAdminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DonationDashboardStats, AnalyticsArgs | void>({
      query: (params) => ({
        url: '/admin/donations/dashboard',
        method: 'GET',
        params: params ?? undefined,
      }),
      providesTags: [{ type: 'DashboardStats', id: 'DONATIONS' }],
    }),
    getDonationStatistics: builder.query<DonationStatisticsResponse, AnalyticsArgs | void>({
      query: (params) => ({
        url: '/admin/donations/statistics',
        method: 'GET',
        params: params ?? undefined,
      }),
      providesTags: [{ type: 'DashboardStats', id: 'DONATION_STATISTICS' }],
    }),
    getAdminDonations: builder.query<DonationListResponse, DonationAdminFilters | void>({
      query: (params) => ({
        url: '/admin/donations',
        method: 'GET',
        params: params ?? undefined,
      }),
      providesTags: (result) =>
        result
          ? [
              { type: 'DonationList', id: 'ADMIN_LIST' },
              ...result.items.map((donation) => ({ type: 'Donation' as const, id: donation._id })),
            ]
          : [{ type: 'DonationList', id: 'ADMIN_LIST' }],
    }),
    getAdminDonationById: builder.query<DonationAdminDetail, string>({
      query: (id) => ({
        url: `/admin/donations/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Donation', id }],
    }),
    getTransactions: builder.query<
      DonationTransactionListResponse,
      { q?: string; status?: string; paymentMethod?: string; page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: '/admin/transactions',
        method: 'GET',
        params: params ?? undefined,
      }),
      providesTags: [{ type: 'DonationList', id: 'TRANSACTIONS' }],
    }),
    getAuditLogs: builder.query<
      DonationAuditLogListResponse,
      { q?: string; action?: string; paymentMethod?: string; page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: '/admin/audit-logs',
        method: 'GET',
        params: params ?? undefined,
      }),
      providesTags: [{ type: 'DonationList', id: 'AUDIT_LOGS' }],
    }),
  }),
})

export const {
  useGetAdminDonationByIdQuery,
  useGetAdminDonationsQuery,
  useGetAuditLogsQuery,
  useGetDashboardStatsQuery,
  useGetDonationStatisticsQuery,
  useGetTransactionsQuery,
} = donationsAdminApi
