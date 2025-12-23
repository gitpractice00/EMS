import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllEmployees, logout, getCurrentUser, deleteEmployee } from '../services/api';
import './Dashboard.css';

// SVG Icon Imports
import { ReactComponent as UsersIcon } from '../assets/icons/Users.svg';
import { ReactComponent as LogoutIcon } from '../assets/icons/Logout.svg';
import { ReactComponent as UserIcon } from '../assets/icons/User.svg';
import { ReactComponent as CheckCircleIcon } from '../assets/icons/CheckCircle.svg';
import { ReactComponent as BriefcaseIcon } from '../assets/icons/Briefcase.svg';
import { ReactComponent as BarChartIcon } from '../assets/icons/BarChart.svg';
import { ReactComponent as SearchIcon } from '../assets/icons/Search.svg';
import { ReactComponent as MailIcon } from '../assets/icons/Mail.svg';
import { ReactComponent as PhoneIcon } from '../assets/icons/Phone.svg';
import { ReactComponent as RupeeSignIcon } from '../assets/icons/RupeeSign.svg';
import { ReactComponent as InboxIcon } from '../assets/icons/Inbox.svg';
import { ReactComponent as UserCircleIcon } from '../assets/icons/UserCircle.svg';

function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const response = await getAllEmployees();
      setEmployees(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load employees');
      setLoading(false);
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      try {
        await deleteEmployee(id);
        alert('Employee deleted!');
        loadEmployees();
      } catch (err) {
        alert('Failed to delete employee');
        console.error(err);
      }
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (emp.position && emp.position.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Top Header */}
      <header className="top-header">
        <div className="logo">
          <h1>EMS</h1>
          <span>Employee Management</span>
        </div>
        <div className="user-section">
          <div className="user-info">
            <UserCircleIcon className="user-icon" />
            <div className="user-details">
              <p className="user-name">{user?.username}</p>
              <p className="user-role">Admin</p>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
              <LogoutIcon className="icon-small" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Stats Section */}
        <section className="stats-section">
          <div className="stat-box"> 
            <div className="stat-icon blue">
              <UsersIcon />
            </div>
            <div className="stat-info">
              <h3>{employees.length}</h3>
              <p>Total Employees</p>
            </div>
          </div>

          <div className="stat-box" onClick={() => navigate('/attendance')} style={{cursor: 'pointer'}}>
            <div className="stat-icon green">
              <CheckCircleIcon />
            </div>
            <div className="stat-info">
              <h3>{employees.filter(e => e.position).length}</h3>
              <p>Attendance</p>
            </div>
          </div>

          <div className="stat-box" onClick={() => navigate('/payroll')} style={{cursor: 'pointer'}}>
            <div className="stat-icon purple">
              <BriefcaseIcon />
            </div>
            <div className="stat-info">
              <h3>{Math.round(employees.reduce((sum, e) => sum + Number(e.salary || 0), 0) / 1000)}k</h3>
              <p>Payroll</p>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-icon orange">
              <BarChartIcon />
            </div>
            <div className="stat-info">
              <h3>{new Set(employees.map(e => e.position).filter(Boolean)).size}</h3>
              <p>Positions</p>
            </div>
          </div>
        </section>

        {/* Employee List Section */}
        <section className="employee-section">
          <div className="section-header">
            <h2>Employees</h2>
            <div className="header-actions">
              <div className="search-box">
                <SearchIcon className="search-icon" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="btn-add" onClick={() => navigate('/employees/add')}>
                + Add Employee
              </button>
            </div>
          </div>

          {error && <div className="error-box">{error}</div>}

          {filteredEmployees.length === 0 ? (
            <div className="empty-state">
              <InboxIcon className="empty-icon" />
              <h3>No employees found</h3>
              <p>Start by adding your first employee</p>
              <button className="btn-add" onClick={() => navigate('/employees/add')}>
                Add Employee
              </button>
            </div>
          ) : (
            <div className="employee-grid">
              {filteredEmployees.map((emp) => (
                <div key={emp.id} className="employee-card">
                  <div className="card-header">
                    {/* CHANGED: Shows employee ID instead of name initial */}
                    <div className="avatar">#{emp.id}</div>
                    <div className="employee-info">
                      <h3>{emp.name}</h3>
                      <p className="position">{emp.position || 'No Position'}</p>
                    </div>
                  </div>
                  
                  <div className="card-body">
                    <div className="info-row">
                      <UserIcon className=" minimize" />
                      <span className="text">ID: {emp.id}</span>
                    </div>
                    <div className="info-row">
                      <MailIcon className="icon" />
                      <span className="text">{emp.email}</span>
                    </div>
                    {emp.phone && (
                      <div className="info-row">
                        <PhoneIcon className="icon" />
                        <span className="text">{emp.phone}</span>
                      </div>
                    )}
                    {emp.salary && (
                      <div className="info-row">
                        <RupeeSignIcon className="icon" />
                        <span className="text">Rs. {emp.salary.toLocaleString()}/month</span>
                      </div>
                    )}
                  </div>

                  <div className="card-footer">
                    <button 
                      className="btn-edit"
                      onClick={() => navigate(`/employees/edit/${emp.id}`)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(emp.id, emp.name)}
                    >
                      Delete
                    </button>
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

export default Dashboard;