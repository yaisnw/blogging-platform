import { baseApi } from "./baseApi";

export const picturesApi = baseApi.injectEndpoints({

  endpoints: (build) => ({
    uploadImage: build.mutation<string, FormData>({
      query: (formData) => ({
        url: "/",
        method: "POST",
        body: formData,
      }),
    }),
    deleteImage: build.mutation<string, string>({
      query: (imageUrl) => ({
        url: "/deleteByUrl",
        method: "DELETE",
        body: { imageUrl }
      })
    })
  }),
});

export const { useUploadImageMutation, useDeleteImageMutation } = picturesApi;
