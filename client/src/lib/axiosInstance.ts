import axios, { 
  AxiosError, 
  AxiosInstance, 
  // AxiosRequestConfig, 
  AxiosResponse, 
  // InternalAxiosRequestConfig
} from "axios";

const HttpClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL as string,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// HttpClient.interceptors.request.use((config: AxiosRequestConfig) => {
//   const token = localStorage.getItem("token");
//   if (config.headers) {
//     config.headers.Authorization = token ? `Bearer ${token}` : "";
//   } else {
//     config.headers = {
//       Authorization: token ? `Bearer ${token}` : "",
//     };
//   }
//   return config;
// });

HttpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  // Ensure headers exist
  config.headers = config.headers || {};

  // Set auth header properly
  config.headers['Authorization'] = token ? `Bearer ${token}` : "";

  return config;
});

// Error interceptor
const responseErrorInterceptor = (error: AxiosError): Promise<never> => {
  if (error.response && error.response.status === 401) {
    // Example handling:
    // localStorage.removeItem("token");
    // window.location.href = "/login";
  }
  return Promise.reject(error);
};

HttpClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  responseErrorInterceptor
);

export default HttpClient;
