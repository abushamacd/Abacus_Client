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
          url: "/dbsync/unsync",
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
  }),
});

export const { useTestSBSyncQuery, useGetUnsyncsDataQuery } = dbsyncApi;
