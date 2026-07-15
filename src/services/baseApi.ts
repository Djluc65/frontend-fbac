import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import { clearCredentials, setAccessToken } from '../features/auth/authSlice'

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as { auth?: { accessToken: string | null } }).auth?.accessToken

    headers.set('accept', 'application/json')

    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }

    return headers
  },
})

const extractAccessToken = (payload: unknown) => {
  if (!payload || typeof payload !== 'object') {
    return null
  }

  if ('accessToken' in payload && typeof payload.accessToken === 'string') {
    return payload.accessToken
  }

  if (
    'data' in payload &&
    payload.data &&
    typeof payload.data === 'object' &&
    'accessToken' in payload.data &&
    typeof payload.data.accessToken === 'string'
  ) {
    return payload.data.accessToken
  }

  return null
}

const isRefreshRequest = (args: string | FetchArgs) => {
  if (typeof args === 'string') {
    return args.includes('/auth/refresh')
  }

  return args.url.includes('/auth/refresh')
}

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await rawBaseQuery(args, api, extraOptions)

  if (result.error?.status === 401 && !isRefreshRequest(args)) {
    const refreshResult = await rawBaseQuery(
      {
        url: '/auth/refresh',
        method: 'POST',
      },
      api,
      extraOptions
    )

    if (refreshResult.data) {
      const refreshedAccessToken = extractAccessToken(refreshResult.data)

      if (refreshedAccessToken) {
        api.dispatch(setAccessToken(refreshedAccessToken))
      }

      result = await rawBaseQuery(args, api, extraOptions)
    } else {
      api.dispatch(clearCredentials())
    }
  }

  return result
}

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'User', 'UserList', 'DashboardStats', 'Campaign', 'CampaignList', 'News', 'NewsList', 'SiteContent'],
  endpoints: () => ({}),
})
