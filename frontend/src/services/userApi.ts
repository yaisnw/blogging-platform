import type { responseUser } from "../types/rtkTypes";
import { baseApi } from "./baseApi";


export const userApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getUser: build.query<responseUser, number>({
            query: (id) => `/${id}`,
            providesTags: (_result, _error, id) => [{ type: "User", id }],
        }),
        searchUsers: build.query<{users: responseUser[], message: string}, string>({
            query: (searchTerm) => `/search?q=${encodeURIComponent(searchTerm)}`,
            providesTags: (result) =>
                result
                    ? [
                        { type: "User", id: "LIST" },
                        ...result.users.map((u: responseUser) => ({ type: "User" as const, id: u.id })),
                    ]
                    : [{ type: "User", id: "LIST" }],
        }),
        deleteUser: build.mutation<{ msg: string }, number>({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, id) => [{ type: "User", id }],
        }),

        updateUser: build.mutation<responseUser, { id: number; data: Partial<responseUser> }>({
            query: ({ id, data }) => ({
                url: `/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [{ type: "User", id }],
        }),
        changePassword: build.mutation<{ msg: string }, { data: { currentPassword: string; newPassword: string } }>({
            query: ({ data }) => ({
                url: `/change-password`,
                method: "PUT",
                body: data,
            }),
        }),

        changeAvatar: build.mutation<responseUser, { id: number; formData: FormData }>({
            query: ({ id, formData }) => ({
                url: `/${id}/avatar`,
                method: "PUT",
                body: formData,
            }),
            invalidatesTags: (_result, _error, { id }) => [{ type: "User", id }],
        }),
    }),
});

export const {
    useGetUserQuery,
    useLazyGetUserQuery,
    useDeleteUserMutation,
    useUpdateUserMutation,
    useSearchUsersQuery,
    useChangePasswordMutation,
    useChangeAvatarMutation,
} = userApi;
