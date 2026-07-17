import { baseApi } from '../../services/baseApi'
import type { PermissionsResponse, RolePayload, RoleResponse, RolesResponse } from './adminManagementTypes'

export const rolesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query<RolesResponse, void>({
      query: () => ({
        url: '/admin/roles',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    getRoleById: builder.query<RoleResponse, string>({
      query: (id) => ({
        url: `/admin/roles/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),
    createRole: builder.mutation<{ message?: string; role: RoleResponse['role'] }, RolePayload>({
      query: (body) => ({
        url: '/admin/roles',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    updateRole: builder.mutation<{ message?: string; role: RoleResponse['role'] }, { id: string; body: Partial<RolePayload> }>({
      query: ({ id, body }) => ({
        url: `/admin/roles/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => ['User', { type: 'User', id }],
    }),
    deleteRole: builder.mutation<{ message?: string }, string>({
      query: (id) => ({
        url: `/admin/roles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    getPermissions: builder.query<PermissionsResponse, void>({
      query: () => ({
        url: '/admin/permissions',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
  }),
})

export const {
  useGetRolesQuery,
  useGetRoleByIdQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetPermissionsQuery,
} = rolesApi
