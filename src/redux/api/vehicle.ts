/* eslint-disable @typescript-eslint/no-explicit-any */
import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

export const vehicleApi = baseApi.injectEndpoints({
  endpoints: (build: any) => ({
    // create
    createVehicle: build.mutation({
      query: (data: any) => ({
        url: `/vehicle`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: [tagTypes.vehicle],
    }),
  }),
});

export const { useCreateVehicleMutation } = vehicleApi;
