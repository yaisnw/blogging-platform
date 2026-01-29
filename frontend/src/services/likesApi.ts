import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { postsApi } from "./postsApi";
const BASE_URL = import.meta.env.VITE_BASE_URL

export const likesApi = createApi({
  reducerPath: "likesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/like`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  tagTypes: ["Likes"],
  endpoints: (build) => ({
    addLike: build.mutation<void, number>({
      query: (postId) => ({ url: `/${postId}/like`, method: 'POST' }),
      async onQueryStarted(postId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          postsApi.util.updateQueryData('getPostDetails', { postId, page: 1, limit: 10 }, (draft) => {
            if (draft.post) {
              draft.post.likeCount = Number(draft.post.likeCount) + 1;
              draft.post.hasLiked = true;
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      }
    }),
    removeLike: build.mutation<void, number>({
      query: (postId) => ({
        url: "/remove",
        method: "DELETE",
        body: { postId },
      }),
      async onQueryStarted(postId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          postsApi.util.updateQueryData('getPostDetails', { postId, page: 1, limit: 10 }, (draft) => {
            if (draft.post) {
              draft.post.likeCount = Math.max(0, Number(draft.post.likeCount) - 1);
              draft.post.hasLiked = false;
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    getLikesByPost: build.query({
      query: (postId: number) => `/post/${postId}`,
      providesTags: ["Likes"],
    }),
    getLikesByUser: build.query({
      query: (userId: number) => `/user/${userId}`,
      providesTags: ["Likes"],
    }),
  }),
});

export const {
  useAddLikeMutation,
  useRemoveLikeMutation,
  useGetLikesByPostQuery,
  useGetLikesByUserQuery,
} = likesApi;
