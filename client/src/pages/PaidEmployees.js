import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllEmployees, logout, getCurrentUser, savePayroll, getPayroll } from '../services/api';
import './PayrollList.css';

// SVG Icon Imports
import { ReactComponent as CheckCircleIcon } from '../assets/icons/CheckCircle.svg';
import { ReactComponent as UserCircleIcon } from '../assets/icons/UserCircle.svg';
import { ReactComponent as InboxIcon } from '../assets/icons/Inbox.svg';
import { ReactComponent as SaveIcon } from '../assets/icons/Save.svg';
import { ReactComponent as CalendarIcon } from '../assets/icons/Calendar.svg';
import { ReactComponent as ArrowLeftIcon } from '../assets/icons/ArrowLeft.svg';

function PaidEmployees() {
    const [employees, setEmployees] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
    const [loading, setLoading] = useState(true);
    const [payrollData, setPayrollData] = useState({});
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();
    const user = getCurrentUser();

    useEffect(() => {
        loadEmployees();
    }, []);

    useEffect(() => {
        if (employees.length > 0) {
            loadPayrollForMonth();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedMonth, employees]);

    const loadEmployees = async () => {
        try {
            const response = await getAllEmployees();
            setEmployees(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to load employees:', err);
            setLoading(false);
        }
    };

    const loadPayrollForMonth = async () => {
        try {
            const response = await getPayroll(selectedMonth);
            const payrollMap = {};
            employees.forEach(emp => {
                const existing = response.data.find(p => p.employee_id === emp.id);
                if (existing) {
                    payrollMap[emp.id] = {
                        basicSalary: parseFloat(existing.basic_salary) || 0,
                        allowances: parseFloat(existing.allowances) || 0,
                        deductions: parseFloat(existing.deductions) || 0,
                        workingDays: 22,
                        status: existing.payment_status || 'pending'
                    };
                } else {
                    payrollMap[emp.id] = {
                        basicSalary: emp.salary || 30000,
                        allowances: 0,
                        deductions: 0,
                        workingDays: 22,
                        status: 'pending'
                    };
                }
            });
            setPayrollData(payrollMap);
        } catch (err) {
            const initialPayroll = {};
            employees.forEach(emp => {
                initialPayroll[emp.id] = {
                    basicSalary: emp.salary || 30000,
                    allowances: 0,
                    deductions: 0,
                    workingDays: 22,
                    status: 'pending'
                };
            });
            setPayrollData(initialPayroll);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const calculateNetSalary = (empId) => {
        const data = payrollData[empId];
        if (!data) return 0;
        const dailySalary = data.basicSalary / 30;
        const earnedSalary = dailySalary * data.workingDays;
        return Math.round(earnedSalary + data.allowances - data.deductions);
    };

    const updatePayrollData = (empId, field, value) => {
        setPayrollData({
            ...payrollData,
            [empId]: {
                ...payrollData[empId],
                [field]: parseFloat(value) || 0
            }
        });
    };

    const saveCurrentPayroll = async () => {
        if (saving) return;
        setSaving(true);
        try {
            const records = employees.map(emp => {
                const data = payrollData[emp.id];
                return {
                    employee_id: emp.id,
                    basic_salary: data.basicSalary,
                    allowances: data.allowances,
                    deductions: data.deductions,
                    net_salary: calculateNetSalary(emp.id),
                    payment_status: data.status
                };
            });
            await savePayroll(selectedMonth, records);
            alert(`Payroll updated successfully for ${selectedMonth}!`);
        } catch (err) {
            alert('Failed to save payroll: ' + (err.response?.data?.error || err.message));
        } finally {
            setSaving(false);
        }
    };

    // Filter only paid employees
    const getPaidEmployees = () => {
        return employees.filter(emp => payrollData[emp.id]?.status === 'paid');
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    const paidEmployees = getPaidEmployees();

    return (
        <div className="payroll-list-page">
            {/* Top Header */}
            <header className="top-header">
                <div className="logo">
                    <h1>EMS</h1>
                    <span>Paid Employees</span>
                </div>
                <div className="user-section">
                    <button className="btn-back" onClick={() => navigate('/payroll')}>
                        <ArrowLeftIcon className="icon-small" />
                        Back to Payroll
                    </button>
                    <div className="user-info">
                        <UserCircleIcon className="user-icon" />
                        <div className="user-details">
                            <p className="user-name">{user?.username}</p>
                            <p className="user-role">Admin</p>
                        </div>
                    </div>
                    <button className="btn-logout" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="main-content">
                <section className="payroll-section">
                    <div className="section-header">
                        <h2>Paid Employees</h2>
                        <div className="header-actions">
                            <input
                                type="month"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="month-input"
                            />
                            <button
                                className="btn-save"
                                onClick={saveCurrentPayroll}
                                disabled={saving || paidEmployees.length === 0}
                            >
                                <SaveIcon className="icon-small" />
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>



                    <div className="details-info">
                        <p className="details-date">
                            <CalendarIcon className="icon-small" />
                            Month: {new Date(selectedMonth + '-01').toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long'
                            })}
                        </p>



                        <p className="details-count">
                            Total: <strong>{paidEmployees.length}</strong> paid employee{paidEmployees.length !== 1 ? 's' : ''}
                        </p>
                    </div>

                    {paidEmployees.length === 0 ? (
                        <div className="empty-state">
                            <InboxIcon className="empty-icon" />
                            <h3>No paid employees</h3>
                            <p>No employees have been marked as paid for this month</p>
                        </div>
                    ) : (
                        <div className="payroll-list">
                            {paidEmployees.map((emp, index) => (
                                <div key={emp.id} className="payroll-card">
                                    {/* Removed below code to remove the numbering: Number listing */}
                                    {/* <div className="card-number">{index + 1}</div> */}

                                    <div className="employee-header">
                                        <div className="employee-details">
                                            <div className="avatar">{emp.name.charAt(0).toUpperCase()}</div>
                                            <div className="info">
                                                <h3>{emp.name}</h3>
                                                <p>{emp.position || 'No Position'}</p>
                                            </div>
                                        </div>
                                        <div className="status-badge paid">
                                            <CheckCircleIcon className="badge-icon" />
                                            Paid
                                        </div>
                                    </div>

                                    <div className="payroll-details">
                                        <div className="detail-row">
                                            <label>Basic Salary:</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={payrollData[emp.id]?.basicSalary}
                                                onChange={(e) => updatePayrollData(emp.id, 'basicSalary', e.target.value)}
                                                className="small-input"
                                            />
                                        </div>

                                        <div className="detail-row">
                                            <label>Working Days:</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="31"
                                                value={payrollData[emp.id]?.workingDays}
                                                onChange={(e) => updatePayrollData(emp.id, 'workingDays', e.target.value)}
                                                className="small-input"
                                            />
                                        </div>

                                        <div className="detail-row">
                                            <label>Allowances (Rs):</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={payrollData[emp.id]?.allowances}
                                                onChange={(e) => updatePayrollData(emp.id, 'allowances', e.target.value)}
                                                className="small-input"
                                            />
                                        </div>

                                        <div className="detail-row">
                                            <label>Deductions (Rs):</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={payrollData[emp.id]?.deductions}
                                                onChange={(e) => updatePayrollData(emp.id, 'deductions', e.target.value)}
                                                className="small-input"
                                            />
                                        </div>

                                        <div className="detail-row total">
                                            <label>Net Salary:</label>
                                            <span className="net-amount">Rs. {calculateNetSalary(emp.id).toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="card-footer">
                                        <div className="payment-info">
                                            <CheckCircleIcon className="icon-small" style={{ color: '#28a745' }} />
                                            <span>Payment Completed</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default PaidEmployees;