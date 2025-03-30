/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";

export const dbsyncApi = baseApi.injectEndpoints({
  endpoints: (build: any) => ({
    testSBSync: build.query({
      query: () => ({
        url: `/dbsync`,
        method: "GET",
      }),
    }),
  }),
});

export const { useTestSBSyncQuery } = dbsyncApi;
