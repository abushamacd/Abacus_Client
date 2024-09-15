/* eslint-disable @typescript-eslint/no-explicit-any */
import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

export const vehicleStatementApi = baseApi.injectEndpoints({
  endpoints: (build: any) => ({
    // create
    createVehicleStatement: build.mutation({
      query: (data: any) => ({
        url: `/vehicleStatement`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: [tagTypes.vStatement],
    }),
  }),
});

export const { useCreateVehicleStatementMutation } = vehicleStatementApi;
