import axios from "axios";

const api = axios.create({
  baseURL:
    "https://smart-leads-dashboard-v922.onrender.com/api",
});

export default api;