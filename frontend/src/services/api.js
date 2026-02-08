import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const employeeAPI = {
    getAll: async () => {
        try {
            const response = await api.get('/employees/');
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Failed to fetch employees' };
        }
    },

    add: async (employeeData) => {
        try {
            const response = await api.post('/employees/add/', employeeData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Failed to add employee' };
        }
    },

    delete: async (empId) => {
        try {
            const response = await api.delete(`/employees/delete/${empId}/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Failed to delete employee' };
        }
    },
};

export const attendanceAPI = {
    checkIn: async (employeeId) => {
        try {
            const response = await api.post('/attendance/checkin/', {
                employee_id: employeeId,
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Failed to check in' };
        }
    },

    checkOut: async (employeeId) => {
        try {
            const response = await api.post('/attendance/checkout/', {
                employee_id: employeeId,
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Failed to check out' };
        }
    },

    getAll: async () => {
        try {
            const response = await api.get('/attendance/');
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Failed to fetch attendance' };
        }
    },

    getByEmployee: async (employeeId) => {
        try {
            const response = await api.get(`/attendance/${employeeId}/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Failed to fetch employee attendance' };
        }
    },
};

export default api;
