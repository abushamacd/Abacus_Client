/* eslint-disable @typescript-eslint/no-explicit-any */
import { IMeta } from "../../types";
import { ISupplier } from "../../types/supplier.ts";
import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

export const supplierApi = baseApi.injectEndpoints({
  endpoints: (build: any) => ({
    // create
    createSupplier: build.mutation({
      query: (data: any) => ({
        url: `/supplier`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: [tagTypes.supplier],
    }),
    // get all suppliers
    getSuppliers: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: "/supplier",
          method: "GET",
          params: arg,
        };
      },
      transformResponse: (response: ISupplier[], meta: IMeta) => {
        return {
          suppliers: response,
          meta,
        };
      },
      providesTags: [tagTypes.supplier],
    }),
    // get supplier
    getSupplier: build.query({
      query: (id: string | string[] | undefined) => ({
        url: `/supplier/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.supplier],
    }),
    // update
    updateSupplier: build.mutation({
      query: (data: { id: any; body: any }) => ({
        url: `/supplier/${data.id}`,
        method: "PATCH",
        data: data.body,
      }),
      invalidatesTags: [tagTypes.supplier],
    }),
    // delete supplier
    deleteSupplier: build.mutation({
      query: (id: string) => ({
        url: `/supplier/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.supplier],
    }),
  }),
});

export const {
  useCreateSupplierMutation,
  useGetSuppliersQuery,
  useGetSupplierQuery,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} = supplierApi;
