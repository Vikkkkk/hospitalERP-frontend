import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faChartPie, faBoxes, faBuilding, faUsers, faShoppingCart } from "@fortawesome/free-solid-svg-icons";

/**
 * ✅ Define Module Interface with Icons
 */
export interface Module {
  key: string;
  label: string;
  path: string;
  icon: IconDefinition;
  departmentRestricted: boolean;
  allowedDepartments?: number[]; // ✅ Optional (only needed when departmentRestricted is true)
  order: number; // ✅ New property to store module order
}

/**
 * 📌 Define Application Modules with Default Order
 */
export const MODULES: Module[] = [
  { key: "dashboard", label: "📊 个人主页", path: "/dashboard", icon: faChartPie, departmentRestricted: false, order: 1 },
  { key: "main-inventory", label: "📦 库存管理", path: "/maininventory", icon: faBoxes, departmentRestricted: false, allowedDepartments: [2], order: 2 },
  { key: "dept-inventory", label: "📦 二级库管理", path: "/deptinventory", icon: faBoxes, departmentRestricted: false, order: 3 },
  // { key: "procurement", label: "🛒 Procurement", path: "/procurement", icon: faShoppingCart, departmentRestricted: false, order: 3 },
  { key: "departments", label: "🏢 部门管理", path: "/departments", icon: faBuilding, departmentRestricted: true, order: 4 },
  { key: "user-management", label: "👥 用户管理", path: "/user-management", icon: faUsers, departmentRestricted: true, order: 5 }
];