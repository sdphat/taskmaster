import axios, { AxiosError, HttpStatusCode } from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === HttpStatusCode.Unauthorized) {
      await axios.get(import.meta.env.VITE_BACKEND_URL + "/auth/refresh", {
        withCredentials: true,
      });
      return axiosInstance(error.config!);
    }
  }
);

export default axiosInstance;
