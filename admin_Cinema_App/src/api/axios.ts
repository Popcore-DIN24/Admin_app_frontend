import axios from "axios";

const api1 = axios.create({
  baseURL: "https://wdfinpopcorebackend-fyfuhuambrfnc3hz.swedencentral-01.azurewebsites.net",
});

// Auto attach token
api1.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api1.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 403 || err.response?.status === 401) {
      localStorage.removeItem("adminToken");
      window.location.href = "/admin/login";
    }
    return Promise.reject(err);
  }
);

export default api1;
