import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const picturesApi = createApi({
  reducerPath: "pictureApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/picture",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
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
