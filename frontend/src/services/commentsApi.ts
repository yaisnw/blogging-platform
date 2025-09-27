import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { comment } from "../types/rtkTypes";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const commentsApi = createApi({
  reducerPath: "commentsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/comment`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Comments", "Comment"],
  endpoints: (build) => ({
    getCommentsByPostId: build.query<{ comments: comment[] }, number>({
      query: (postId) => `/post/${postId}`,
      providesTags: (result, _, postId) =>
        result
          ? [
            ...result.comments.map(
              (comment) => ({ type: "Comment", id: comment.id } as const)
            ),
            { type: "Comments", id: `POST-${postId}` },
          ]
          : [{ type: "Comments", id: `POST-${postId}` }],
    }),
    
    getCommentsByAuthorId: build.query<{ comments: comment[] }, number>({
      query: (authorId) => `/author/${authorId}`,
      providesTags: (result, _, authorId) =>
        result
          ? [
            ...result.comments.map(
              (comment) => ({ type: "Comment", id: comment.id } as const)
            ),
            { type: "Comments", id: `AUTHOR-${authorId}` },
          ]
          : [{ type: "Comments", id: `AUTHOR-${authorId}` }],
    }),

    addComment: build.mutation<comment, { postId: number; content: string }>({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { postId }) => [
        { type: "Comments", id: `POST-${postId}` },
      ],
    }),

    editComment: build.mutation<
      { message: string },
      { commentId: number; content: string; postId: number }
    >({
      query: ({ commentId, content }) => ({
        url: `/${commentId}`,
        method: "PUT",
        body: { content },
      }),
      invalidatesTags: (_result, _error, { commentId, postId }) => [
        { type: "Comment", commentId },
        { type: "Comments", id: `POST-${postId}` },
      ],
    }),

    deleteComment: build.mutation<
      { message: string },
      { commentId: number; postId: number }
    >({
      query: ({ commentId }) => ({
        url: `/${commentId}`,
        method: "DELETE",
      }),


      invalidatesTags: (_result, _error, { commentId, postId }) => [
        { type: "Comment", commentId },
        { type: "Comments", id: `POST-${postId}` },
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
