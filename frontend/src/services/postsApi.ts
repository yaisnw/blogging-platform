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
            providesTags: (result) =>
                result?.posts
                    ? [
                        { type: "Posts", id: "LIST" },
                        ...result.posts.map(
                            (post) => ({ type: "Posts", id: post.id } as const)
                        ),
                    ]
                    : [{ type: "Posts", id: "LIST" }]
        }
        ),
        getPostById: build.query<blogPost, number>({
            query: (postId) => `/${postId}`,
            providesTags: (result, error, postId) =>
                result ? [{ type: "Post", id: postId }] : [],
        }),
        getPublishedPosts: build.query<
            { posts: blogPost[]; message: string },
            void
        >({
            query: () => `/getAllPublishedPosts`,
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
            , { title: string, content: string, status: 'draft' | 'published' }>
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
                invalidatesTags: [{ type: "Posts", id: "LIST" }],
            }),
        updatePost: build.mutation<
            blogPost,
            { postId: number } & Partial<{
                title: string;
                content: string;
                status: 'draft' | 'published';
            }>
        >({
            query: ({ postId, ...updates }) => ({
                url: `/update/${postId}`,
                method: 'PUT',
                body: updates,
            }),
            invalidatesTags: (result, error, { postId }) => [
                { type: "Posts", id: postId },
            ],
        }),
        deletePosts: build.mutation<void, number[]>({
            query: (postIds) => ({
                url: `/deletePosts`,
                method: "DELETE",
                body: { postIds },
            }),
            invalidatesTags: (result, error, postIds) => [
                { type: "Posts", id: "LIST" },
                ...postIds.map((id) => ({ type: "Posts" as const, id })),
            ],
        })
    })
})

export const {
    useGetMyPostsQuery,
    useCreatePostMutation,
    useGetPostByIdQuery,
    useGetPublishedPostsQuery,
    useLazyGetPostByIdQuery,
    useUpdatePostMutation,
    useDeletePostsMutation,
} = postsApi


