// src/lib/headers/headers.js
import Cookies from "js-cookie";

export const getHeaders = () => {
  const headers: { "Content-Type": string; Authorization?: string } = {
    "Content-Type": "application/json",
  };
  if (typeof window !== "undefined") {
    const token = Cookies.get("accessToken");
    if (token) headers.Authorization = token;
  }
  return headers;
};
