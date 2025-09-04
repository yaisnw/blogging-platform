import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { blogPost } from "../types/rtkTypes";
const BASE_URL = import.meta.env.VITE_BASE_URL

export const postsApi = createApi({
    reducerPath: 'postsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/post`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    tagTypes: ['Posts', 'Post'],
    endpoints: (build) => ({
        getMyPosts: build.query<{ posts: blogPost[], message: string, author: string }, number>({
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
        getPostById: build.query<blogPost, number>({
            query: (postId) => `/${postId}`,
            providesTags: (result, error, postId) =>
                result ? [{ type: "Post", id: postId }] : [],
        }),
        getCompletedPosts: build.query<
            { posts: blogPost[]; message: string },
            void
        >({
            query: () => `/getAllCompletedPosts`,
            providesTags: (result): { type: "Posts"; id: number | "LIST" }[] =>
                result?.posts
                    ? [
                        { type: "Posts", id: "LIST" },
                        ...result.posts.map(
                            (post) => ({ type: "Posts", id: post.id } as const)
                        ),
                    ]
                    : [{ type: "Posts", id: "LIST" }],
        }),
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
        updatePost: build.mutation<
            void
            , { postId: number, title: string, content: string, status: 'pending' | 'completed' }>
            ({
                query: ({ postId, title, content, status }) => ({
                    url: `/update/${postId}`,
                    method: 'PUT',
                    body: { title, content, status }
                    ,
                }),
                invalidatesTags: ['Posts']
            }),
        deletePosts: build.mutation<
            void,
            number[]>({
                query: (postIds) => ({
                    url: `/deletePosts`,
                    method: 'DELETE',
                    body: { postIds },
                }),
                invalidatesTags: ['Posts']
            })
    })
})

export const {
    useGetMyPostsQuery,
    useCreatePostMutation,
    useGetPostByIdQuery,
    useGetCompletedPostsQuery,
    useLazyGetPostByIdQuery,
    useUpdatePostMutation,
    useDeletePostsMutation,
} = postsApi