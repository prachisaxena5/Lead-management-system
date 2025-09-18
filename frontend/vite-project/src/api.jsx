// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // change to your deployed backend URL
  withCredentials: true // <-- important for httpOnly cookie
});

export default api;
