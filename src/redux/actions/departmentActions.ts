import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { Department } from '../types/departmentTypes';

const API_URL = '/departments';

// Fetch all departments
export const fetchDepartments = createAsyncThunk<Department[], void>(
  'departments/fetchDepartments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(API_URL);
      return response.data.departments;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch departments');
    }
  }
);

// Create a new department
export const createDepartment = createAsyncThunk<Department, { name: string }>(
  'departments/createDepartment',
  async ({ name }, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/create`, { name });
      return response.data.department;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create department');
    }
  }
);

// Assign department head
export const assignDepartmentHead = createAsyncThunk<
  Department,
  { departmentId: number; headId: number }
>(
  'departments/assignHead',
  async ({ departmentId, headId }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`${API_URL}/assign-head`, { departmentId, headId });
      return response.data.department;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to assign department head');
    }
  }
);

// Update department name
export const updateDepartment = createAsyncThunk<Department, { id: number; name: string }>(
  'departments/updateDepartment',
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`${API_URL}/${id}`, { name });
      return response.data.department;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update department');
    }
  }
);

// Delete department
export const deleteDepartment = createAsyncThunk<void, number>(
  'departments/deleteDepartment',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`${API_URL}/${id}`);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete department');
    }
  }
);