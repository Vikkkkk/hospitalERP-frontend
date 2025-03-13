import React, { ReactElement } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUser } from './redux/selectors/authSelectors';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Procurement from './pages/Procurement';
import Inventory from './pages/Inventory';
import WeComLogin from './pages/WeComLogin';
import WeComCallback from './pages/WeComCallback';
import UserProfile from './pages/UserProfile';
import DepartmentList from './pages/DepartmentList'; // ✅ Import the new page

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Notification from './components/Notification';
import ErrorBoundary from './components/ErrorBoundary';

/**
 * ✅ Protected Route Wrapper
 * Redirects unauthenticated users to login
 */
const ProtectedRoute: React.FC<{ element: ReactElement }> = ({ element }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return isAuthenticated ? element : <Navigate to="/login" />;
};

/**
 * ✅ Role-Based Route Wrapper
 * Allows access only if the user has the required roles
 */
const RoleProtectedRoute: React.FC<{ element: ReactElement; allowedRoles: string[] }> = ({ element, allowedRoles }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  return isAuthenticated && user && allowedRoles.includes(user.role) ? element : <Navigate to="/dashboard" />;
};

const App: React.FC = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <Router>
      <ErrorBoundary>
        <div className="flex h-screen bg-gray-100">
          {/* ✅ Show Sidebar only if user is authenticated */}
          {isAuthenticated && <Sidebar />}

          <div className="flex flex-col flex-grow">
            <Navbar />

            <main className="p-4 overflow-y-auto">
              <Routes>
                {/* ✅ Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/wecom-login" element={<WeComLogin />} />
                <Route path="/wecom-callback" element={<WeComCallback />} />

                {/* ✅ Protected Routes */}
                <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />
                <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
                <Route path="/procurement" element={<ProtectedRoute element={<Procurement />} />} />
                <Route path="/inventory" element={<ProtectedRoute element={<Inventory />} />} />
                <Route path="/profile" element={<ProtectedRoute element={<UserProfile />} />} />

                {/* 🔹 Department Management (Only Admin & RootAdmin) */}
                <Route path="/departments" element={<RoleProtectedRoute element={<DepartmentList />} allowedRoles={['Admin', 'RootAdmin']} />} />

                {/* ✅ Fallback Route */}
                <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
              </Routes>
            </main>
          </div>
        </div>

        <Notification />
      </ErrorBoundary>
    </Router>
  );
};

export default App;