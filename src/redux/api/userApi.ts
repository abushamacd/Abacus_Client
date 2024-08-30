/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseSuccessType } from "../../types";
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
  }),
});

export const { useGetUserProfileQuery, useUpdateUserProfileMutation } = userApi;
