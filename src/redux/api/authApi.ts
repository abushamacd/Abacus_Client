/* eslint-disable @typescript-eslint/no-explicit-any */
import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";
const AUTH_URL = "/auth";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // sign in
    signIn: build.mutation({
      query: (userData: any) => ({
        url: `${AUTH_URL}/signin`,
        method: "POST",
        data: userData,
      }),
    }),
    // sign up
    signUp: build.mutation({
      query: (userData: any) => ({
        url: `${AUTH_URL}/signup`,
        method: "POST",
        data: userData,
      }),
      invalidatesTags: [tagTypes.user],
    }),
    // profile activation
    activation: build.mutation({
      query: (token: string) => ({
        url: `${AUTH_URL}/account-active/${token}`,
        method: "PATCH",
      }),
    }),
    // change password
    changePassword: build.mutation({
      query: (userData: any) => ({
        url: `${AUTH_URL}/change-password`,
        method: "PATCH",
        data: userData,
      }),
    }),
    // forget password
    forgetPassword: build.mutation({
      query: (data: any) => ({
        url: `${AUTH_URL}/forget-password`,
        method: "PATCH",
        data: data,
      }),
    }),
    // reset password
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
