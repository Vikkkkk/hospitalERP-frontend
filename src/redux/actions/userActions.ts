import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// 🛠 Define User Type (Ensure this matches your backend structure)
export interface User {
  id: number;
  username: string;
  role: string;
  departmentId: number | null;
  departmentName?: string; // ✅ Added for department name display
  isglobalrole: boolean;
  wecom_userid?: string | null;
  createdAt: string;
  updatedAt: string;
}

// 🔄 **Fetch Active Users Action**
export const fetchUsers = createAsyncThunk<User[]>('users/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/users'); // ✅ API Call to Fetch Active Users
    return response.data.users; // ✅ Assuming API returns `{ users: [] }`
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
  }
});

// 🔄 **Fetch Soft-Deleted Users Action**
export const fetchDeletedUsers = createAsyncThunk<User[]>('users/fetchDeletedUsers', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/users/deleted'); // ✅ Fetch Only Soft-Deleted Users
    return response.data.users; // ✅ Assuming API returns `{ users: [] }`
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch deleted users');
  }
});

// ✅ **Create New User Action**
export const createUser = createAsyncThunk(
  'users/createUser',
  async (newUser: { username: string; password: string; role: string; departmentId?: number; canAccess?: string[] }, { rejectWithValue }) => {
    try {
      const response = await api.post('/users/create', newUser);
      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create user');
    }
  }
);

// 🔄 **Update User Action**
export const updateUser = createAsyncThunk(
  'users/updateUser',
  async (updatedUser: Partial<{ id: number; role: string; departmentId?: number }>, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.patch(`/users/${updatedUser.id}`, updatedUser);
      await dispatch(fetchUsers()); // ✅ Ensure department updates immediately
      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);


// 🗑️ **Delete User Action (Soft or Hard Delete)**
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId: number, { rejectWithValue }) => {
    try {
      await api.delete(`/users/${userId}`);
      return userId; // ✅ Return the ID of the deleted user
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
);

// 🔄 **Restore Soft-Deleted User**
export const restoreUser = createAsyncThunk(
  'users/restoreUser',
  async (userId: number, { rejectWithValue }) => {
    try {
      await api.patch(`/users/${userId}/restore`);
      return userId; // ✅ Return the restored user ID
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to restore user');
    }
  }
);
