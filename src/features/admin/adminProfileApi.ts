import { baseApi } from '../../services/baseApi'
import { setCredentials } from '../auth/authSlice'
import type {
  ActiveSessionsResponse,
  AdminProfileResponse,
  ChangeAdminEmailPayload,
  ChangeAdminPasswordPayload,
  UpdateAdminProfilePayload,
} from './adminManagementTypes'

export const adminProfileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminProfile: builder.query<AdminProfileResponse, void>({
      query: () => ({
        url: '/admin/profile',
        method: 'GET',
      }),
      providesTags: ['Auth', 'User'],
      async onQueryStarted(_arg, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled
          const currentAccessToken = (getState() as { auth?: { accessToken: string | null } }).auth?.accessToken
          dispatch(
            setCredentials({
              user: data.profile,
              accessToken: currentAccessToken,
            })
          )
        } catch {
          // no-op
        }
      },
    }),
    updateAdminProfile: builder.mutation<
      { message?: string; profile: AdminProfileResponse['profile'] },
      UpdateAdminProfilePayload
    >({
      query: (body) => ({
        url: '/admin/profile',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Auth', 'User'],
      async onQueryStarted(_arg, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled
          const currentAccessToken = (getState() as { auth?: { accessToken: string | null } }).auth?.accessToken
          dispatch(
            setCredentials({
              user: data.profile,
              accessToken: currentAccessToken,
            })
          )
        } catch {
          // no-op
        }
      },
    }),
    changeAdminEmail: builder.mutation<
      { message?: string; profile: AdminProfileResponse['profile'] },
      ChangeAdminEmailPayload
    >({
      query: (body) => ({
        url: '/admin/profile/email',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Auth', 'User'],
      async onQueryStarted(_arg, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled
          const currentAccessToken = (getState() as { auth?: { accessToken: string | null } }).auth?.accessToken
          dispatch(
            setCredentials({
              user: data.profile,
              accessToken: currentAccessToken,
            })
          )
        } catch {
          // no-op
        }
      },
    }),
    changeAdminPassword: builder.mutation<{ message?: string }, ChangeAdminPasswordPayload>({
      query: (body) => ({
        url: '/admin/profile/password',
        method: 'PATCH',
        body,
      }),
    }),
    uploadAdminAvatar: builder.mutation<{ message?: string; avatarUrl: string }, File>({
      query: (file) => {
        const formData = new FormData()
        formData.append('image', file)
        formData.append('folder', 'admins')
        return {
          url: '/admin/profile/avatar',
          method: 'POST',
          body: formData,
        }
      },
      invalidatesTags: ['Auth', 'User'],
      async onQueryStarted(_arg, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled
          const state = getState() as { auth?: { user: AdminProfileResponse['profile'] | null; accessToken: string | null } }
          const currentAccessToken = state.auth?.accessToken
          const currentUser = state.auth?.user
          dispatch(
            setCredentials({
              user: currentUser ? { ...currentUser, avatarUrl: data.avatarUrl } : null,
              accessToken: currentAccessToken,
            })
          )
        } catch {
          // no-op
        }
      },
    }),
    deleteAdminAvatar: builder.mutation<{ message?: string }, void>({
      query: () => ({
        url: '/admin/profile/avatar',
        method: 'DELETE',
      }),
      invalidatesTags: ['Auth', 'User'],
      async onQueryStarted(_arg, { dispatch, queryFulfilled, getState }) {
        try {
          await queryFulfilled
          const state = getState() as { auth?: { user: AdminProfileResponse['profile'] | null; accessToken: string | null } }
          dispatch(
            setCredentials({
              user: state.auth?.user ? { ...state.auth.user, avatarUrl: null } : null,
              accessToken: state.auth?.accessToken,
            })
          )
        } catch {
          // no-op
        }
      },
    }),
    getAdminSessions: builder.query<ActiveSessionsResponse, void>({
      query: () => ({
        url: '/admin/profile/sessions',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    revokeAdminSession: builder.mutation<{ message?: string }, string>({
      query: (id) => ({
        url: `/admin/profile/sessions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    revokeOtherAdminSessions: builder.mutation<{ message?: string }, void>({
      query: () => ({
        url: '/admin/profile/sessions',
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
})

export const {
  useGetAdminProfileQuery,
  useUpdateAdminProfileMutation,
  useChangeAdminEmailMutation,
  useChangeAdminPasswordMutation,
  useUploadAdminAvatarMutation,
  useDeleteAdminAvatarMutation,
  useGetAdminSessionsQuery,
  useRevokeAdminSessionMutation,
  useRevokeOtherAdminSessionsMutation,
} = adminProfileApi
