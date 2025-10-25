import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Attach the access token on each request
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Function to refresh access token using refresh token
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axiosInstance.post('/token/refresh/', { refresh: refreshToken });
        localStorage.setItem('access_token', response.data.access);

        if (originalRequest.data instanceof FormData) {
          const rebuilt = new FormData();
          for (const [key, value] of originalRequest.data.entries()) {
            rebuilt.append(key, value);
          }
          originalRequest.data = rebuilt;
        } else if (typeof originalRequest.data === 'string') {
          const jsonData = JSON.parse(originalRequest.data);
          originalRequest.data = JSON.stringify(jsonData);
        }

        originalRequest.headers['Authorization'] = 'Bearer ' + response.data.access;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Optional: logout or redirect on refresh failure
        alert('Session expired. Please login again.');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login'; // Redirect to login
        return Promise.reject(refreshError);
        
      }
    }

    return Promise.reject(error);
  }
);


// Auth endpoints
export const login = data => axiosInstance.post("login/", data);
export const signup = data => axiosInstance.post("signup/", data, { headers: { "Content-Type": "multipart/form-data" } });

// Organizations CRUD
export const getOrganizations = () => axiosInstance.get("organizations/");
export const addOrganization = data => axiosInstance.post("organizations/", data, { headers: { "Content-Type": "multipart/form-data" } });
export const deleteOrganization = id => axiosInstance.delete(`organizations/${id}/`);
export const updateOrganization = (id, data) => axiosInstance.patch(`organizations/${id}/`, data, { headers: {  } });

// OrgUser CRUD (users within organization)
export const getOrgUsers = orgId => axiosInstance.get(`orgusers/?organization=${orgId}`);
export const addOrgUser = (data, organizationId) => 
    axiosInstance.post(`orgusers/?organization=${organizationId}`, data, { 
      headers: { "Content-Type": "multipart/form-data" } 
    });
export const deleteOrgUser = id => axiosInstance.delete(`orgusers/${id}/`);
export const updateOrgUser = (id, data) => axiosInstance.patch(`orgusers/${id}/`, data, { headers: { "Content-Type": "multipart/form-data" } });

// Pending requests (actions)
export const getPendingRequests = () => axiosInstance.get("pending-requests/dashboard");
export const createPendingRequest = data => axiosInstance.post("pending-requests/", data);
export const updatePendingRequest = (id, status) => axiosInstance.patch(`pending-requests/${id}/status/`, { status });
// src/api.js
export const updateUser = (userId, data) => 
  axiosInstance.patch(`/users/${userId}/update/`, data);
// src/api.js



