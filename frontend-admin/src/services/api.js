import axios from 'axios';

const API = axios.create({
    baseURL: 'https://mithms-backend.onrender.com/api',
});

// Add a request interceptor to add the auth token to headers
API.interceptors.request.use(
    (config) => {
        const adminInfo = localStorage.getItem('adminInfo');
        if (adminInfo) {
            const { token } = JSON.parse(adminInfo);
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default API;
