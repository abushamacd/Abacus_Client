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
    activation: build.mutation({
      query: (token: string) => ({
        url: `${AUTH_URL}/account-active/${token}`,
        method: "PATCH",
      }),
    }),
    changePassword: build.mutation({
      query: (userData: any) => ({
        url: `${AUTH_URL}/change-password`,
        method: "PATCH",
        data: userData,
      }),
    }),
    forgetPassword: build.mutation({
      query: (data: any) => ({
        url: `${AUTH_URL}/forget-password`,
        method: "PATCH",
        data: data,
      }),
    }),
    resetPassword: build.mutation({
      query: ({ token, data }: { token: string | undefined; data: any }) => ({
        url: `${AUTH_URL}/reset-password/${token}`,
        method: "PATCH",
        data: data,
      }),
    }),
  }),
});

export const {
  useSignInMutation,
  useChangePasswordMutation,
  useSignUpMutation,
  useActivationMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
} = authApi;
