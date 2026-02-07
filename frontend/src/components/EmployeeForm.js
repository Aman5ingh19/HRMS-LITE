import React, { useState } from 'react';
import './EmployeeForm.css';

const EmployeeForm = ({ onSubmit, loading }) => {
    const [formData, setFormData] = useState({
        employee_id: '',
        full_name: '',
        email: '',
        department: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const resetForm = () => {
        setFormData({
            employee_id: '',
            full_name: '',
            email: '',
            department: '',
        });
    };

    return (
        <div className="employee-form-container">
            <h2>Add New Employee</h2>
            <form onSubmit={handleSubmit} className="employee-form">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="employee_id">Employee ID *</label>
                        <input
                            type="text"
                            id="employee_id"
                            name="employee_id"
                            value={formData.employee_id}
                            onChange={handleChange}
                            required
                            
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="full_name">Full Name *</label>
                        <input
                            type="text"
                            id="full_name"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            required
                            
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="email">Email *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="department">Department *</label>
                        <select
                            id="department"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        >
                            <option value="">Select Department</option>
                            <option value="IT">IT</option>
                            <option value="HR">HR</option>
                            <option value="Finance">Finance</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Operations">Operations</option>
                            <option value="Sales">Sales</option>
                        </select>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Adding...' : 'Add Employee'}
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={resetForm}
                        disabled={loading}
                    >
                        Clear
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EmployeeForm;
