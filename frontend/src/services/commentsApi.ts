import type { comment } from "../types/rtkTypes";
import { baseApi } from "./baseApi";

export const commentsApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (build) => ({
    getCommentsByPostId: build.query<
      { comments: comment[]; totalCount: number },
      { postId: number; page: number; limit: number }
    >({
      query: ({ postId, page, limit }) => `/comment/post/${postId}?page=${page}&limit=${limit}`,
      providesTags: (result, _, { postId }) =>
        result
          ? [
            ...result.comments.map((comment) => ({ type: "Comment", id: comment.id } as const)),
            { type: "Comments", id: `POST-${postId}` },
          ]
          : [{ type: "Comments", id: `POST-${postId}` }],
    }),

    getCommentsByAuthorId: build.query<
      { comments: comment[]; totalCount: number },
      { authorId: number; page: number; limit: number }
    >({
      query: ({ authorId, page, limit }) => `/comment/author/${authorId}?page=${page}&limit=${limit}`,
      providesTags: (result, _, { authorId }) =>
        result
          ? [
            ...result.comments.map((comment) => ({ type: "Comment", id: comment.id } as const)),
            { type: "Comments", id: `AUTHOR-${authorId}` },
          ]
          : [{ type: "Comments", id: `AUTHOR-${authorId}` }],
    }),

    addComment: build.mutation<comment, { postId: number; content: string }>({
      query: (body) => ({
        url: "/comment",
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { postId }) => [
        { type: "Comments", id: `POST-${postId}` },
        { type: "Post", id: postId },
        { type: "Posts", id: postId },
        { type: "Posts", id: "LIST" }
      ],
    }),

    editComment: build.mutation<{ message: string }, { commentId: number; content: string; postId: number }>({
      query: ({ commentId, content }) => ({ url: `/comment/${commentId}`, method: "PUT", body: { content } }),
      invalidatesTags: (_result, _error, { commentId, postId }) => [
        { type: "Comment", id: commentId },
        { type: "Comments", id: `POST-${postId}` }
      ],
    }),

    deleteComment: build.mutation<{ message: string }, { commentId: number; postId: number }>({
      query: ({ commentId }) => ({ url: `/comment/${commentId}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, { postId }) => [
        { type: "Comments", id: `POST-${postId}` },
        { type: "Post", id: postId },
        { type: "Posts", id: postId },
        { type: "Posts", id: "LIST" }
      ],
    }),
  }),
});

export const {
  useGetCommentsByPostIdQuery,
  useGetCommentsByAuthorIdQuery,
  useAddCommentMutation,
  useEditCommentMutation,
  useDeleteCommentMutation,
} = commentsApi;