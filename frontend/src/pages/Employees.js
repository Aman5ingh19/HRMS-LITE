import React, { useState, useEffect } from 'react';
import { employeeAPI } from '../services/api';
import EmployeeForm from '../components/EmployeeForm';
import EmployeeTable from '../components/EmployeeTable';
import './Employees.css';

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await employeeAPI.getAll();
            setEmployees(data);
        } catch (err) {
            setError(err.error || 'Failed to fetch employees');
            console.error('Fetch employees error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddEmployee = async (employeeData) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            await employeeAPI.add(employeeData);
            setSuccess('Employee added successfully!');

            // Refresh employee list
            await fetchEmployees();

            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.error || 'Failed to add employee');
            console.error('Add employee error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEmployee = async (empId) => {
        if (!window.confirm(`Are you sure you want to delete employee ${empId}?`)) {
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            await employeeAPI.delete(empId);
            setSuccess('Employee deleted successfully!');

            // Refresh employee list
            await fetchEmployees();

            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.error || 'Failed to delete employee');
            console.error('Delete employee error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="employees-page">
            <h1>Employee Management</h1>
            <p className="page-subtitle">Add, view, and manage employees</p>

            {error && (
                <div className="alert alert-error">
                    <span>❌</span> {error}
                </div>
            )}

            {success && (
                <div className="alert alert-success">
                    <span>✅</span> {success}
                </div>
            )}

            <EmployeeForm onSubmit={handleAddEmployee} loading={loading} />
            <EmployeeTable
                employees={employees}
                onDelete={handleDeleteEmployee}
                loading={loading}
            />
        </div>
    );
};

export default Employees;
