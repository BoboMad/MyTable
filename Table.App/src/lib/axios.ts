import Axios, { AxiosError } from "axios";

const API_BASE_URL = "https://localhost:7012";

export const axios = Axios.create({
  baseURL: API_BASE_URL,
});


axios.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axios;