import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";


const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(true); // ✅ Toggle sidebar

  if (!user) return null; // Hide sidebar if user isn't logged in

  // ✅ Role-based navigation items
  const navigation = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/procurement', label: 'Procurement Requests' },
    { to: '/inventory', label: 'Inventory Management' },
    { to: '/profile', label: 'User Profile' },
  ];

  return (
    <aside className={`bg-white shadow-lg h-full transition-all ${isOpen ? 'w-64' : 'w-20'}`}>
      {/* ✅ Toggle Sidebar */}
      <button
        className="p-3 text-gray-700 hover:bg-gray-200 transition w-full flex items-center justify-center"
        onClick={() => setIsOpen(!isOpen)}
      >
       {isOpen ? <FontAwesomeIcon icon={faTimes} size="lg" /> : <FontAwesomeIcon icon={faBars} size="lg" />}
      </button>

      <div className={`p-4 text-lg font-bold border-b transition-all ${isOpen ? 'block' : 'hidden'}`}>
        {user.role} Panel
      </div>

      {/* ✅ Navigation Links */}
      <nav className="flex flex-col p-4 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `p-2 flex items-center rounded-lg hover:bg-blue-100 transition ${
                isActive ? 'bg-blue-200 font-bold' : 'text-gray-700'
              }`
            }
          >
            {isOpen ? item.label : <span className="text-xl">•</span>}
          </NavLink>
        ))}
      </nav>

      {/* ✅ Logout Button */}
      <button
        className="w-full mt-auto p-3 text-white bg-red-500 hover:bg-red-600 transition flex items-center justify-center"
        onClick={logout}
      >
        {isOpen ? "Logout" : <FontAwesomeIcon icon={faSignOutAlt} size="lg" />}
      </button>
    </aside>
  );
};

export default Sidebar;
