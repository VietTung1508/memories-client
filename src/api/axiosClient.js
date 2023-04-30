import axios from "axios";

const axiosClient = axios.create({
  withCredentials: false,
  baseURL: "https://memories-api-1an9.onrender.com/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
