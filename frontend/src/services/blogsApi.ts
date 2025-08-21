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
        getMyPosts: build.query<{ posts: blogPost[], message: string }, number>({
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
        createPost: build.mutation<
            blogPost
            , { title: string, content: string, status: 'pending' | 'completed' }>
            ({
                query: ({ title, content, status }) => ({
                    url: '/create',
                    method: 'POST',
                    body: {
                        title,
                        content,
                        status
                    },
                }),
                invalidatesTags: ['Posts']
            }),

    })
})

export const {
    useGetMyPostsQuery,
    useCreatePostMutation,
} = blogsApi