import { baseApi } from "./api/baseApi";
import siteReducer from "./features/siteSlice";

export const reducer = {
  [baseApi.reducerPath]: baseApi.reducer,
  site: siteReducer,
};
