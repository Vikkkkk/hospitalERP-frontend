import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, selectIsAuthenticated } from "../redux/selectors/authSelectors";
import { logoutUser } from "../redux/actions/authActions";
import { AppDispatch } from "../redux/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faSignOutAlt, faBuilding } from "@fortawesome/free-solid-svg-icons";
import { MODULES } from "../constants"; // ✅ Import centralized module list

const Sidebar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [isOpen, setIsOpen] = useState(true);

  if (!isAuthenticated || !user) return null; // Hide sidebar if not authenticated

  // ✅ Determine Accessible Modules Based on Role and Department
  const navigation = user.isglobalrole
    ? MODULES // ✅ RootAdmin has full access
    : MODULES.filter((module) =>
        user.canAccess?.includes(module.key) || // ✅ Explicit access via `canAccess`
        (module.departmentRestricted && module.allowedDepartments?.includes(user.departmentId ?? -1)) // ✅ Restrict by department
      );

  return (
    <aside className={`bg-white shadow-lg h-full transition-all ${isOpen ? "w-64" : "w-20"}`}>
      {/* ✅ Sidebar Toggle */}
      <button
        className="p-3 text-gray-700 hover:bg-gray-200 transition w-full flex items-center justify-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FontAwesomeIcon icon={faTimes} size="lg" /> : <FontAwesomeIcon icon={faBars} size="lg" />}
      </button>

      <div className={`p-4 text-lg font-bold border-b transition-all ${isOpen ? "block" : "hidden"}`}>
        {user.role} Panel
      </div>

      {/* ✅ Navigation Links - Show message if no access */}
      <nav className="flex flex-col p-4 space-y-2">
        {navigation.length > 0 ? (
          navigation.map((item) => (
            <NavLink
              key={item.key}
              to={item.path}
              className={({ isActive }) =>
                `p-2 flex items-center rounded-lg hover:bg-blue-100 transition ${
                  isActive ? "bg-blue-200 font-bold" : "text-gray-700"
                }`
              }
            >
              {isOpen ? item.label : <FontAwesomeIcon icon={faBuilding} size="lg" />}
            </NavLink>
          ))
        ) : (
          <div className="p-2 text-gray-500 text-center">无权限访问</div>
        )}
      </nav>

      {/* ✅ Logout Button */}
      <button
        className="w-full mt-auto p-3 text-white bg-red-500 hover:bg-red-600 transition flex items-center justify-center"
        onClick={() => dispatch(logoutUser())}
      >
        {isOpen ? "🚪 Logout" : <FontAwesomeIcon icon={faSignOutAlt} size="lg" />}
      </button>
    </aside>
  );
};

export default Sidebar;