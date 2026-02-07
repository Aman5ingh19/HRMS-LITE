import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Employee API calls
export const employeeAPI = {
    // Get all employees
    getAll: async () => {
        try {
            const response = await api.get('/employees/');
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Failed to fetch employees' };
        }
    },

    // Add new employee
    add: async (employeeData) => {
        try {
            const response = await api.post('/employees/add/', employeeData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Failed to add employee' };
        }
    },

    // Delete employee
    delete: async (empId) => {
        try {
            const response = await api.delete(`/employees/delete/${empId}/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Failed to delete employee' };
        }
    },
};

// Attendance API calls
export const attendanceAPI = {
    // Check-in
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

    // Check-out
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

    // Get all attendance records
    getAll: async () => {
        try {
            const response = await api.get('/attendance/');
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Failed to fetch attendance' };
        }
    },

    // Get attendance by employee ID
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
