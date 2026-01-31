import { baseApi } from "./baseApi";
import type { responseUser, signUpUser, logInUser } from "../types/rtkTypes";

export const authApi = baseApi.injectEndpoints({
    overrideExisting: false,
    endpoints: (build) => ({
        signUpUser: build.mutation<void, signUpUser>({
            query: (body) => ({
                url: '/auth/signup',
                method: 'POST',
                body,
                validateStatus: (response, result) =>
                    response.status === 201 && !result.isError,
            }),
        }),
        logInUser: build.mutation<{token: string, user: responseUser}, logInUser>({
            query: (body) => ({
                url: '/auth/login',
                method: 'POST',
                body,
            }),
            transformResponse: (response: { msg: string, token: string, user: responseUser }) => ({
                token: response.token,
                user: response.user
            })
        }),
        oAuthLogin: build.mutation<{token: string, user: responseUser}, { code: string }>({
            query: (body) => ({
                url: '/auth/googleOAuth',
                method: 'POST',
                body
            }),
        })
    })
});

export const { useSignUpUserMutation, useLogInUserMutation, useOAuthLoginMutation } = authApi;