import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, selectIsAuthenticated } from '../redux/selectors/authSelectors';
import { logoutUser } from '../redux/actions/authActions';
import { AppDispatch } from '../redux/store';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

const Navbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [menuOpen, setMenuOpen] = useState(false);

  if (!isAuthenticated) return null; // ✅ Hide Navbar if user isn't logged in

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      {/* ✅ Logo / System Name */}
      <h1 className="text-2xl font-bold text-gray-800">Hospital ERP System</h1>

      {/* ✅ Mobile Menu Toggle */}
      <button
        className="md:hidden text-gray-700 hover:bg-gray-200 p-2 rounded-lg transition"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FontAwesomeIcon icon={faTimes} size="lg" /> : <FontAwesomeIcon icon={faBars} size="lg" />}
      </button>

      {/* ✅ Desktop Menu */}
      <div className="hidden md:flex items-center space-x-6">
        {user && (
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
        )}
      </div>

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

          <button
            onClick={() => dispatch(logoutUser())}
            className="w-full mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className='mr-2'/>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;