import axios from "axios";
const HttpClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

HttpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  config.headers = {
    ...config.headers,
    Authorization: `Bearer ${token}`,
  };
  return config;
});

// Cookies.remove('company_id');

const responseErrorInterceptor = (error) => {
  if ((error.response && error.response.status == 401)) {
      localStorage.removeItem('token');
      window.location.href = '/login';
  }
  return Promise.reject(error);
};

HttpClient.interceptors.response.use(
  (response) => response,
  responseErrorInterceptor
);

export default HttpClient;
