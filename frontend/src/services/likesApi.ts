import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
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
  endpoints: (builder) => ({
    addLike: builder.mutation({
      query: (postId: number) => ({
        url: "/add",
        method: "POST",
        body: { postId },
      }),
      invalidatesTags: ["Likes"],
    }),
    removeLike: builder.mutation({
      query: (postId: number) => ({
        url: "/remove",
        method: "DELETE",
        body: { postId },
      }),
      invalidatesTags: ["Likes"],
    }),
    getLikesByPost: builder.query({
      query: (postId: number) => `/post/${postId}`,
      providesTags: ["Likes"],
    }),
    getLikesByUser: builder.query({
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
