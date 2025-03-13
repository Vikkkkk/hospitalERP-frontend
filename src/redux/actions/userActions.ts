import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// 🛠 Define User Type (Ensure this matches your backend structure)
export interface User {
  id: number;
  username: string;
  role: string;
  departmentId: number | null;
  isglobalrole: boolean;
  wecom_userid?: string | null;
  createdAt: string;
  updatedAt: string;
}

// 🔄 **Fetch Users Action**
export const fetchUsers = createAsyncThunk<User[]>('users/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/users'); // ✅ API Call to Fetch Users
    return response.data.users; // ✅ Assuming API returns `{ users: [] }`
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
  }
});

// 🔄 **Update User Action**
export const updateUser = createAsyncThunk(
  'users/updateUser',
  async (updatedUser: Partial<{ id: number; role: string; departmentId?: number }>, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/users/${updatedUser.id}`, updatedUser); // ✅ API Call to Update User
      return response.data.user; // ✅ Assuming API returns `{ user: {...updatedUser} }`
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);

// ✅ Create New User
export const createUser = createAsyncThunk<User, Partial<User>>('users/createUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post('/users/create', userData);
    return response.data.user;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create user');
  }
});