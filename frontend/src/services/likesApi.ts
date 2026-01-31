import { postsApi } from "./postsApi";
import { baseApi } from "./baseApi";
import type { PostDetailsResponse } from "@/types/rtkTypes";

export const likesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addLike: build.mutation<void, number>({
      query: (postId) => ({ url: `/like/${postId}/like`, method: 'POST' }),
      async onQueryStarted(postId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          postsApi.util.updateQueryData('getPostDetails', { postId, page: 1, limit: 10 }, (draft: PostDetailsResponse) => {
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
        url: "/like/remove",
        method: "DELETE",
        body: { postId },
      }),
      async onQueryStarted(postId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          postsApi.util.updateQueryData('getPostDetails', { postId, page: 1, limit: 10 }, (draft: PostDetailsResponse) => {
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
      query: (postId: number) => `/like/post/${postId}`,
      providesTags: ["Likes"],
    }),
    getLikesByUser: build.query({
      query: (userId: number) => `/like/user/${userId}`,
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