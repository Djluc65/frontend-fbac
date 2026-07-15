import { baseApi } from '../../services/baseApi'
import type { AdminSiteContentResponse, SiteContent } from './siteContentTypes'

export const siteContentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicSiteContent: builder.query<SiteContent, void>({
      query: () => ({
        url: '/site-content',
        method: 'GET',
      }),
      providesTags: [{ type: 'SiteContent', id: 'MAIN' }],
    }),
    getAdminSiteContent: builder.query<AdminSiteContentResponse, void>({
      query: () => ({
        url: '/site-content/admin',
        method: 'GET',
      }),
      providesTags: [{ type: 'SiteContent', id: 'MAIN' }],
    }),
    updateSiteContent: builder.mutation<{ message?: string; content: SiteContent }, SiteContent>({
      query: (content) => ({
        url: '/site-content/admin',
        method: 'PUT',
        body: content,
      }),
      invalidatesTags: [{ type: 'SiteContent', id: 'MAIN' }],
    }),
  }),
})

export const {
  useGetPublicSiteContentQuery,
  useGetAdminSiteContentQuery,
  useUpdateSiteContentMutation,
} = siteContentApi
