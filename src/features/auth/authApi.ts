import { baseApi } from '../../services/baseApi'
import { clearCredentials, setAccessToken, setCredentials } from './authSlice'
import type {
  AuthUser,
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  LoginPayload,
  NormalizedAuthResponse,
  RefreshResponse,
} from './authTypes'

const extractAuthUser = (response: unknown): AuthUser => {
  if (response && typeof response === 'object') {
    if ('user' in response && response.user && typeof response.user === 'object') {
      return response.user as AuthUser
    }

    if ('data' in response && response.data && typeof response.data === 'object') {
      if ('user' in response.data && response.data.user && typeof response.data.user === 'object') {
        return response.data.user as AuthUser
      }

      return response.data as AuthUser
    }
  }

  return response as AuthUser
}

const extractAccessToken = (response: unknown) => {
  if (!response || typeof response !== 'object') {
    return null
  }

  if ('accessToken' in response && typeof response.accessToken === 'string') {
    return response.accessToken
  }

  if (
    'data' in response &&
    response.data &&
    typeof response.data === 'object' &&
    'accessToken' in response.data &&
    typeof response.data.accessToken === 'string'
  ) {
    return response.data.accessToken
  }

  return null
}

const normalizeAuthResponse = (response: unknown): NormalizedAuthResponse => ({
  user: extractAuthUser(response),
  accessToken: extractAccessToken(response),
})

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<NormalizedAuthResponse, LoginPayload>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: normalizeAuthResponse,
      invalidatesTags: ['Auth'],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(
            setCredentials({
              user: data.user,
              accessToken: data.accessToken,
            })
          )
        } catch {
          dispatch(clearCredentials())
        }
      },
    }),
    getCurrentUser: builder.query<NormalizedAuthResponse, void>({
      query: () => ({
        url: '/auth/me',
        method: 'GET',
      }),
      transformResponse: normalizeAuthResponse,
      providesTags: ['Auth'],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(
            setCredentials({
              user: data.user,
              accessToken: data.accessToken,
            })
          )
        } catch {
          dispatch(clearCredentials())
        }
      },
    }),
    refreshSession: builder.mutation<RefreshResponse, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data.accessToken) {
            dispatch(setAccessToken(data.accessToken))
          }
        } catch {
          dispatch(clearCredentials())
        }
      },
    }),
    logout: builder.mutation<{ message?: string }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
        } finally {
          dispatch(clearCredentials())
        }
      },
    }),
    forgotAdminPassword: builder.mutation<ForgotPasswordResponse, ForgotPasswordPayload>({
      query: (body) => ({
        url: '/auth/admin/forgot-password',
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const {
  useLoginMutation,
  useGetCurrentUserQuery,
  useRefreshSessionMutation,
  useLogoutMutation,
  useForgotAdminPasswordMutation,
} = authApi
