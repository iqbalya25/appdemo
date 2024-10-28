// lib/axios.ts
import axios from "axios";
import { getSession } from "next-auth/react";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  api.interceptors.request.use(
    async (config) => {
      const session = await getSession();
      if (session?.user?.accessToken) {
        config.headers.Authorization = `Bearer ${session.user.accessToken}`;
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
