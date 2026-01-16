import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach Access Token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 & Refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loop if refresh itself fails
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = Cookies.get("refresh_token");
      if (refreshToken) {
        try {
          // Call refresh endpoint with Refresh Token in Authorization header
          const res = await axios.post(
            `${API_URL}/auth/refresh`,
            {},
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            }
          );

          if (res.data.access_token) {
            // Update cookies
            Cookies.set("token", res.data.access_token, { expires: 1/96 }); // 15 mins
            if (res.data.refresh_token) {
              Cookies.set("refresh_token", res.data.refresh_token, { expires: 7 }); // 7 days
            }

            // Update header and retry original request
            api.defaults.headers.common["Authorization"] = `Bearer ${res.data.access_token}`;
            originalRequest.headers["Authorization"] = `Bearer ${res.data.access_token}`;
            
            return api(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed - Logout user
          Cookies.remove("token");
          Cookies.remove("refresh_token");
          window.location.href = "/login";
        }
      } else {
        // No refresh token available
        Cookies.remove("token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);


export const auth = {
  getProfile: () => api.get("/auth/me"),
};

export const compliance = {
  getSummary: () => api.get("/compliance/summary"),
  getStandards: () => api.get("/compliance/standards"),
};

export const policy = {
  getTemplates: () => api.get("/policies/templates"),
  getAssignments: (userId?: string) => api.get("/policies/assignments", { params: { userId } }),
  sign: (id: string) => api.post(`/policies/sign/${id}`),
  download: (id: string, companyName: string) => api.get(`/policies/download/${id}`, { params: { companyName } }),
  update: (id: string, content: string) => api.post(`/policies/${id}`, { content }),
  getHistory: (id: string) => api.get(`/policies/${id}/history`),
};

export const evidence = {
  getHistory: (controlId: string) => api.get(`/evidence/history/${controlId}`),
  get: (id: string) => api.get(`/evidence/${id}`),
};

export const assets = {
  getAll: (userId?: string) => api.get('/assets', { params: { userId } }),
  create: (data: any) => api.post('/assets', data),
};

export const scanner = {
  getReports: () => api.get('/scanner/reports'),
};

export const reports = {
  downloadPdf: (id: string) => api.get(`/reports/${id}/pdf`, { responseType: 'blob' }),
};

export const tasks = {
  getAll: () => api.get("/tasks"),
  create: (data: any) => api.post("/tasks", data),
  update: (id: string, data: any) => api.patch(`/tasks/${id}`, data),
};

export default api;
