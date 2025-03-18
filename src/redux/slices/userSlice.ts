import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchUsers,
  fetchDeletedUsers,
  createUser,
  updateUser,
  deleteUser,
  restoreUser,
} from '../actions/userActions';

// 🛠 User Type
export interface User {
  id: number;
  username: string;
  role: string;
  departmentId: number | null;
  departmentName?: string;
  isglobalrole: boolean;
  wecom_userid?: string | null;
  canAccess: string[];
  createdAt: string;
  updatedAt: string;
}

// 🎯 State Type
interface UserState {
  users: User[];
  deletedUsers: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  deletedUsers: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUsers: (state) => {
      state.users = [];
      state.deletedUsers = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔄 Fetch Active Users
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
        state.error = action.payload ?? 'Failed to fetch users';
      })

      // 🔄 Fetch Deleted Users
      .addCase(fetchDeletedUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeletedUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.deletedUsers = action.payload;
      })
      .addCase(fetchDeletedUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch deleted users';
      })

      // ➕ Create User
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to create user';
      })

      // ✏️ Update User
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        const idx = state.users.findIndex((u) => u.id === action.payload.id);
        if (idx !== -1) state.users[idx] = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to update user';
      })

      // 🗑️ Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.users = state.users.filter((u) => u.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to delete user';
      })

      // ♻️ Restore User
      .addCase(restoreUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(restoreUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.deletedUsers = state.deletedUsers.filter((u) => u.id !== action.payload.id);
        state.users.push(action.payload);
      })
      .addCase(restoreUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to restore user';
      });
  },
});

export const { clearUsers } = userSlice.actions;
export default userSlice.reducer;