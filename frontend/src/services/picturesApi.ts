import { baseApi } from "./baseApi";

export const picturesApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (build) => ({
    uploadImage: build.mutation<string, FormData>({
      query: (formData) => ({
        url: "/picture",
        method: "POST",
        body: formData,
      }),
    }),
    deleteImage: build.mutation<string, string>({
      query: (imageUrl) => ({
        url: "/picture/deleteByUrl",
        method: "DELETE",
        body: { imageUrl }
      })
    })
  }),
});

export const { useUploadImageMutation, useDeleteImageMutation } = picturesApi;