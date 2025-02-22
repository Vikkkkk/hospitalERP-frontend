import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null; // Hide sidebar if the user isn't logged in

  return (
    <aside className="w-64 bg-white shadow-lg h-full">
      <div className="p-4 text-xl font-bold border-b">
        {user.role} Panel
      </div>
      <nav className="flex flex-col p-4 space-y-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `p-2 rounded-lg hover:bg-blue-100 transition ${isActive ? 'bg-blue-200 font-bold' : 'text-gray-700'}`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/procurement"
          className={({ isActive }) =>
            `p-2 rounded-lg hover:bg-blue-100 transition ${isActive ? 'bg-blue-200 font-bold' : 'text-gray-700'}`
          }
        >
          Procurement Requests
        </NavLink>

        <NavLink
          to="/inventory"
          className={({ isActive }) =>
            `p-2 rounded-lg hover:bg-blue-100 transition ${isActive ? 'bg-blue-200 font-bold' : 'text-gray-700'}`
          }
        >
          Inventory Management
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
