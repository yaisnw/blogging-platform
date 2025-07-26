import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { blogPost } from "../types/rtkTypes";


export const blogsApi = createApi({
    reducerPath: 'blogsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3000/post',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    tagTypes: ['Posts'],
    endpoints: (build) => ({
        getMyPosts: build.query<{posts: blogPost[], message: string}, number>({
            query: (authorId) => `/getAllPosts/${authorId}`,
            providesTags: (result): { type: 'Posts'; id: number | 'LIST' }[] =>
                Array.isArray(result)
                    ? [
                        { type: 'Posts', id: 'LIST' },
                        ...result.map((post) => ({ type: 'Posts', id: post.id } as const))
                    ]
                    : [{ type: 'Posts', id: 'LIST' }]
        }
        ),
        
    })
})

export const {
    useGetMyPostsQuery
} = blogsApi