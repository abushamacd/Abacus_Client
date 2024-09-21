/* eslint-disable @typescript-eslint/no-explicit-any */
import { IMeta } from "../../types";
import { IVehicleStatement } from "../../types/vehicleStatement";
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
      invalidatesTags: [tagTypes.vStatement, tagTypes.vehicle],
    }),
    // get all
    getVehicleStatements: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: "/vehicleStatement",
          method: "GET",
          params: arg,
        };
      },
      transformResponse: (response: IVehicleStatement[], meta: IMeta) => {
        return {
          vehicleStatements: response,
          meta,
        };
      },
      providesTags: [tagTypes.vStatement],
    }),
    // update
    updateVehicleStatement: build.mutation({
      query: (data: { id: any; body: any }) => ({
        url: `/vehicleStatement/${data.id}`,
        method: "PATCH",
        data: data.body,
      }),
      invalidatesTags: [tagTypes.vStatement, tagTypes.vehicle],
    }),
    // delete
    deleteVehicleStatement: build.mutation({
      query: (id: string) => ({
        url: `/vehicleStatement/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.vStatement, tagTypes.vehicle],
    }),
  }),
});

export const {
  useCreateVehicleStatementMutation,
  useGetVehicleStatementsQuery,
  useUpdateVehicleStatementMutation,
  useDeleteVehicleStatementMutation,
} = vehicleStatementApi;
