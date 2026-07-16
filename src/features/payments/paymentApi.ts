import { baseApi } from '../../services/baseApi'
import type { CreateDonationPayload } from '../donations/donationTypes'
import type {
  ApprovePaymentProofPayload,
  CreateDonationFromPaymentWizardPayload,
  ManualPaymentStatusResponse,
  PaginatedPaymentProofResponse,
  PaymentDonationResponse,
  PaymentMethodOption,
  PaymentProofUploadResult,
  RejectPaymentProofPayload,
  ReviewPaymentProofPayload,
  SubmitManualPaymentPayload,
  UpdateAdminDonationStatusPayload,
  UpdatePaymentMethodPayload,
  UploadProofPayload,
} from './paymentTypes'
import {
  DEFAULT_PAYMENT_METHODS,
  PAYMENT_METHOD_TO_DONATION_METHOD,
  type PaymentMethodId,
} from './paymentTypes'

const brandAccentByMethod: Record<PaymentMethodId, string> = {
  PAYPAL: 'from-[#0070BA] to-[#003087]',
  CARD: 'from-slate-700 to-slate-900',
  BANK_TRANSFER: 'from-orange-500 to-orange-700',
  ZELLE: 'from-violet-500 to-fuchsia-600',
  CASH_APP: 'from-emerald-500 to-green-600',
  ON_SITE: 'from-amber-500 to-orange-600',
}

const toPaymentMethodOption = (method: {
  id?: string
  code?: string
  name: string
  description: string
  enabled: boolean
  displayOrder?: number
  iconUrl?: string
  instructions?: string
  publicConfiguration?: Record<string, unknown>
}): PaymentMethodOption => {
  const methodId = (method.code ?? method.id ?? 'ON_SITE') as PaymentMethodId
  const fallbackMethod = DEFAULT_PAYMENT_METHODS.find((item) => item.id === methodId)

  return {
    id: methodId,
    code: methodId,
    name: method.name,
    description: method.description,
    enabled: method.enabled,
    availability: method.enabled ? 'available' : 'coming_soon',
    badgeLabel: method.enabled ? 'Disponible' : 'Bientôt disponible',
    brandAccent: fallbackMethod?.brandAccent ?? brandAccentByMethod[methodId],
    helperText: fallbackMethod?.helperText,
    displayOrder: method.displayOrder,
    iconUrl: method.iconUrl,
    instructions: method.instructions,
    publicConfiguration: method.publicConfiguration ?? {},
  }
}

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentMethods: builder.query<PaymentMethodOption[], void>({
      query: () => ({
        url: '/payment-methods',
        method: 'GET',
      }),
      transformResponse: (response: Array<Record<string, unknown>>) =>
        response.map((method) =>
          toPaymentMethodOption({
            id: typeof method.id === 'string' ? method.id : undefined,
            code: typeof method.code === 'string' ? method.code : undefined,
            name: typeof method.name === 'string' ? method.name : 'Méthode de paiement',
            description: typeof method.description === 'string' ? method.description : '',
            enabled: Boolean(method.enabled),
            displayOrder: typeof method.displayOrder === 'number' ? method.displayOrder : undefined,
            iconUrl: typeof method.iconUrl === 'string' ? method.iconUrl : undefined,
            instructions: typeof method.instructions === 'string' ? method.instructions : undefined,
            publicConfiguration:
              method.publicConfiguration && typeof method.publicConfiguration === 'object'
                ? (method.publicConfiguration as Record<string, unknown>)
                : {},
          })
        ),
      providesTags: [{ type: 'PaymentMethod', id: 'LIST' }],
    }),
    createDonationFromPaymentWizard: builder.mutation<
      PaymentDonationResponse,
      CreateDonationFromPaymentWizardPayload
    >({
      query: (payload) => {
        const body: CreateDonationPayload = {
          donationType: payload.donationType,
          campaign: payload.campaign,
          program: payload.program,
          amount: payload.amount,
          currency: payload.currency,
          paymentMethod: PAYMENT_METHOD_TO_DONATION_METHOD[payload.paymentMethod],
          frequency: payload.frequency,
          anonymous: payload.anonymous,
          message: payload.message,
          transactionReference: payload.transactionReference,
          donor: payload.donor,
        }

        return {
          url: '/donations',
          method: 'POST',
          body,
        }
      },
      invalidatesTags: [
        { type: 'DonationList', id: 'LIST' },
        { type: 'MyDonationList', id: 'LIST' },
      ],
    }),
    uploadProof: builder.mutation<PaymentProofUploadResult, UploadProofPayload>({
      query: ({ donationId, referenceProvided, file }) => {
        const formData = new FormData()
        formData.append('proof', file)

        if (referenceProvided) {
          formData.append('referenceProvided', referenceProvided)
        }

        return {
          url: `/donations/${donationId}/proof`,
          method: 'POST',
          body: formData,
        }
      },
      transformResponse: (
        response: {
          proof?: {
            originalFileName?: string
            mimeType?: string
            fileUrl?: string
          }
        },
        _meta,
        arg
      ) => ({
        fileName: response.proof?.originalFileName ?? arg.file.name,
        previewUrl: response.proof?.fileUrl ?? '',
        mimeType: response.proof?.mimeType ?? arg.file.type,
        fileSize: arg.file.size,
        file: arg.file,
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'Donation', id: arg.donationId }],
    }),
    submitManualPayment: builder.mutation<
      { message: string; donation: Record<string, unknown>; proof: Record<string, unknown> },
      SubmitManualPaymentPayload
    >({
      query: ({ donationId, reference, file }) => {
        const formData = new FormData()
        formData.append('proof', file)
        formData.append('reference', reference)

        return {
          url: `/donations/${donationId}/manual-payment`,
          method: 'POST',
          body: formData,
        }
      },
      invalidatesTags: (_result, _error, arg) => [
        { type: 'Donation', id: arg.donationId },
        { type: 'Donation', id: 'PAYMENT_PROOFS' },
      ],
    }),
    getDonationPaymentStatus: builder.query<
      ManualPaymentStatusResponse,
      { donationId: string; referenceProvided?: string }
    >({
      query: ({ donationId, referenceProvided }) => ({
        url: `/donations/${donationId}/payment-status`,
        method: 'GET',
        params: referenceProvided ? { referenceProvided } : undefined,
      }),
      providesTags: (_result, _error, arg) => [{ type: 'Donation', id: arg.donationId }],
    }),
    getAdminPaymentMethods: builder.query<PaymentMethodOption[], void>({
      query: () => ({
        url: '/admin/payment-methods',
        method: 'GET',
      }),
      transformResponse: (response: Array<Record<string, unknown>>) =>
        response.map((method) =>
          toPaymentMethodOption({
            id: typeof method.code === 'string' ? method.code : undefined,
            code: typeof method.code === 'string' ? method.code : undefined,
            name: typeof method.name === 'string' ? method.name : 'Méthode de paiement',
            description: typeof method.description === 'string' ? method.description : '',
            enabled: Boolean(method.enabled),
            displayOrder: typeof method.displayOrder === 'number' ? method.displayOrder : undefined,
            iconUrl: typeof method.iconUrl === 'string' ? method.iconUrl : undefined,
            instructions: typeof method.instructions === 'string' ? method.instructions : undefined,
            publicConfiguration:
              method.publicConfiguration && typeof method.publicConfiguration === 'object'
                ? (method.publicConfiguration as Record<string, unknown>)
                : {},
          })
        ),
      providesTags: [{ type: 'PaymentMethod', id: 'LIST' }],
    }),
    updateAdminPaymentMethod: builder.mutation<
      { message: string; method: PaymentMethodOption },
      UpdatePaymentMethodPayload
    >({
      query: ({ id, ...body }) => ({
        url: `/admin/payment-methods/${id}`,
        method: 'PATCH',
        body,
      }),
      transformResponse: (response: { message: string; method: Record<string, unknown> }) => ({
        message: response.message,
        method: toPaymentMethodOption({
          id: typeof response.method.code === 'string' ? response.method.code : undefined,
          code: typeof response.method.code === 'string' ? response.method.code : undefined,
          name:
            typeof response.method.name === 'string' ? response.method.name : 'Méthode de paiement',
          description:
            typeof response.method.description === 'string' ? response.method.description : '',
          enabled: Boolean(response.method.enabled),
          displayOrder:
            typeof response.method.displayOrder === 'number'
              ? response.method.displayOrder
              : undefined,
          iconUrl:
            typeof response.method.iconUrl === 'string' ? response.method.iconUrl : undefined,
          instructions:
            typeof response.method.instructions === 'string'
              ? response.method.instructions
              : undefined,
          publicConfiguration:
            response.method.publicConfiguration &&
            typeof response.method.publicConfiguration === 'object'
              ? (response.method.publicConfiguration as Record<string, unknown>)
              : {},
        }),
      }),
      invalidatesTags: [{ type: 'PaymentMethod', id: 'LIST' }],
    }),
    getAdminPaymentProofs: builder.query<
      PaginatedPaymentProofResponse,
      { page?: number; limit?: number; status?: string; paymentMethod?: string } | void
    >({
      query: (params) => ({
        url: '/admin/payment-proofs',
        method: 'GET',
        params: params ?? undefined,
      }),
      providesTags: [{ type: 'Donation', id: 'PAYMENT_PROOFS' }],
    }),
    reviewAdminPaymentProof: builder.mutation<
      { message: string; proof: Record<string, unknown> },
      ReviewPaymentProofPayload
    >({
      query: ({ proofId, status, reviewNote }) => ({
        url: `/admin/payment-proofs/${proofId}/review`,
        method: 'PATCH',
        body: { status, reviewNote },
      }),
      invalidatesTags: [{ type: 'Donation', id: 'PAYMENT_PROOFS' }],
    }),
    approveAdminPaymentProof: builder.mutation<
      { message: string; proof: Record<string, unknown> },
      ApprovePaymentProofPayload
    >({
      query: ({ proofId, reviewNote }) => ({
        url: `/admin/payment-proofs/${proofId}/approve`,
        method: 'PATCH',
        body: { reviewNote },
      }),
      invalidatesTags: [{ type: 'Donation', id: 'PAYMENT_PROOFS' }],
    }),
    rejectAdminPaymentProof: builder.mutation<
      { message: string; proof: Record<string, unknown> },
      RejectPaymentProofPayload
    >({
      query: ({ proofId, reason }) => ({
        url: `/admin/payment-proofs/${proofId}/reject`,
        method: 'PATCH',
        body: { reason },
      }),
      invalidatesTags: [{ type: 'Donation', id: 'PAYMENT_PROOFS' }],
    }),
    updateAdminDonationStatus: builder.mutation<
      { message: string; donation: Record<string, unknown> },
      UpdateAdminDonationStatusPayload
    >({
      query: ({ donationId, ...body }) => ({
        url: `/admin/donations/${donationId}/status`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'Donation', id: arg.donationId }],
    }),
  }),
})

export const {
  useApproveAdminPaymentProofMutation,
  useCreateDonationFromPaymentWizardMutation,
  useGetDonationPaymentStatusQuery,
  useGetAdminPaymentMethodsQuery,
  useGetAdminPaymentProofsQuery,
  useGetPaymentMethodsQuery,
  useRejectAdminPaymentProofMutation,
  useReviewAdminPaymentProofMutation,
  useSubmitManualPaymentMutation,
  useUpdateAdminDonationStatusMutation,
  useUpdateAdminPaymentMethodMutation,
  useUploadProofMutation,
} = paymentApi
