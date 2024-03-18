import axios from "axios";

const api = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}`,
    headers: {
        "Content-type": "application/json",
        Accept: "application/json",
    },
});

// List of all the endpoints
export const sendOtp = (data) => api.post("/auth/otp", data);
export const verifyOtp = (data) => api.post("/auth/verifyOTP", data);
export const Refresh = (data) => api.post("/auth/refresh", data);
export const Register = (data) => api.post("/auth/register", data);
export const login = (data) => api.post("/auth/login", data);
export const logout = (data) => api.get("/auth/logout", data);

export const getAllNotes = (data) => api.get("/note/all", data);
export const getNote = (data) => api.get("/note/one", data);
export const modifyNote = (data) => api.post(`/note/modify`, data);
export const createNote = (data) => api.post(`/note/create`, data);
export const deleteNote = (data) => api.delete(`/note/delete`, data);

export const modifyFavSummaries = (data) =>
    api.post(`/summaries/modifyFav`, data);
export const fetchAllSummaries = (data) => api.get(`/summaries/getAll`, data);
export const fetchFavSummaries = (data) => api.get(`/summaries/getFav`, data);
export const fetchOneSummary = (data) => api.get(`/summaries/getOne`, data);
export const saveSummary = (data) => api.post(`/summaries/save`, data);

// Interceptors
api.interceptors.response.use(
    (config) => {
        return config;
    },
    async (error) => {
        const originalRequest = error.config;
        if (
            error.response.status === 401 &&
            originalRequest &&
            !originalRequest._isRetry
        ) {
            originalRequest.isRetry = true;
            try {
                await axios.get(`${process.env.REACT_APP_API_URL}/api/refresh`);

                return api.request(originalRequest);
            } catch (err) {
                console.log(err.message);
            }
        }
        throw error;
    },
);

export default api;
