/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import axios from "axios";

const apiBaseUrl = import.meta.env.DEV
  ? import.meta.env.VITE_API_BASE_URL
  : "/api/v1";

export const quillStackApi = axios.create({
  baseURL: apiBaseUrl,
  timeout: 80000, // 80 secs
});
