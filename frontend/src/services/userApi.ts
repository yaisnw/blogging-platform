import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { responseUser } from "../types/rtkTypes";
const BASE_URL = import.meta.env.VITE_BASE_URL

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/user`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    endpoints: (build) => ({
        getUser: build.query<responseUser, number>({
            query: (id) => `/${id}`,
        }),
        deleteUser: build.mutation<{ msg: string }, number>({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useGetUserQuery,
    useDeleteUserMutation,
} = userApi;
