import { baseApi } from '../../services/baseApi'
import type { NewsItem, NewsPayload } from './newsTypes'

interface UploadNewsImageResponse {
  message: string
  fileName: string
  url: string
}

export const newsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicNews: builder.query<NewsItem[], void>({
      query: () => ({
        url: '/news',
        method: 'GET',
      }),
      providesTags: (result) =>
        result
          ? [
              { type: 'NewsList', id: 'PUBLIC' },
              ...result.map((newsItem) => ({ type: 'News' as const, id: newsItem._id })),
            ]
          : [{ type: 'NewsList', id: 'PUBLIC' }],
    }),
    getAdminNews: builder.query<NewsItem[], void>({
      query: () => ({
        url: '/news/admin/all',
        method: 'GET',
      }),
      providesTags: (result) =>
        result
          ? [
              { type: 'NewsList', id: 'LIST' },
              ...result.map((newsItem) => ({ type: 'News' as const, id: newsItem._id })),
            ]
          : [{ type: 'NewsList', id: 'LIST' }],
    }),
    createNews: builder.mutation<NewsItem, NewsPayload>({
      query: (payload) => ({
        url: '/news',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'NewsList', id: 'LIST' }],
    }),
    updateNews: builder.mutation<NewsItem, { id: string; payload: NewsPayload }>({
      query: ({ id, payload }) => ({
        url: `/news/${id}`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'News', id },
        { type: 'NewsList', id: 'LIST' },
      ],
    }),
    deleteNews: builder.mutation<{ message?: string }, string>({
      query: (id) => ({
        url: `/news/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'News', id },
        { type: 'NewsList', id: 'LIST' },
      ],
    }),
    uploadNewsImage: builder.mutation<UploadNewsImageResponse, File>({
      query: (file) => {
        const formData = new FormData()
        formData.append('image', file)
        formData.append('folder', 'news')

        return {
          url: '/news/upload',
          method: 'POST',
          body: formData,
        }
      },
    }),
  }),
})

export const {
  useGetPublicNewsQuery,
  useGetAdminNewsQuery,
  useCreateNewsMutation,
  useUpdateNewsMutation,
  useDeleteNewsMutation,
  useUploadNewsImageMutation,
} = newsApi
