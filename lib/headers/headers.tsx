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

// Header untuk multipart/form-data (file upload)
// Content-Type tidak di-set agar browser otomatis set boundary
export const getMultipartHeaders = () => {
  const headers: { Authorization?: string } = {};
  if (typeof window !== "undefined") {
    const token = Cookies.get("accessToken");
    if (token) headers.Authorization = token;
  }
  return headers;
};
