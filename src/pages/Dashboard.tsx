import React, { useMemo, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser, selectIsAuthenticated } from '../redux/selectors/authSelectors';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserShield, faTasks, faBell, faWarehouse, faClipboardList } from "@fortawesome/free-solid-svg-icons";

const Dashboard: React.FC = () => {
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [lowStockItems, setLowStockItems] = useState(0);
  const [notifications, setNotifications] = useState(3); // ✅ Replace with dynamic notifications logic

  // ✅ Redirect unauthenticated users before rendering dashboard
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // ✅ Fetch dashboard metrics (simulated API calls)
  useEffect(() => {
    // Simulating an API call for pending approvals & low stock alerts
    setTimeout(() => {
      setPendingApprovals(5); // ✅ Replace with real API call
      setLowStockItems(8); // ✅ Replace with real API call
    }, 1000);
  }, []);

  // ✅ Define Quick Actions Based on Role
  const quickActions = useMemo(() => {
    const actions: Record<string, { label: string; icon: any; path: string }[]> = {
      Admin: [
        { label: 'Manage Users', icon: faUserShield, path: '/user-management' },
        { label: 'Approve Procurements', icon: faTasks, path: '/procurement' },
        { label: 'View Reports', icon: faClipboardList, path: '/reports' }
      ],
      Director: [
        { label: 'Approve Procurements', icon: faTasks, path: '/procurement' },
        { label: 'Monitor Inventory', icon: faWarehouse, path: '/inventory' },
        { label: 'Assign Tasks', icon: faTasks, path: '/tasks' }
      ],
      Staff: [
        { label: 'Submit Procurement Request', icon: faClipboardList, path: '/procurement' },
        { label: 'Manage Inventory', icon: faWarehouse, path: '/inventory' },
        { label: 'View Notifications', icon: faBell, path: '/notifications' }
      ],
      default: [{ label: 'View Dashboard', icon: faClipboardList, path: '/dashboard' }],
    };

    return user ? actions[user.role] || actions.default : actions.default;
  }, [user]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Welcome, {user?.username || 'Guest'}!
      </h1>

      {/* ✅ Dashboard Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ✅ Role Section */}
        <div className="p-4 bg-blue-100 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-blue-800">Your Role</h2>
          <p className="text-blue-700">{user?.role || 'N/A'}</p>
        </div>

        {/* ✅ Pending Approvals */}
        <div className="p-4 bg-red-100 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-red-800">Pending Approvals</h2>
          <p className="text-red-700 text-2xl font-bold">{pendingApprovals}</p>
        </div>

        {/* ✅ Low Stock Alerts */}
        <div className="p-4 bg-yellow-100 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-yellow-800">Low Stock Alerts</h2>
          <p className="text-yellow-700 text-2xl font-bold">{lowStockItems}</p>
        </div>
      </div>

      {/* ✅ Dynamic Quick Actions */}
      <div className="mt-8 p-4 bg-green-100 rounded-lg">
        <h2 className="text-xl font-semibold text-green-800">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
          {quickActions.map((action, index) => (
            <a
              key={index}
              href={action.path}
              className="flex items-center p-3 bg-green-200 rounded-lg hover:bg-green-300 transition"
            >
              <FontAwesomeIcon icon={action.icon} className="mr-3 text-green-800" size="lg" />
              <span className="text-green-800">{action.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* ✅ System Updates Section */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800">System Updates</h2>
        <p className="text-gray-700">
          🎉 New procurement approval workflow implemented. Check the procurement page for details.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;