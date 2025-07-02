/* eslint-disable @typescript-eslint/no-explicit-any */
import { IMeta } from "../../types/index.ts";
import { IUnit } from "../../types/unit.ts";
import { tagTypes } from "../tag-types.ts";
import { baseApi } from "./baseApi.ts";

export const unitApi = baseApi.injectEndpoints({
  endpoints: (build: any) => ({
    // create unit
    createUnit: build.mutation({
      query: (data: any) => ({
        url: `/unit`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: [tagTypes.unit],
    }),
    // get all units
    getUnits: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: "/unit",
          method: "GET",
          params: arg,
        };
      },
      transformResponse: (response: IUnit[], meta: IMeta) => {
        return {
          units: response,
          meta,
        };
      },
      providesTags: [tagTypes.unit],
    }),
    // get unit
    getUnit: build.query({
      query: (id: string | string[] | undefined) => ({
        url: `/unit/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.unit],
    }),
    // update unit
    updateUnit: build.mutation({
      query: (data: { id: any; body: any }) => ({
        url: `/unit/${data.id}`,
        method: "PATCH",
        data: data.body,
      }),
      invalidatesTags: [tagTypes.unit],
    }),
    // delete unit
    deleteUnit: build.mutation({
      query: (id: string) => ({
        url: `/unit/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.unit],
    }),
  }),
});

export const {
  useCreateUnitMutation,
  useGetUnitsQuery,
  useGetUnitQuery,
  useUpdateUnitMutation,
  useDeleteUnitMutation,
} = unitApi;
