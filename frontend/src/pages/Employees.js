import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { employeeAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import EmployeeForm from '../components/EmployeeForm';
import EmployeeTable from '../components/EmployeeTable';
import { GuestBannerConditional } from '../components/GuestBanner';
import './Employees.css';

// ── Reusable Pagination component ─────────────────────────────────────────────
function Pagination({ pagination, onPageChange }) {
    if (!pagination || pagination.total_pages <= 1) return null;
    const { page, total_pages, total, limit } = pagination;
    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);

    return (
        <div className="pagination-bar">
            <span className="pagination-info">
                Showing <strong>{start}–{end}</strong> of <strong>{total}</strong>
            </span>
            <div className="pagination-controls">
                <button onClick={() => onPageChange(1)} disabled={page === 1} className="page-btn">«</button>
                <button onClick={() => onPageChange(page - 1)} disabled={!pagination.has_prev} className="page-btn">‹</button>
                {Array.from({ length: total_pages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === total_pages || Math.abs(p - page) <= 1)
                    .reduce((acc, p, idx, arr) => {
                        if (idx > 0 && p - arr[idx - 1] > 1) acc.push('…');
                        acc.push(p);
                        return acc;
                    }, [])
                    .map((p, i) =>
                        p === '…'
                            ? <span key={`sep-${i}`} className="page-sep">…</span>
                            : <button key={p} onClick={() => onPageChange(p)} className={`page-btn ${p === page ? 'active' : ''}`}>{p}</button>
                    )
                }
                <button onClick={() => onPageChange(page + 1)} disabled={!pagination.has_next} className="page-btn">›</button>
                <button onClick={() => onPageChange(total_pages)} disabled={page === total_pages} className="page-btn">»</button>
            </div>
        </div>
    );
}

const Employees = () => {
    const { isGuest } = useAuth();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [pagination, setPagination] = useState(null);
    const LIMIT = 10;

    const fetchEmployees = useCallback(async (currentPage, searchTerm) => {
        try {
            setLoading(true);
            const result = await employeeAPI.getAll({ page: currentPage, limit: LIMIT, search: searchTerm });
            // Handle both paginated response ({data, pagination}) and legacy array
            if (result && result.data) {
                setEmployees(result.data);
                setPagination(result.pagination);
            } else {
                setEmployees(Array.isArray(result) ? result : []);
                setPagination(null);
            }
        } catch (err) {
            toast.error(err.message || 'Failed to fetch employees');
        } finally {
            setLoading(false);
        }
    }, []);

    // Debounced search + page change
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchEmployees(page, search);
        }, 300);
        return () => clearTimeout(timer);
    }, [page, search, fetchEmployees]);

    const handleAddEmployee = async (employeeData) => {
        if (isGuest) return toast.error('Guest mode: cannot add employees');
        try {
            setFormLoading(true);
            await employeeAPI.add(employeeData);
            toast.success('Employee added successfully!');
            setPage(1);
            await fetchEmployees(1, search);
        } catch (err) {
            toast.error(err.message || 'Failed to add employee');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteEmployee = async (empId) => {
        if (isGuest) return toast.error('Guest mode: cannot delete employees');
        if (!window.confirm(`Delete employee ${empId}? This action cannot be undone.`)) return;
        try {
            setLoading(true);
            await employeeAPI.delete(empId);
            toast.success(`Employee ${empId} deleted`);
            await fetchEmployees(page, search);
        } catch (err) {
            toast.error(err.message || 'Failed to delete employee');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => { setPage(newPage); };

    return (
        <div className="employees-page">
            <div className="page-header">
                <div>
                    <h1>Employee Management</h1>
                    <p className="page-subtitle">Add, view, and manage employees</p>
                </div>
                {/* Search bar */}
                <div className="search-bar">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                    </svg>
                    <input
                        type="text"
                        placeholder="Search by name, ID, or department..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    {search && <button onClick={() => setSearch('')} className="clear-search">✕</button>}
                </div>
            </div>

            {!isGuest && <EmployeeForm onSubmit={handleAddEmployee} loading={formLoading} />}
            <GuestBannerConditional action="adding, editing, or deleting employees" />

            <EmployeeTable employees={employees} onDelete={handleDeleteEmployee} loading={loading} />
            <Pagination pagination={pagination} onPageChange={handlePageChange} />
        </div>
    );
};

export default Employees;
