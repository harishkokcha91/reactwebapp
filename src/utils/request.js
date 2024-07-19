import axios from "axios";
import { message } from "antd";
import ApiUrl from "@/config/api-url";
import storage from "./storage";

const axiosInstance = axios.create({
  timeout: 2000,
  baseURL: ApiUrl.ManApiUrl,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  function (config) {
    // Do something before sending the request
    config.headers["Authorization"] = getToken();
    return config;
  },
  function (error) {
    // Do something with the request error
    console.log('request error', error);
    return Promise.reject(error);
  }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  function (response) {
    // Any status code within the range of 2xx will cause this function to trigger.
    // Do something with response data
    console.log("axios response", response);
    return response.data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx will cause this function to trigger.
    // Do something with response error
    console.log('response error', error);
    const { response } = error;
    if (response.status === 401) {
      message.error('User not authorized!');
      window.location.href = '/login';
    }
    message.error(error.message);
    return Promise.reject(error);
  }
);

export function getToken() {
  return storage.get("token");
}

export default axiosInstance;
