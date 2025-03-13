import { RootState } from '../store';
import { Department } from '../types/departmentTypes';

// 🏷 Select all departments
export const selectDepartments = (state: RootState): Department[] => state.department.departments;

// 🏷 Select loading state
export const selectDepartmentsLoading = (state: RootState): boolean => state.department.loading;

// 🏷 Select error state
export const selectDepartmentsError = (state: RootState): string | null => state.department.error;

// 🏷 Select department by ID
export const selectDepartmentById = (state: RootState, departmentId: number): Department | undefined => 
  state.department.departments.find((dept) => dept.id === departmentId);