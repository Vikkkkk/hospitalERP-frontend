import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Procurement from './pages/Procurement';
import Inventory from './pages/Inventory';
import WeComLogin from './pages/WeComLogin'; // ✅ Import WeCom login page
import WeComCallback from './pages/WeComCallback'; // ✅ Import WeCom callback page
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Notification from './components/Notification';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
  return (
    <Router>
      <ErrorBoundary>
        <AuthProvider>
          <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex flex-col flex-grow">
              <Navbar />
              <main className="p-4 overflow-y-auto">
                <Routes>
                  <Route path="/" element={<Login />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/procurement" element={<Procurement />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/wecom-login" element={<WeComLogin />} /> {/* ✅ New WeCom login route */}
                  <Route path="/wecom-callback" element={<WeComCallback />} /> {/* ✅ Handle WeCom login callback */}
                </Routes>
              </main>
            </div>
          </div>
          <Notification />
        </AuthProvider>
      </ErrorBoundary>
    </Router>
  );
};

export default App;
