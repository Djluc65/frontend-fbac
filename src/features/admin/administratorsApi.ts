import { baseApi } from '../../services/baseApi'
import type {
  AdministratorDetailsResponse,
  AdministratorListResponse,
  CreateAdministratorPayload,
  CreateInvitationPayload,
  InvitationsResponse,
} from './adminManagementTypes'

export const administratorsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdministrators: builder.query<AdministratorListResponse, void>({
      query: () => ({
        url: '/admin/admins',
        method: 'GET',
      }),
      providesTags: ['UserList', 'User'],
    }),
    getAdministratorById: builder.query<AdministratorDetailsResponse, string>({
      query: (id) => ({
        url: `/admin/admins/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),
    createAdministrator: builder.mutation<
      { message?: string; administrator: AdministratorListResponse['items'][number] },
      CreateAdministratorPayload
    >({
      query: (body) => ({
        url: '/admin/admins',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['UserList', 'User'],
    }),
    updateAdministrator: builder.mutation<
      { message?: string; administrator: AdministratorListResponse['items'][number] },
      { id: string; body: Partial<CreateAdministratorPayload> }
    >({
      query: ({ id, body }) => ({
        url: `/admin/admins/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => ['UserList', { type: 'User', id }],
    }),
    updateAdministratorStatus: builder.mutation<
      { message?: string; administrator: AdministratorListResponse['items'][number] },
      { id: string; isActive: boolean; reason?: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/admin/admins/${id}/status`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => ['UserList', { type: 'User', id }],
    }),
    updateAdministratorRole: builder.mutation<
      { message?: string; administrator: AdministratorListResponse['items'][number] },
      { id: string; role: string; permissions?: string[] }
    >({
      query: ({ id, ...body }) => ({
        url: `/admin/admins/${id}/role`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => ['UserList', { type: 'User', id }],
    }),
    updateAdministratorPermissions: builder.mutation<
      { message?: string; administrator: AdministratorListResponse['items'][number] },
      { id: string; permissions: string[] }
    >({
      query: ({ id, ...body }) => ({
        url: `/admin/admins/${id}/permissions`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => ['UserList', { type: 'User', id }],
    }),
    sendAdministratorPasswordReset: builder.mutation<{ message?: string }, string>({
      query: (id) => ({
        url: `/admin/admins/${id}/send-password-reset`,
        method: 'POST',
      }),
      invalidatesTags: ['UserList', 'User'],
    }),
    revokeAdministratorSessions: builder.mutation<{ message?: string }, string>({
      query: (id) => ({
        url: `/admin/admins/${id}/revoke-sessions`,
        method: 'POST',
      }),
      invalidatesTags: ['UserList', 'User'],
    }),
    deleteAdministrator: builder.mutation<{ message?: string }, string>({
      query: (id) => ({
        url: `/admin/admins/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['UserList', 'User'],
    }),
    getInvitations: builder.query<InvitationsResponse, void>({
      query: () => ({
        url: '/admin/admin-invitations',
        method: 'GET',
      }),
      providesTags: ['UserList'],
    }),
    createInvitation: builder.mutation<
      { message?: string; invitation: InvitationsResponse['items'][number] },
      CreateInvitationPayload
    >({
      query: (body) => ({
        url: '/admin/admin-invitations',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['UserList'],
    }),
    resendInvitation: builder.mutation<{ message?: string; invitation: InvitationsResponse['items'][number] }, string>({
      query: (id) => ({
        url: `/admin/admin-invitations/${id}/resend`,
        method: 'POST',
      }),
      invalidatesTags: ['UserList'],
    }),
    revokeInvitation: builder.mutation<{ message?: string }, string>({
      query: (id) => ({
        url: `/admin/admin-invitations/${id}/revoke`,
        method: 'POST',
      }),
      invalidatesTags: ['UserList'],
    }),
    acceptInvitation: builder.mutation<{ message?: string }, { token: string; password: string }>({
      query: (body) => ({
        url: '/admin/admin-invitations/accept',
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const {
  useGetAdministratorsQuery,
  useGetAdministratorByIdQuery,
  useCreateAdministratorMutation,
  useUpdateAdministratorMutation,
  useUpdateAdministratorStatusMutation,
  useUpdateAdministratorRoleMutation,
  useUpdateAdministratorPermissionsMutation,
  useSendAdministratorPasswordResetMutation,
  useRevokeAdministratorSessionsMutation,
  useDeleteAdministratorMutation,
  useGetInvitationsQuery,
  useCreateInvitationMutation,
  useResendInvitationMutation,
  useRevokeInvitationMutation,
  useAcceptInvitationMutation,
} = administratorsApi
