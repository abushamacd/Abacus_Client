/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";
const AUTH_URL = "/auth";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    signIn: build.mutation({
      query: (userData: any) => ({
        url: `${AUTH_URL}/signin`,
        method: "POST",
        data: userData,
      }),
    }),
  }),
});

export const { useSignInMutation } = authApi;
