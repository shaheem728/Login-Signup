import axios from 'axios';

const API_URL = 'http://localhost:8000/auth';  // Django server URL

export const signup = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/signup/`, { username, password });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/login/`, { username, password });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};