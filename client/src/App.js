// import React from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import Login from './pages/Login';
// import Signup from './pages/Signup';
// import Dashboard from './pages/Dashboard';
// import AddEmployee from './pages/AddEmployee';
// import EditEmployee from './pages/EditEmployee';
// import Attendance from './pages/Attendance';
// import Payroll from './pages/Payroll';
// import { isLoggedIn } from './services/api';
// import './App.css';



// function ProtectedRoute({ children }) {
//   if (!isLoggedIn()) {
//     return <Navigate to="/" replace />;
//   }
//   return children;
// }

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route 
//           path="/dashboard" 
//           element={
//             <ProtectedRoute>
//               <Dashboard />
//             </ProtectedRoute>
//           } 
//         />
//         <Route 
//           path="/employees/add" 
//           element={
//             <ProtectedRoute>
//               <AddEmployee />
//             </ProtectedRoute>
//           } 
//         />
//         <Route 
//           path="/employees/edit/:id" 
//           element={
//             <ProtectedRoute>
//               <EditEmployee />
//             </ProtectedRoute>
//           } 
//         />
//         <Route 
//           path="/attendance" 
//           element={
//             <ProtectedRoute>
//               <Attendance />
//             </ProtectedRoute>
//           } 
//         />
//         <Route 
//           path="/payroll" 
//           element={
//             <ProtectedRoute>
//               <Payroll />
//             </ProtectedRoute>
//           } 
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

// After The differnt pending and pai Files Navigation and all.
// File: client/src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AddEmployee from './pages/AddEmployee';
import EditEmployee from './pages/EditEmployee';
import Attendance from './pages/Attendance';
import Payroll from './pages/Payroll';
import PaidEmployees from './pages/PaidEmployees';      // NEW
import PendingEmployees from './pages/PendingEmployees'; // NEW
import { isLoggedIn } from './services/api';
import './App.css';

function ProtectedRoute({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/employees/add" 
          element={
            <ProtectedRoute>
              <AddEmployee />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/employees/edit/:id" 
          element={
            <ProtectedRoute>
              <EditEmployee />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/attendance" 
          element={
            <ProtectedRoute>
              <Attendance />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/payroll" 
          element={
            <ProtectedRoute>
              <Payroll />
            </ProtectedRoute>
          } 
        />
        
        {/* NEW ROUTES FOR PAID AND PENDING EMPLOYEES */}
        <Route 
          path="/payroll/paid" 
          element={
            <ProtectedRoute>
              <PaidEmployees />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/payroll/pending" 
          element={
            <ProtectedRoute>
              <PendingEmployees />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;