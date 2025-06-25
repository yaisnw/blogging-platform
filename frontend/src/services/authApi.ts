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
        logInUser: build.mutation<responseUser, logInUser>({
            query: (body) => ({
                url: '/login',
                method: 'POST',
                body,
            }),
            transformResponse: (data: {msg: string, user: responseUser}) => {
                return (data).user
            }
        })

    })
})


export const {
    useSignUpUserMutation,
    useLogInUserMutation
} = authApi