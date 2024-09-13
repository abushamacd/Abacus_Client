/* eslint-disable @typescript-eslint/no-explicit-any */
import { IMeta } from "../../types";
import { IVehicleRoute } from "../../types/vehicleRoute";
import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

export const vehicleRouteApi = baseApi.injectEndpoints({
  endpoints: (build: any) => ({
    // create
    createVehicleRoute: build.mutation({
      query: (data: any) => ({
        url: `/vehicleRoute`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: [tagTypes.vRoute],
    }),
    // gets
    getVehicleRoutes: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: "/vehicleRoute",
          method: "GET",
          params: arg,
        };
      },
      transformResponse: (response: IVehicleRoute[], meta: IMeta) => {
        return {
          vehicleRoutes: response,
          meta,
        };
      },
      providesTags: [tagTypes.vRoute],
    }),
    // update
    updateVehicleRoute: build.mutation({
      query: (data: { id: any; body: any }) => ({
        url: `/vehicleRoute/${data.id}`,
        method: "PATCH",
        data: data.body,
      }),
      invalidatesTags: [tagTypes.vRoute],
    }),
    // delete
    deleteVehicleRoute: build.mutation({
      query: (id: string) => ({
        url: `/vehicleRoute/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.vRoute],
    }),
  }),
});

export const {
  useCreateVehicleRouteMutation,
  useGetVehicleRoutesQuery,
  useUpdateVehicleRouteMutation,
  useDeleteVehicleRouteMutation,
} = vehicleRouteApi;
