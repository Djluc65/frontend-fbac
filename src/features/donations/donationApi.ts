import { baseApi } from '../../services/baseApi'
import type {
  CreateDonationPayload,
  CreateDonationResponse,
  Donation,
  DonationListResponse,
} from './donationTypes'

export const donationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createDonation: builder.mutation<CreateDonationResponse, CreateDonationPayload>({
      query: (payload) => ({
        url: '/donations',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [
        { type: 'DonationList', id: 'LIST' },
        { type: 'MyDonationList', id: 'LIST' },
      ],
    }),
    getDonations: builder.query<DonationListResponse, { page?: number; limit?: number; status?: string } | void>({
      query: (params) => ({
        url: '/admin/donations',
        method: 'GET',
        params: params ?? undefined,
      }),
      providesTags: (result) =>
        result
          ? [
              { type: 'DonationList', id: 'LIST' },
              ...result.items.map((donation) => ({ type: 'Donation' as const, id: donation._id })),
            ]
          : [{ type: 'DonationList', id: 'LIST' }],
    }),
    getDonationById: builder.query<Donation, string>({
      query: (id) => ({
        url: `/users/me/donations/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Donation', id }],
    }),
    getDonationByReference: builder.query<Donation, string>({
      query: (reference) => ({
        url: `/donations/reference/${reference}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, reference) => [{ type: 'Donation', id: reference }],
    }),
    getMyDonations: builder.query<DonationListResponse, { page?: number; limit?: number; status?: string } | void>({
      query: (params) => ({
        url: '/users/me/donations',
        method: 'GET',
        params: params ?? undefined,
      }),
      providesTags: (result) =>
        result
          ? [
              { type: 'MyDonationList', id: 'LIST' },
              ...result.items.map((donation) => ({ type: 'Donation' as const, id: donation._id })),
            ]
          : [{ type: 'MyDonationList', id: 'LIST' }],
    }),
  }),
})

export const {
  useCreateDonationMutation,
  useGetDonationByIdQuery,
  useGetDonationByReferenceQuery,
  useGetDonationsQuery,
  useGetMyDonationsQuery,
} = donationApi
