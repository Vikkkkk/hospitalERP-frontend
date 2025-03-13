import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../../services/api';

// 🛠 Define User Type
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

// ✅ Fetch Users Action
export const fetchUsers = createAsyncThunk<User[]>('users/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/users');
    return response.data.users;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
  }
});

// ✅ Update User Action
export const updateUser = createAsyncThunk(
  'users/updateUser',
  async (updatedUser: Partial<{ id: number; role: string; departmentId?: number }>, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/users/${updatedUser.id}`, updatedUser);
      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

// 🎯 Initial State
const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

// 🚀 Create User Slice
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUsers: (state) => {
      state.users = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ Handle updateUser cases
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        const index = state.users.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// 📌 Export Actions & Reducer
export const { clearUsers } = userSlice.actions;
export default userSlice.reducer;