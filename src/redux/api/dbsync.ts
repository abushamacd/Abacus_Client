/* eslint-disable @typescript-eslint/no-explicit-any */
import { IMeta } from "../../types";
import { baseApi } from "./baseApi";

export const dbsyncApi = baseApi.injectEndpoints({
  endpoints: (build: any) => ({
    // test database connections
    testSBSync: build.query({
      query: () => ({
        url: `/dbsync`,
        method: "GET",
      }),
    }),
    // get data from local
    getUnsyncsDataFromL: build.query({
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
    }),
    // send data to remote
    sendUnsyncsDataToR: build.mutation({
      query: (data: any) => ({
        url: `/dbsync/unSyncLtoR`,
        method: "PATCH",
        data: data,
      }),
    }),
    // get data from remote
    getUnsyncsDataFromR: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: "/dbsync/unSyncRtoL",
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
    }),
    // send data to local
    sendUnsyncsDataToL: build.mutation({
      query: (data: any) => ({
        url: `/dbsync/unSyncRtoL`,
        method: "PATCH",
        data: data,
      }),
    }),
    // get unmarge data
    getUnMargeData: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: "/dbsync/unmarge",
          method: "GET",
          params: arg,
        };
      },
      transformResponse: (response: any[], meta: IMeta) => {
        return {
          unMargeData: response,
          meta,
        };
      },
    }),
    // delete unmarge data
    deleteUnMarge: build.mutation({
      query: (data: any) => ({
        url: `/dbsync/unmarge`,
        method: "DELETE",
        data: data,
      }),
    }),
  }),
});

export const {
  useTestSBSyncQuery,
  useGetUnsyncsDataFromLQuery,
  useSendUnsyncsDataToRMutation,
  useGetUnsyncsDataFromRQuery,
  useSendUnsyncsDataToLMutation,
  useGetUnMargeDataQuery,
  useDeleteUnMargeMutation,
} = dbsyncApi;
