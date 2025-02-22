import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome, {user?.name}!</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-blue-100 rounded-lg">
          <h2 className="text-xl font-semibold text-blue-800">Role</h2>
          <p className="text-blue-700">{user?.role}</p>
        </div>

        <div className="p-4 bg-green-100 rounded-lg">
          <h2 className="text-xl font-semibold text-green-800">Quick Actions</h2>
          <ul className="list-disc list-inside text-green-700">
            <li>Submit Procurement Request</li>
            <li>Manage Inventory</li>
            <li>View Notifications</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 p-4 bg-yellow-100 rounded-lg">
        <h2 className="text-xl font-semibold text-yellow-800">System Updates</h2>
        <p className="text-yellow-700">
          New procurement approval workflow implemented. Check the procurement page for details.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
