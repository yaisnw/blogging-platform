import type { blogPost, PostDetailsResponse } from "../types/rtkTypes";
import { baseApi } from "./baseApi";

export const postsApi = baseApi.injectEndpoints({
    overrideExisting: false,
    endpoints: (build) => ({
        getMyPosts: build.query<
            { posts: blogPost[]; message: string; author: string; totalCount: number },
            { authorId: number; publishedOnly?: boolean; sort?: string; page: number; limit: number }
        >({
            query: ({ authorId, publishedOnly, sort, page, limit }) => {
                const params = new URLSearchParams({
                    publishedOnly: publishedOnly ? "true" : "false",
                    page: page.toString(),
                    limit: limit.toString()
                });
                if (sort) params.append("sort", sort);

                return `/post/getAllPosts/${authorId}?${params.toString()}`;
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
            { posts: blogPost[]; message: string; totalCount: number },
            { sort?: string; page: number; limit: number }
        >({
            query: ({ sort, page, limit }) => {
                const params = new URLSearchParams({
                    page: page.toString(),
                    limit: limit.toString()
                });
                if (sort) params.append("sort", sort);

                return `/post/getAllPublishedPosts?${params.toString()}`;
            },
            providesTags: (result) =>
                result?.posts
                    ? [
                        { type: "Posts", id: "LIST" },
                        ...result.posts.map(
                            (post) => ({ type: "Posts", id: post.id } as const)
                        ),
                    ]
                    : [{ type: "Posts", id: "LIST" }],
        }),

        getPostById: build.query<blogPost, number>({
            query: (postId) => `/post/${postId}`,
            providesTags: (result, _error, postId) =>
                result ? [{ type: "Post", id: postId }] : [],
        }),

        getPostDetails: build.query<
            PostDetailsResponse & { totalComments: number },
            { postId: number; page: number; limit: number }
        >({
            query: ({ postId, page, limit }) => `/post/details/${postId}?page=${page}&limit=${limit}`,
            providesTags: (result, _error, { postId }) =>
                result
                    ? [
                        { type: "Post", id: postId },
                        { type: "Posts", id: postId },
                        { type: "Comments", id: `POST-${postId}` } 
                    ]
                    : [{ type: "Comments", id: `POST-${postId}` }], 
        }),

        searchPosts: build.query<{ posts: blogPost[]; message: string }, string>({
            query: (searchTerm) => `/post/search?q=${encodeURIComponent(searchTerm)}`,
            providesTags: (result) =>
                result?.posts
                    ? [{ type: "Posts", id: "LIST" }, ...result.posts.map((post) => ({ type: "Posts" as const, id: post.id }))]
                    : [{ type: "Posts", id: "LIST" }],
        }),

        createPost: build.mutation<blogPost, { title: string, content: string, status: 'draft' | 'published' }>({
            query: (body) => ({ url: '/post/create', method: 'POST', body }),
            invalidatesTags: [{ type: "Posts", id: "LIST" }],
        }),

        updatePost: build.mutation<blogPost, { postId: number } & Partial<{ title: string; content: string; status: 'draft' | 'published'; }>>({
            query: ({ postId, ...updates }) => ({ url: `/post/update/${postId}`, method: 'PUT', body: updates }),
            invalidatesTags: (_result, _error, { postId }) => [{ type: "Post", id: postId }, { type: "Posts", id: postId }],
        }),

        deletePosts: build.mutation<void, number[]>({
            query: (postIds) => ({ url: `/post/deletePosts`, method: "DELETE", body: { postIds } }),
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
} = postsApi;