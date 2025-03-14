export const MODULES = [
  { key: "dashboard", label: "📊 Dashboard", path: "/dashboard", departmentRestricted: false },
  { key: "inventory", label: "📦 Inventory", path: "/inventory", departmentRestricted: true, allowedDepartments: [1, 2] }, 
  // { key: "procurement", label: "🛒 Procurement", path: "/procurement", departmentRestricted: false },
  { key: "departments", label: "🏢 Departments", path: "/departments", departmentRestricted: true, allowedDepartments: [3] },
  { key: "user-management", label: "👥 User Management", path: "/user-management", departmentRestricted: false }
];