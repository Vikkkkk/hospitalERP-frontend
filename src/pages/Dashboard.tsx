import React, { useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser, selectIsAuthenticated } from '../redux/selectors/authSelectors';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();

  // ✅ Redirect unauthenticated users *before* useMemo is called
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // ✅ Always call useMemo & handle missing user data inside it
  const quickActions = useMemo(() => {
    const actions: Record<string, string[]> = {
      Admin: ['Manage Users', 'Approve Procurement Requests', 'View Reports'],
      Director: ['Approve Procurements', 'Monitor Inventory', 'Assign Tasks'],
      Staff: ['Submit Procurement Request', 'Manage Inventory', 'View Notifications'],
      default: ['View Dashboard'],
    };

    return user ? actions[user.role] || actions.default : actions.default;
  }, [user]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Welcome, {user?.username || 'Guest'}!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ✅ Role Section */}
        <div className="p-4 bg-blue-100 rounded-lg">
          <h2 className="text-xl font-semibold text-blue-800">Your Role</h2>
          <p className="text-blue-700">{user?.role || 'N/A'}</p>
        </div>

        {/* ✅ Dynamic Quick Actions */}
        <div className="p-4 bg-green-100 rounded-lg">
          <h2 className="text-xl font-semibold text-green-800">Quick Actions</h2>
          <ul className="list-disc list-inside text-green-700">
            {quickActions.map((action, index) => (
              <li key={index}>{action}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* ✅ System Updates Section */}
      <div className="mt-8 p-4 bg-yellow-100 rounded-lg">
        <h2 className="text-xl font-semibold text-yellow-800">System Updates</h2>
        <p className="text-yellow-700">
          🎉 New procurement approval workflow implemented. Check the procurement page for details.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;