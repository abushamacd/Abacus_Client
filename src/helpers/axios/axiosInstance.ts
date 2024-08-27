/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { authKey } from "../../constants/storageKey";
import { getNewAccessToken } from "../../services/auth.service";
import { IGenericErrorResponse, ResponseSuccessType } from "../../types";
import {
  getFromLocalStorage,
  setToLocalStorage,
} from "../../utils/local-storage";
import axios from "axios";

const instance = axios.create();

instance.defaults.headers.post["Content-Type"] = "application/json";
instance.defaults.headers["Accept"] = "application/json";
instance.defaults.timeout = 60000;

instance.interceptors.request.use(
  function (config) {
    const accessToken = getFromLocalStorage(authKey);

    if (accessToken) {
      config.headers.Authorization = accessToken;
    }
    return config;
  },

  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  //@ts-ignore
  function (response) {
    const responseObject: ResponseSuccessType = {
      data: response?.data?.data,
      meta: response?.data?.meta,
    };
    return responseObject;
  },

  async function (error) {
    const config = error?.config;
    if (error?.response?.status === 403 && !config?.sent) {
      // @ts-ignore
      config.sent = true;
      // const responseObject: IGenericErrorResponse = {
      //   statusCode: error?.response?.data?.statusCode || 403,
      //   message: error?.response?.data?.message || "Something went wrong",
      //   errorMessages: error?.response?.data?.message,
      // };
      // // return responseObject;
      // return Promise.reject(error);

      const response = await getNewAccessToken();
      const accessToken = response?.data?.accessToken;
      if (accessToken) {
        config.headers.Authorization = accessToken;
        setToLocalStorage(authKey, accessToken);
      }
      return instance(config);
    } else {
      // @ts-ignore
      const responseObject: IGenericErrorResponse = {
        statusCode: error?.response?.data?.statusCode || 500,
        message: error?.response?.data?.message || "Something went wrong",
        errorMessages: error?.response?.data?.message,
      };
      // return responseObject;
      return Promise.reject(error);
    }
  }
);

export { instance };
