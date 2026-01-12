import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { blogPost, PostDetailsResponse } from "../types/rtkTypes";
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
        getMyPosts: build.query<
            { posts: blogPost[]; message: string; author: string },
            { authorId: number; publishedOnly?: boolean; sort?: string } // Added sort type
        >({
            query: ({ authorId, publishedOnly, sort }) => {
                let url = `/getAllPosts/${authorId}?publishedOnly=${publishedOnly ? "true" : "false"}`;
                if (sort) url += `&sort=${sort}`;
                return url;
            },
            providesTags: (result) =>
                result?.posts
                    ? [
                        { type: "Posts", id: "LIST" },
                        ...result.posts.map((post) => ({ type: "Posts", id: post.id } as const)),
                    ]
                    : [{ type: "Posts", id: "LIST" }],
        }),

        getPublishedPosts: build.query<
            { posts: blogPost[]; message: string },
            { sort?: string } | void // Changed from void to allow optional sort object
        >({
            query: (args) => {
                const sort = args && typeof args === 'object' ? args.sort : null;
                return sort ? `/getAllPublishedPosts?sort=${sort}` : `/getAllPublishedPosts`;
            },
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
        
        // ... rest of your endpoints (getPostById, searchPosts, etc) remain the same
        getPostById: build.query<blogPost, number>({
            query: (postId) => `/${postId}`,
            providesTags: (result, _error, postId) =>
                result ? [{ type: "Post", id: postId }] : [],
        }),
        getPostDetails: build.query<PostDetailsResponse, number>({
            query: (postId) => `/details/${postId}`,
            providesTags: (result, _error, postId) =>
                result ? [{ type: "Post", id: postId }, { type: "Posts", id: postId }] : [],
        }),
        searchPosts: build.query<{ posts: blogPost[]; message: string }, string>({
            query: (searchTerm) => `/search?q=${encodeURIComponent(searchTerm)}`,
            providesTags: (result) =>
                result?.posts
                    ? [{ type: "Posts", id: "LIST" }, ...result.posts.map((post) => ({ type: "Posts" as const, id: post.id }))]
                    : [{ type: "Posts", id: "LIST" }],
        }),
        createPost: build.mutation<blogPost, { title: string, content: string, status: 'draft' | 'published' }>({
            query: (body) => ({ url: '/create', method: 'POST', body }),
            invalidatesTags: [{ type: "Posts", id: "LIST" }],
        }),
        updatePost: build.mutation<blogPost, { postId: number } & Partial<{ title: string; content: string; status: 'draft' | 'published'; }>>({
            query: ({ postId, ...updates }) => ({ url: `/update/${postId}`, method: 'PUT', body: updates }),
            invalidatesTags: (_result, _error, { postId }) => [{ type: "Post", id: postId }, { type: "Posts", id: postId }],
        }),
        deletePosts: build.mutation<void, number[]>({
            query: (postIds) => ({ url: `/deletePosts`, method: "DELETE", body: { postIds } }),
            invalidatesTags: (_result, _error, postIds) => [{ type: "Posts", id: "LIST" }, ...postIds.map((id) => ({ type: "Posts" as const, id }))],
        })
    })
});
export const {
    useGetMyPostsQuery,
    useCreatePostMutation,
    useGetPostByIdQuery,
    useGetPublishedPostsQuery,
    useLazyGetPostByIdQuery,
    useSearchPostsQuery,
    useUpdatePostMutation,
    useDeletePostsMutation,
    useGetPostDetailsQuery,
} = postsApi


