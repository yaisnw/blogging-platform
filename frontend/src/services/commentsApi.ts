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
  tagTypes: ["Comments"],
  endpoints: (build) => ({
    getCommentsByPostId: build.query<
      { comments: comment[] }, 
      number
    >({
      query: (postId) => `/post/${postId}`,
      providesTags: (result, error, postId) =>
        result
          ? [
              ...result.comments.map(
                (comment) => ({ type: "Comments", id: comment.id } as const)
              ),
              { type: "Comments", id: `POST-${postId}` },
            ]
          : [{ type: "Comments", id: `POST-${postId}` }],
    }),
  }),
});

export const { useGetCommentsByPostIdQuery } = commentsApi;
