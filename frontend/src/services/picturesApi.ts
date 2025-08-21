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
  }),
});

export const { useUploadImageMutation } = picturesApi;
