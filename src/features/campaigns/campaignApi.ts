import { baseApi } from '../../services/baseApi'
import type { Campaign, CampaignPayload } from './campaignTypes'

export const campaignApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCampaigns: builder.query<Campaign[], void>({
      query: () => ({
        url: '/campaigns',
        method: 'GET',
      }),
      providesTags: (result) =>
        result
          ? [
              { type: 'CampaignList', id: 'LIST' },
              ...result.map((campaign) => ({ type: 'Campaign' as const, id: campaign._id })),
            ]
          : [{ type: 'CampaignList', id: 'LIST' }],
    }),
    createCampaign: builder.mutation<Campaign, CampaignPayload>({
      query: (payload) => ({
        url: '/campaigns',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'CampaignList', id: 'LIST' }],
    }),
    updateCampaign: builder.mutation<Campaign, { id: string; payload: CampaignPayload }>({
      query: ({ id, payload }) => ({
        url: `/campaigns/${id}`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Campaign', id },
        { type: 'CampaignList', id: 'LIST' },
      ],
    }),
    deleteCampaign: builder.mutation<{ message?: string }, string>({
      query: (id) => ({
        url: `/campaigns/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Campaign', id },
        { type: 'CampaignList', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useGetCampaignsQuery,
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
  useDeleteCampaignMutation,
} = campaignApi
