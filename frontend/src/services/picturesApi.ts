import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_BASE_URL;


export const picturesApi = createApi({
  reducerPath: "pictureApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/picture`,
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
