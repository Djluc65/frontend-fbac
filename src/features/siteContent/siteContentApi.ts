import { baseApi } from '../../services/baseApi'
import type { AdminSiteContentResponse, SiteContent } from './siteContentTypes'

interface UploadSiteContentImageArgs {
  file: File
  folder: string
}

interface UploadSiteContentImageResponse {
  message: string
  fileName: string
  url: string
}

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
    uploadSiteContentImage: builder.mutation<
      UploadSiteContentImageResponse,
      UploadSiteContentImageArgs
    >({
      query: ({ file, folder }) => {
        const formData = new FormData()
        formData.append('image', file)
        formData.append('folder', folder)

        return {
          url: '/site-content/admin/upload',
          method: 'POST',
          body: formData,
        }
      },
    }),
  }),
})

export const {
  useGetPublicSiteContentQuery,
  useGetAdminSiteContentQuery,
  useUpdateSiteContentMutation,
  useUploadSiteContentImageMutation,
} = siteContentApi
