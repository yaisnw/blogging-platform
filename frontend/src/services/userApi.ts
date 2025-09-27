import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { responseUser } from "../types/rtkTypes";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/user`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["User"],
    endpoints: (build) => ({
        getUser: build.query<responseUser, number>({
            query: (id) => `/${id}`,
            providesTags: (_result, _error, id) => [{ type: "User", id }],
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
    useChangePasswordMutation,
    useChangeAvatarMutation,
} = userApi;
