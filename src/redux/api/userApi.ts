/* eslint-disable @typescript-eslint/no-explicit-any */
import { IMeta, ResponseSuccessType } from "../../types";
import { IUser } from "../../types/user";
import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (build: any) => ({
    // get user profile
    getUserProfile: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: `/user/profile`,
          method: "GET",
          params: arg,
        };
      },
      transformResponse: (response: ResponseSuccessType) => {
        return {
          response,
        };
      },
      providesTags: [tagTypes.profile],
    }),
    // update user
    updateUserProfile: build.mutation({
      query: (data: any) => ({
        url: `/user/profile`,
        method: "PATCH",
        data: data,
      }),
      invalidatesTags: [tagTypes.profile],
    }),
    // get all users
    getUsers: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: "/user",
          method: "GET",
          params: arg,
        };
      },
      transformResponse: (response: IUser[], meta: IMeta) => {
        return {
          users: response,
          meta,
        };
      },
      providesTags: [tagTypes.user],
    }),
    // delete user
    deleteUser: build.mutation({
      query: (id: string) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.user],
    }),
    // upload photo
    uploadPhoto: build.mutation({
      query: (data: any) => ({
        url: `/user/photo`,
        method: "POST",
        data: data,
        contentType: "multipart/form-data",
      }),
      invalidatesTags: [tagTypes.user],
    }),
    // get user
    getUser: build.query({
      query: (id: string | string[] | undefined) => ({
        url: `/user/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useUploadPhotoMutation,
  useGetUserQuery,
} = userApi;
