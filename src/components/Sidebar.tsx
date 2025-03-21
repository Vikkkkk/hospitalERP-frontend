import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useSelector} from "react-redux";
import { selectUser, selectIsAuthenticated } from "../redux/selectors/authSelectors";
import { logoutUser } from "../redux/actions/authActions";
import { useAppDispatch } from '../redux/hooks'; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { MODULES, Module } from "../constants"; // ✅ Import centralized module list
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [isOpen, setIsOpen] = useState(true);
  const [navigation, setNavigation] = useState<Module[]>([]);

  useEffect(() => {
    if (!user) return;

    // ✅ Load stored module order from localStorage
    const storedOrder = localStorage.getItem("sidebarOrder");
    let sortedModules = user.isglobalrole
  ? MODULES
  : MODULES.filter((module) => {
      const userPerms = user.permissions?.[module.key];
      const hasReadAccess = userPerms?.read === true;

      const deptAllowed = !module.departmentRestricted || module.allowedDepartments?.includes(user.departmentId ?? -1);

      return hasReadAccess && deptAllowed;
    });

    if (storedOrder) {
      const storedKeys = JSON.parse(storedOrder) as string[];
      sortedModules = sortedModules.sort((a, b) => storedKeys.indexOf(a.key) - storedKeys.indexOf(b.key));
    } else {
      sortedModules.sort((a, b) => a.order - b.order);
    }

    setNavigation(sortedModules);
  }, [user]);

  /**
   * 🔄 Handle Drag & Drop Module Reordering
   */
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedModules = [...navigation];
    const [movedModule] = reorderedModules.splice(result.source.index, 1);
    reorderedModules.splice(result.destination.index, 0, movedModule);

    setNavigation(reorderedModules);

    // ✅ Save new order in localStorage
    localStorage.setItem("sidebarOrder", JSON.stringify(reorderedModules.map((m) => m.key)));
  };

  if (!isAuthenticated || !user) return null; // Hide sidebar if not authenticated

  return (
    <aside className={`bg-white shadow-md h-screen flex flex-col transition-all ${isOpen ? "w-64" : "w-20"}`}>
      {/* ✅ Sidebar Toggle Button */}
      <button
        className="p-3 text-gray-700 hover:bg-gray-200 transition w-full flex items-center justify-center"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Sidebar"
      >
        {isOpen ? <FontAwesomeIcon icon={faTimes} size="lg" /> : <FontAwesomeIcon icon={faBars} size="lg" />}
      </button>

      {/* ✅ Sidebar Header */}
      <div className={`p-4 text-lg font-bold border-b flex items-center transition-all ${isOpen ? "block" : "hidden"}`}>
        {user.role} Panel
      </div>

      {/* ✅ Drag & Drop Navigation */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sidebar-nav">
          {(provided:any) => (
            <nav className="flex flex-col p-4 space-y-2" ref={provided.innerRef} {...provided.droppableProps}>
              {navigation.length > 0 ? (
                navigation.map((item, index) => (
                  <Draggable key={item.key} draggableId={item.key} index={index}>
                    {(provided:any) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <NavLink
                          to={item.path}
                          className={({ isActive }) =>
                            `p-2 flex items-center rounded-lg hover:bg-blue-100 transition ${
                              isActive ? "bg-blue-200 font-bold" : "text-gray-700"
                            }`
                          }
                          aria-label={item.label}
                        >
                          <FontAwesomeIcon icon={item.icon} className="mr-2" />
                          {isOpen && item.label}
                        </NavLink>
                      </div>
                    )}
                  </Draggable>
                ))
              ) : (
                <div className="p-2 text-gray-500 text-center">🚫 无权限访问</div>
              )}
              {provided.placeholder}
            </nav>
          )}
        </Droppable>
      </DragDropContext>

      {/* ✅ Logout Button */}
      <button
        className="w-full mt-auto p-3 text-white bg-red-500 hover:bg-red-600 transition flex items-center justify-center"
        onClick={() => dispatch(logoutUser())}
        aria-label="Logout"
      >
        {isOpen ? "🚪 退出登录" : <FontAwesomeIcon icon={faSignOutAlt} size="lg" />}
      </button>
    </aside>
  );
};

export default Sidebar;