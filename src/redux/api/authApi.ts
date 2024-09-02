/* eslint-disable @typescript-eslint/no-explicit-any */
import { tagTypes } from "../tag-types";
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
    signUp: build.mutation({
      query: (userData: any) => ({
        url: `${AUTH_URL}/signup`,
        method: "POST",
        data: userData,
      }),
      invalidatesTags: [tagTypes.user],
    }),
    changePassword: build.mutation({
      query: (userData: any) => ({
        url: `${AUTH_URL}/change-password`,
        method: "PATCH",
        data: userData,
      }),
    }),
  }),
});

export const {
  useSignInMutation,
  useChangePasswordMutation,
  useSignUpMutation,
} = authApi;
