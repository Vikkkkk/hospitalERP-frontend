import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { User, UserInput } from '../types/userTypes'; // ✅ Use correct type file

// 🔄 Fetch Active Users
export const fetchUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get<{ users: User[] }>('/users');
      return res.data.users.map(user => ({
        ...user,
        canAccess: user.canAccess || [], // ✅ Fallback
      }));
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

// 🔄 Fetch Deleted Users
export const fetchDeletedUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
  'users/fetchDeletedUsers',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get<{ users: User[] }>('/users/deleted');
      return res.data.users.map(user => ({
        ...user,
        canAccess: user.canAccess || [],
      }));
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch deleted users');
    }
  }
);

// ✅ Create User
export const createUser = createAsyncThunk<User, UserInput, { rejectValue: string }>(
  'users/createUser',
  async (newUser, { rejectWithValue }) => {
    try {
      const res = await api.post<{ user: User }>('/users/create', newUser);
      return {
        ...res.data.user,
        canAccess: res.data.user.canAccess || [],
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create user');
    }
  }
);

// ✏️ Update User
export const updateUser = createAsyncThunk<User, Partial<User>, { rejectValue: string }>(
  'users/updateUser',
  async (updatedUser, { rejectWithValue }) => {
    try {
      const res = await api.patch<{ user: User }>(`/users/${updatedUser.id}`, updatedUser);
      return {
        ...res.data.user,
        canAccess: res.data.user.canAccess || [],
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);

// 🗑️ Delete User
export const deleteUser = createAsyncThunk<number, number, { rejectValue: string }>(
  'users/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await api.delete(`/users/${userId}`);
      return userId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
);

// ♻️ Restore User
export const restoreUser = createAsyncThunk<User, number, { rejectValue: string }>(
  'users/restoreUser',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.patch<{ user: User }>(`/users/${userId}/restore`);
      return {
        ...res.data.user,
        canAccess: res.data.user.canAccess || [],
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to restore user');
    }
  }
);