/* eslint-disable @typescript-eslint/no-explicit-any */
import { IMeta } from "../../types/index.ts";
import { IInvoice } from "../../types/invoice.ts";
import { tagTypes } from "../tag-types.ts";
import { baseApi } from "./baseApi.ts";

export const invoiceApi = baseApi.injectEndpoints({
  endpoints: (build: any) => ({
    // create invoice
    createInvoice: build.mutation({
      query: (data: any) => ({
        url: `/invoice`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: [tagTypes.invoice, tagTypes.product, tagTypes.user],
    }),
    // get all invoices
    getInvoices: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: "/invoice",
          method: "GET",
          params: arg,
        };
      },
      transformResponse: (response: IInvoice[], meta: IMeta) => {
        return {
          invoices: response,
          meta,
        };
      },
      providesTags: [tagTypes.invoice],
    }),
    // get invoice
    getInvoice: build.query({
      query: (id: string | string[] | undefined) => ({
        url: `/invoice/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.invoice],
    }),
    // update invoice
    updateInvoice: build.mutation({
      query: (data: { id: any; body: any }) => ({
        url: `/invoice/${data.id}`,
        method: "PATCH",
        data: data.body,
      }),
      invalidatesTags: [tagTypes.invoice, tagTypes.user, tagTypes.product],
    }),
    // delete invoice
    deleteInvoice: build.mutation({
      query: (id: string) => ({
        url: `/invoice/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.invoice, tagTypes.product],
    }),
    // delete invoices
    deleteInvoices: build.mutation({
      query: (data: any) => ({
        url: `/invoice`,
        method: "DELETE",
        data: data,
      }),
      invalidatesTags: [tagTypes.invoice, tagTypes.user],
    }),
  }),
});

export const {
  useCreateInvoiceMutation,
  useGetInvoicesQuery,
  useGetInvoiceQuery,
  useUpdateInvoiceMutation,
  useDeleteInvoiceMutation,
  useDeleteInvoicesMutation,
} = invoiceApi;
