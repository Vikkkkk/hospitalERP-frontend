import React, { useState } from 'react';
import { useSelector} from 'react-redux';
import { selectUser, selectIsAuthenticated } from '../redux/selectors/authSelectors';
import { logoutUser } from '../redux/actions/authActions';
import { useAppDispatch } from '../redux/hooks'; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faSignOutAlt, faBell } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from 'react-router-dom';

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [menuOpen, setMenuOpen] = useState(false);
  const notificationsCount = 3; // ✅ Replace with dynamic notifications logic later

  if (!isAuthenticated || !user) return null; // ✅ Hide Navbar if user isn't logged in

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center relative">
      {/* ✅ Left Side: Logo / System Name */}
      <NavLink to="/dashboard" className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition">
        🏥 Hospital ERP
      </NavLink>

      {/* ✅ Right Side: Desktop Menu */}
      <div className="hidden md:flex items-center space-x-6">
        {/* 🔔 Notifications */}
        <button className="relative text-gray-700 hover:text-blue-600 transition">
          <FontAwesomeIcon icon={faBell} size="lg" />
          {notificationsCount > 0 && (
            <span className="absolute -top-1 -right-2 text-xs bg-red-500 text-white rounded-full px-2">
              {notificationsCount}
            </span>
          )}
        </button>

        {/* 👤 User Profile */}
        <div className="flex items-center space-x-4">
          {/* ✅ User Avatar */}
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
            {user.username.charAt(0).toUpperCase()}
          </div>

          {/* ✅ User Info */}
          <span className="text-gray-600 hidden sm:block">
            <strong>{user.username}</strong> ({user.role})
          </span>

          {/* ✅ Logout Button */}
          <button
            onClick={() => dispatch(logoutUser())}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Logout
          </button>
        </div>
      </div>

      {/* ✅ Mobile Menu Toggle */}
      <button
        className="md:hidden text-gray-700 hover:bg-gray-200 p-2 rounded-lg transition"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle Mobile Menu"
      >
        {menuOpen ? <FontAwesomeIcon icon={faTimes} size="lg" /> : <FontAwesomeIcon icon={faBars} size="lg" />}
      </button>

      {/* ✅ Mobile Menu (Dropdown) */}
      {menuOpen && user && (
        <div className="absolute top-16 right-4 bg-white shadow-lg rounded-lg w-48 p-4 md:hidden">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <span className="text-gray-600">
              <strong>{user.username}</strong> ({user.role})
            </span>
          </div>

          {/* 🔔 Notifications in Mobile Menu */}
          <button className="relative w-full mt-3 text-gray-700 hover:bg-gray-100 transition flex items-center justify-center p-2 rounded-lg">
            <FontAwesomeIcon icon={faBell} size="lg" />
            {notificationsCount > 0 && (
              <span className="ml-2 text-sm bg-red-500 text-white rounded-full px-2">
                {notificationsCount}
              </span>
            )}
          </button>

          {/* 🚪 Logout Button in Mobile Menu */}
          <button
            onClick={() => dispatch(logoutUser())}
            className="w-full mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;