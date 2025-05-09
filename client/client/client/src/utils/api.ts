import axios from "axios"

const BASE_URL = "http://localhost:8000/api/v1"



const baseApi = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, 
    headers: {
        "Content-Type": "application/json",
    },
});


baseApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 ) {
            
            try {
                await axios.post(`${BASE_URL}/newToken`, {}, {
                    withCredentials: true,
                });
                return baseApi(originalRequest); 
            } catch (tokenRefreshError) {
                return Promise.reject(tokenRefreshError);
            }
        }

        return Promise.reject(error);
    }
);


export default baseApi;