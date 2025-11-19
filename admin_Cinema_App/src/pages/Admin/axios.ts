import axios from "axios";

const api = axios.create({
  baseURL: "https://popcore-facrh7bjd0bbatbj.swedencentral-01.azurewebsites.net",
});

export default api;
