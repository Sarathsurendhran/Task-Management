
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

const API_URL = "http://localhost:8000/api/";

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Function to check if the token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const { exp } = jwtDecode(token);
    if (Date.now() >= exp * 1000) {
      return true;
    }
    return false;
  } catch (error) {
    return true;
  }
};

// Refresh token logic
const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await axios.post(`${API_URL}token/refresh/`, {
      refresh: refreshToken,
    });

    const newAccessToken = response.data.access;
    localStorage.setItem("token", newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error("Failed to refresh access token", error);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
    return null;
  }
};

// Request interceptor to check token expiration and refresh if needed
axiosInstance.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem("token");

    if (!config.url.includes("login/") && !config.url.includes("register/")) {
      if (isTokenExpired(token)) {
        token = await refreshAccessToken();
      }
    }

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (!error.config.url.includes("token/")) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    if (error.response.data) {
      console.log("error.response.data", error.response.data);
      const message = error.response.data.title
        ? error.response.data.title[0]
        : "An error occurred.";
      toast.error(`Error: ${message}`);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
