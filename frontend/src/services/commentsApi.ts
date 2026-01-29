import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { postsApi } from "./postsApi";
import type { comment } from "../types/rtkTypes";
import type { RootState } from "@/store";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const CACHE_KEY = { page: 1, limit: 10 };

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
    getCommentsByPostId: build.query<
      { comments: comment[]; totalCount: number },
      { postId: number; page: number; limit: number }
    >({
      query: ({ postId, page, limit }) => `/post/${postId}?page=${page}&limit=${limit}`,
      providesTags: (result, _, { postId }) =>
        result
          ? [
            ...result.comments.map(
              (comment) => ({ type: "Comment", id: comment.id } as const)
            ),
            { type: "Comments", id: `POST-${postId}` },
          ]
          : [{ type: "Comments", id: `POST-${postId}` }],
    }),

    getCommentsByAuthorId: build.query<
      { comments: comment[]; totalCount: number },
      { authorId: number; page: number; limit: number }
    >({
      query: ({ authorId, page, limit }) => `/author/${authorId}?page=${page}&limit=${limit}`,
      providesTags: (result, _, { authorId }) =>
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
      async onQueryStarted({ postId, content }, { dispatch, getState, queryFulfilled }) {
  const state = getState() as RootState; 
  const currentUser = state.auth.user; 

  const patchResult = dispatch(
    postsApi.util.updateQueryData(
      'getPostDetails',
      { postId, page: 1, limit: 10 },
      (draft) => {
        const optimisticComment: comment = {
          id: Date.now(), // Temp ID
          content,
          postId,
          createdAt: new Date(),
          User: { 
            username: currentUser?.username || "Me", 
            avatar_url: currentUser?.avatar_url || "" 
          },
        };
        draft.comments.unshift(optimisticComment);
      }
    )
  );
  
  try {
    await queryFulfilled;
  } catch {
    patchResult.undo();
  }
}
    }),

    editComment: build.mutation<{ message: string }, { commentId: number; content: string; postId: number }>({
      query: ({ commentId, content }) => ({ url: `/${commentId}`, method: "PUT", body: { content } }),
      async onQueryStarted({ commentId, content, postId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          postsApi.util.updateQueryData('getPostDetails', { postId, ...CACHE_KEY }, (draft) => {
            const comment = draft.comments.find((c) => c.id === commentId);
            if (comment) comment.content = content;
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      }
    }),

    deleteComment: build.mutation<{ message: string }, { commentId: number; postId: number }>({
      query: ({ commentId }) => ({ url: `/${commentId}`, method: "DELETE" }),
      async onQueryStarted({ commentId, postId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          postsApi.util.updateQueryData('getPostDetails', { postId, ...CACHE_KEY }, (draft) => {
            draft.comments = draft.comments.filter((c) => c.id !== commentId);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      }
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