// import axios from 'axios';

// const API_URL = 'http://localhost:5000';

// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export const signup = async (userData) => {
//   const response = await api.post('/auth/signup', userData);
//   return response.data;
// };

// export const login = async (credentials) => {
//   const response = await api.post('/auth/login', credentials);
//   if (response.data.token) {
//     localStorage.setItem('token', response.data.token);
//     localStorage.setItem('user', JSON.stringify(response.data.user));
//   }
//   return response.data;
// };

// export const logout = () => {
//   localStorage.removeItem('token');
//   localStorage.removeItem('user');
// };

// export const isLoggedIn = () => {
//   return localStorage.getItem('token') !== null;
// };

// export const getCurrentUser = () => {
//   const user = localStorage.getItem('user');
//   return user ? JSON.parse(user) : null;
// };

// export const getAllEmployees = async () => {
//   const response = await api.get('/employees');
//   return response.data;
// };

// export const getEmployee = async (id) => {
//   const response = await api.get(`/employees/${id}`);
//   return response.data;
// };

// export const addEmployee = async (employeeData) => {
//   const response = await api.post('/employees', employeeData);
//   return response.data;
// };

// export const updateEmployee = async (id, employeeData) => {
//   const response = await api.put(`/employees/${id}`, employeeData);
//   return response.data;
// };

// /**
//  * UPDATED: Delete employee with password confirmation
//  */
// export const deleteEmployee = async (id, password) => {
//   const response = await api.delete(`/employees/${id}`, {
//     data: { password }
//   });
//   return response.data;
// };

// // ===========================
// // ATTENDANCE API CALLS
// // ===========================

// export const getAttendance = async (date) => {
//   const response = await api.get(`/api/attendance/${date}`);
//   return response.data;
// };

// export const markAttendance = async (date, records) => {
//   const response = await api.post('/api/attendance', { date, records });
//   return response.data;
// };

// export const getAttendanceSummary = async (startDate, endDate) => {
//   const response = await api.get(`/api/attendance/summary/${startDate}/${endDate}`);
//   return response.data;
// };

// // ===========================
// // PAYROLL API CALLS
// // ===========================

// export const getPayroll = async (month) => {
//   const response = await api.get(`/api/payroll/${month}`);
//   return response.data;
// };

// export const savePayroll = async (month, records) => {
//   const response = await api.post('/api/payroll', { month, records });
//   return response.data;
// };

// export const markPaymentPaid = async (payrollId) => {
//   const response = await api.put(`/api/payroll/${payrollId}/pay`);
//   return response.data;
// };

// export const getPayrollSummary = async (year) => {
//   const response = await api.get(`/api/payroll/summary/${year}`);
//   return response.data;
// };


import axios from 'axios';

const API_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const signup = async (userData) => {
  const response = await api.post('/auth/signup', userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const isLoggedIn = () => {
  return localStorage.getItem('token') !== null;
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// FIXED: NEW - Update user profile (email/password)
export const updateUserProfile = async (updateData) => {
  const response = await api.put('/auth/users/profile', updateData);
  return response.data;
};

export const getAllEmployees = async () => {
  const response = await api.get('/employees');
  return response.data;
};

export const getEmployee = async (id) => {
  const response = await api.get(`/employees/${id}`);
  return response.data;
};

export const addEmployee = async (employeeData) => {
  const response = await api.post('/employees', employeeData);
  return response.data;
};

export const updateEmployee = async (id, employeeData) => {
  const response = await api.put(`/employees/${id}`, employeeData);
  return response.data;
};

/**
 * UPDATED: Delete employee with password confirmation
 */
export const deleteEmployee = async (id, password) => {
  const response = await api.delete(`/employees/${id}`, {
    data: { password }
  });
  return response.data;
};

// ===========================
// ATTENDANCE API CALLS
// ===========================

export const getAttendance = async (date) => {
  const response = await api.get(`/api/attendance/${date}`);
  return response.data;
};

export const markAttendance = async (date, records) => {
  const response = await api.post('/api/attendance', { date, records });
  return response.data;
};

export const getAttendanceSummary = async (startDate, endDate) => {
  const response = await api.get(`/api/attendance/summary/${startDate}/${endDate}`);
  return response.data;
};

// ===========================
// PAYROLL API CALLS
// ===========================

export const getPayroll = async (month) => {
  const response = await api.get(`/api/payroll/${month}`);
  return response.data;
};

export const savePayroll = async (month, records) => {
  const response = await api.post('/api/payroll', { month, records });
  return response.data;
};

export const markPaymentPaid = async (payrollId) => {
  const response = await api.put(`/api/payroll/${payrollId}/pay`);
  return response.data;
};

export const getPayrollSummary = async (year) => {
  const response = await api.get(`/api/payroll/summary/${year}`);
  return response.data;
};