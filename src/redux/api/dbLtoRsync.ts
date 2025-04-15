/* eslint-disable @typescript-eslint/no-explicit-any */
import { IMeta } from "../../types";
import { baseApi } from "./baseApi";

export const dbsyncApi = baseApi.injectEndpoints({
  endpoints: (build: any) => ({
    testSBSync: build.query({
      query: () => ({
        url: `/dbsync`,
        method: "GET",
      }),
    }),
    getUnsyncsData: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: "/dbsync/unSyncLtoR",
          method: "GET",
          params: arg,
        };
      },
      transformResponse: (response: any[], meta: IMeta) => {
        return {
          unSyncsData: response,
          meta,
        };
      },
      // providesTags: [tagTypes.product],
    }),
    sendUnsyncsData: build.mutation({
      query: (data: any) => ({
        url: `/dbsync/unSyncLtoR`,
        method: "PATCH",
        data: data,
      }),
    }),
  }),
});

export const {
  useTestSBSyncQuery,
  useGetUnsyncsDataQuery,
  useSendUnsyncsDataMutation,
} = dbsyncApi;
