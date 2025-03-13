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

// 🔄 Fetch Users Thunk
export const fetchUsers = createAsyncThunk<User[]>(
  'fetchUsers/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/users');
      return response.data.users;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

// 🎯 Initial State
const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
  status: 'idle',
};

// 🚀 Create User Slice
const fetchUsersSlice = createSlice({
  name: 'fetchUsers',
  initialState,
  reducers: {
    clearUsers: (state) => {
      state.users = [];
      state.error = null;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.status = 'succeeded';

        // ✅ Merge users to prevent flickering & duplicates
        const newUsers = action.payload.filter(
          (newUser) => !state.users.some((existingUser) => existingUser.id === newUser.id)
        );

        state.users = [...state.users, ...newUsers];
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.status = 'failed';
      });
  },
});

// 📌 Export Actions & Reducer
export const { clearUsers } = fetchUsersSlice.actions;
export default fetchUsersSlice.reducer;