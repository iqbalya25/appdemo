// lib/axios.ts
import axios from "axios";
import { getSession } from "next-auth/react";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://appdemo-343470541894.asia-southeast2.run.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    // Get the session
    const session = await getSession();

    // If session exists, add the token
    if (session?.user?.accessToken) {
      config.headers["Authorization"] = `Bearer ${session.user.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 403) {
      // Handle unauthorized access
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
