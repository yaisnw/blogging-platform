import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { responseUser, signUpUser, logInUser } from "../types/rtkTypes";

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3000/auth'
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
        logInUser: build.mutation<string, logInUser>({
            query: (body) => ({
                url: '/login',
                method: 'POST',
                body,
            }),
            transformResponse: (response: { msg: string, token: string, user: responseUser }) => {
                return response.token
            }
        }),
        oAuthLogin: build.mutation<string, {code: string}>({
            query: (body) => ({
                url: '/googleOAuth',
                method: 'POST',
                body
            }),
            transformResponse: (response: {token: string}) => {
                return response.token
            }
        })

    })
})


export const {
    useSignUpUserMutation,
    useLogInUserMutation,
    useOAuthLoginMutation
} = authApi