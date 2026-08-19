/**
 * EmployeeForm — with Zod schema validation + react-hook-form
 * Provides real-time field-level error messages, controlled form state, and type-safe validation.
 */
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import './EmployeeForm.css';

// ── Custom robust Zod resolver (handles both Zod v3 and v4 error shapes) ─────
const customZodResolver = (schema) => async (values) => {
    try {
        const result = await schema.safeParseAsync(values);
        if (result.success) {
            return { values: result.data, errors: {} };
        }
        const errors = {};
        const issues = result.error?.issues || result.error?.errors || [];
        for (const issue of issues) {
            const path = Array.isArray(issue.path) ? issue.path.join('.') : issue.path;
            if (path && !errors[path]) {
                errors[path] = {
                    type: issue.code || 'validation',
                    message: issue.message,
                };
            }
        }
        return { values: {}, errors };
    } catch (err) {
        const errors = {};
        const issues = err?.issues || err?.errors || [];
        for (const issue of issues) {
            const path = Array.isArray(issue.path) ? issue.path.join('.') : issue.path;
            if (path && !errors[path]) {
                errors[path] = {
                    type: issue.code || 'validation',
                    message: issue.message,
                };
            }
        }
        return { values: {}, errors };
    }
};

// ── Zod schema (mirrors backend Pydantic schema) ──────────────────────────────
const employeeSchema = z.object({
    employee_id: z
        .string()
        .min(3, 'Employee ID must be at least 3 characters')
        .max(20, 'Employee ID cannot exceed 20 characters')
        .regex(/^[A-Za-z0-9_-]+$/, 'Only letters, numbers, hyphens, and underscores allowed'),
    full_name: z
        .string()
        .min(2, 'Full name must be at least 2 characters')
        .max(100, 'Full name cannot exceed 100 characters'),
    email: z
        .string()
        .email('Please enter a valid email address'),
    department: z
        .string()
        .min(1, 'Please select a department'),
    phone: z
        .string()
        .optional()
        .refine(v => !v || v.replace(/[\s\-+()]/g, '').length >= 10, {
            message: 'Phone number must have at least 10 digits',
        }),
    position: z.string().optional(),
});

// ── Field error component ─────────────────────────────────────────────────────
function FieldError({ message }) {
    if (!message) return null;
    return (
        <p className="field-error" role="alert">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" className="field-error-icon">
                <path d="M6 1a5 5 0 100 10A5 5 0 006 1zm0 2.5a.5.5 0 01.5.5v2.5a.5.5 0 01-1 0V4a.5.5 0 01.5-.5zM6 9a.75.75 0 110-1.5A.75.75 0 016 9z" />
            </svg>
            {message}
        </p>
    );
}

// ── Main form component ───────────────────────────────────────────────────────
const EmployeeForm = ({ onSubmit, loading }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid, dirtyFields },
    } = useForm({
        resolver: customZodResolver(employeeSchema),
        mode: 'onChange',
        defaultValues: {
            employee_id: '',
            full_name: '',
            email: '',
            department: '',
            phone: '',
            position: '',
        },
    });

    const onFormSubmit = (data) => {
        // Uppercase the employee_id before submitting
        onSubmit({ ...data, employee_id: data.employee_id.toUpperCase() });
        reset();
    };

    return (
        <div className="employee-form-container">
            <h2>Add New Employee</h2>
            <form onSubmit={handleSubmit(onFormSubmit)} className="employee-form" noValidate>

                {/* Row 1 */}
                <div className="form-row">
                    <div className={`form-group ${errors.employee_id ? 'has-error' : dirtyFields.employee_id ? 'has-success' : ''}`}>
                        <label htmlFor="employee_id">Employee ID <span className="required">*</span></label>
                        <input
                            type="text"
                            id="employee_id"
                            placeholder="e.g. EMP001"
                            disabled={loading}
                            {...register('employee_id')}
                        />
                        <FieldError message={errors.employee_id?.message} />
                    </div>

                    <div className={`form-group ${errors.full_name ? 'has-error' : dirtyFields.full_name ? 'has-success' : ''}`}>
                        <label htmlFor="full_name">Full Name <span className="required">*</span></label>
                        <input
                            type="text"
                            id="full_name"
                            placeholder="e.g. John Smith"
                            disabled={loading}
                            {...register('full_name')}
                        />
                        <FieldError message={errors.full_name?.message} />
                    </div>
                </div>

                {/* Row 2 */}
                <div className="form-row">
                    <div className={`form-group ${errors.email ? 'has-error' : dirtyFields.email ? 'has-success' : ''}`}>
                        <label htmlFor="email">Email <span className="required">*</span></label>
                        <input
                            type="email"
                            id="email"
                            placeholder="e.g. john@company.com"
                            disabled={loading}
                            {...register('email')}
                        />
                        <FieldError message={errors.email?.message} />
                    </div>

                    <div className={`form-group ${errors.department ? 'has-error' : dirtyFields.department ? 'has-success' : ''}`}>
                        <label htmlFor="department">Department <span className="required">*</span></label>
                        <select id="department" disabled={loading} {...register('department')}>
                            <option value="">Select Department</option>
                            <option value="IT">IT</option>
                            <option value="HR">HR</option>
                            <option value="Finance">Finance</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Operations">Operations</option>
                            <option value="Sales">Sales</option>
                            <option value="Engineering">Engineering</option>
                            <option value="Design">Design</option>
                        </select>
                        <FieldError message={errors.department?.message} />
                    </div>
                </div>

                {/* Row 3 — Optional fields */}
                <div className="form-row">
                    <div className={`form-group ${errors.phone ? 'has-error' : ''}`}>
                        <label htmlFor="phone">Phone <span className="optional">(optional)</span></label>
                        <input
                            type="tel"
                            id="phone"
                            placeholder="e.g. +91 98765 43210"
                            disabled={loading}
                            {...register('phone')}
                        />
                        <FieldError message={errors.phone?.message} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="position">Position <span className="optional">(optional)</span></label>
                        <input
                            type="text"
                            id="position"
                            placeholder="e.g. Senior Developer"
                            disabled={loading}
                            {...register('position')}
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={loading || !isValid}>
                        {loading ? (
                            <>
                                <svg className="btn-spinner" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                                    <path fill="currentColor" className="opacity-75"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Adding...
                            </>
                        ) : 'Add Employee'}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => reset()} disabled={loading}>
                        Clear
                    </button>
                </div>

            </form>
        </div>
    );
};

export default EmployeeForm;
