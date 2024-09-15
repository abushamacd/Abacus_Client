/* eslint-disable @typescript-eslint/no-explicit-any */
import { IMeta } from "../../types";
import { IVehicle } from "../../types/vehicle";
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
    // get all vehicles
    getVehicles: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: "/vehicle",
          method: "GET",
          params: arg,
        };
      },
      transformResponse: (response: IVehicle[], meta: IMeta) => {
        return {
          vehicles: response,
          meta,
        };
      },
      providesTags: [tagTypes.vehicle],
    }),
    // get vehicle
    getVehicle: build.query({
      query: (id: string | string[] | undefined) => ({
        url: `/vehicle/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.vehicle],
    }),
    // delete vehicle
    deleteVehicle: build.mutation({
      query: (id: string) => ({
        url: `/vehicle/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.vehicle],
    }),
  }),
});

export const {
  useCreateVehicleMutation,
  useGetVehiclesQuery,
  useGetVehicleQuery,
  useDeleteVehicleMutation,
} = vehicleApi;
