import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { responseUser, signUpUser, logInUser } from "../types/rtkTypes";

const BASE_URL = import.meta.env.VITE_BASE_URL;


export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/auth`
    }),
    endpoints: (build) => ({
        signUpUser: build.mutation<void, signUpUser>({
            query: (body) => ({
                url: '/signup',
                method: 'POST',
                body,
                validateStatus: (response, result) =>
                    response.status === 201 && !result.isError,
            }),
        }),
        logInUser: build.mutation<{token: string, user: responseUser}, logInUser>({
            query: (body) => ({
                url: '/login',
                method: 'POST',
                body,
            }),
            transformResponse: (response: { msg: string, token: string, user: responseUser }) => {
                return {
                    token: response.token,
                    user: response.user
                }
            }
        }),
        oAuthLogin: build.mutation<{token: string, user: responseUser}, { code: string }>({
            query: (body) => ({
                url: '/googleOAuth',
                method: 'POST',
                body
            }),
            
        })

    })
})


export const {
    useSignUpUserMutation,
    useLogInUserMutation,
    useOAuthLoginMutation
} = authApi