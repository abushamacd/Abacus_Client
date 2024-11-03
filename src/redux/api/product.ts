/* eslint-disable @typescript-eslint/no-explicit-any */
import { IMeta } from "../../types/index.ts";
import { IProduct } from "../../types/product.ts";
import { tagTypes } from "../tag-types.ts";
import { baseApi } from "./baseApi.ts";

export const productApi = baseApi.injectEndpoints({
  endpoints: (build: any) => ({
    // create product
    createProduct: build.mutation({
      query: (data: any) => ({
        url: `/product`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: [tagTypes.product],
    }),
    // get all products
    getProducts: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: "/product",
          method: "GET",
          params: arg,
        };
      },
      transformResponse: (response: IProduct[], meta: IMeta) => {
        return {
          products: response,
          meta,
        };
      },
      providesTags: [tagTypes.product],
    }),
    // get product
    getProduct: build.query({
      query: (id: string | string[] | undefined) => ({
        url: `/product/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.product],
    }),
    // update
    updateProduct: build.mutation({
      query: (data: { id: any; body: any }) => ({
        url: `/product/${data.id}`,
        method: "PATCH",
        data: data.body,
      }),
      invalidatesTags: [tagTypes.product],
    }),
    // delete product
    deleteProduct: build.mutation({
      query: (id: string) => ({
        url: `/product/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.product, tagTypes.supplier],
    }),
    // delete product
    deleteProducts: build.mutation({
      query: (data: any) => ({
        url: `/product`,
        method: "DELETE",
        data: data,
      }),
      invalidatesTags: [tagTypes.product, tagTypes.supplier],
    }),
  }),
});

export const {
  useCreateProductMutation,
  useGetProductsQuery,
  useGetProductQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useDeleteProductsMutation,
} = productApi;
