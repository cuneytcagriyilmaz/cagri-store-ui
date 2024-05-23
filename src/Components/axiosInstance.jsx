import axios from 'axios';

// Axios için ortak yapılandırma
const axiosInstance = axios.create({
    baseURL: 'http://localhost:9000/api',
    withCredentials: true
});

// Her istekten önce kimlik bilgilerini ekleyin
axiosInstance.interceptors.request.use((config) => {
    const encodedCredentials = localStorage.getItem('credentials');
    if (encodedCredentials) {
        config.headers['Authorization'] = `Basic ${encodedCredentials}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosInstance;
