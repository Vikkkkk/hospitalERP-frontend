import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { loginSuccess, logout } from '../store/slices/authSlice';

const API_URL = '/auth'; // Base URL handled by `api.ts`

// 🔐 **Login Action**
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (
    { username, password }: { username: string; password: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await api.post(`${API_URL}/login`, { username, password });
      const { token, user } = response.data;

      // ✅ Store in local storage
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      // ✅ Dispatch success action
      dispatch(loginSuccess(user));

      return user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// 🔄 **Update User Info Action** (For WeCom Binding & Profile Updates)
export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (
    updatedUser: Partial<{ id: number; username: string; role: string; wecom_userid?: string }>,
    { getState, rejectWithValue }
  ) => {
    try {
      const state: any = getState();
      const currentUser = state.auth.user;
      const token = localStorage.getItem('authToken');

      if (!token) throw new Error("Unauthorized");

      const response = await api.patch(`${API_URL}/update`, updatedUser, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // ✅ Merge updates with the current user object
      const newUser = { ...currentUser, ...response.data.user };

      // ✅ Store updated user info in local storage
      localStorage.setItem('user', JSON.stringify(newUser));

      return newUser;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);

// 🚪 **Logout Action**
export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { dispatch }) => {
  // ✅ Remove from local storage
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');

  dispatch(logout());
});

// 🆕 **Register User Action** (If Needed)
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (
    { username, password, role }: { username: string; password: string; role: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(`${API_URL}/register`, { username, password, role });
      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);