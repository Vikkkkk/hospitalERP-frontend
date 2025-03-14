import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../../services/api';

// 🛠 Define User Type
export interface User {
  id: number;
  username: string;
  role: string;
  departmentId: number | null;
  departmentName?: string;
  isglobalrole: boolean;
  wecom_userid?: string | null;
  canAccess: string[]; // ✅ List of modules the user can access
  departmentPermissions: Record<string, boolean>; // ✅ Department-based permissions
  createdAt: string;
  updatedAt: string;
}

// ✅ Fetch Active Users (Including Permissions)
export const fetchUsers = createAsyncThunk<User[]>('users/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/users');

    return response.data.users.map((user: User) => ({
      ...user,
      canAccess: user.canAccess || [],
      departmentPermissions: user.departmentPermissions || {}, 
    }));

  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
  }
});

// ✅ Fetch Soft-Deleted Users
export const fetchDeletedUsers = createAsyncThunk<User[]>('users/fetchDeletedUsers', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/users/deleted');
    return response.data.users.map((user: User) => ({
      ...user,
      canAccess: user.canAccess || [],
      departmentPermissions: user.departmentPermissions || {},
    }));
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch deleted users');
  }
});

// ✅ Create User
export const createUser = createAsyncThunk(
  'users/createUser',
  async (newUser: { username: string; password: string; role: string; departmentId?: number }, { rejectWithValue }) => {
    try {
      const response = await api.post('/users/create', newUser);
      return {
        ...response.data.user,
        canAccess: response.data.user.canAccess || [],
        departmentPermissions: response.data.user.departmentPermissions || {},
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create user');
    }
  }
);

// ✅ Update User
export const updateUser = createAsyncThunk(
  'users/updateUser',
  async (updatedUser: Partial<{ id: number; role: string; departmentId?: number; canAccess?: string[] }>, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.patch(`/users/${updatedUser.id}`, updatedUser);
      dispatch(fetchUsers()); // ✅ Ensure updated permissions are reflected in UI
      return {
        ...response.data.user,
        canAccess: response.data.user.canAccess || [],
        departmentPermissions: response.data.user.departmentPermissions || {},
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);

// 🗑️ Delete User
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId: number, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/users/${userId}`);
      dispatch(fetchUsers());
      dispatch(fetchDeletedUsers());
      return userId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
);

// 🔄 Restore Soft-Deleted User
export const restoreUser = createAsyncThunk(
  'users/restoreUser',
  async (userId: number, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.patch(`/users/${userId}/restore`);
      dispatch(fetchUsers());
      dispatch(fetchDeletedUsers());
      return {
        ...response.data.user,
        canAccess: response.data.user.canAccess || [],
        departmentPermissions: response.data.user.departmentPermissions || {},
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to restore user');
    }
  }
);

interface UserState {
  users: User[];
  deletedUsers: User[];
  loading: boolean;
  error: string | null;
}

// 🎯 Initial State
const initialState: UserState = {
  users: [],
  deletedUsers: [],
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
      state.deletedUsers = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchDeletedUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDeletedUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.deletedUsers = action.payload;
      })
      .addCase(fetchDeletedUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.users.push(action.payload);
      })

      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        const index = state.users.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = {
            ...action.payload,
            departmentName: action.payload.departmentName || '无',
          };
        }
      })

      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.users = state.users.filter(user => user.id !== action.payload);
      })

      .addCase(restoreUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.deletedUsers = state.deletedUsers.filter((u) => u.id !== action.payload.id);
        state.users.push(action.payload);
      });
  },
});

// 📌 Selectors
export const selectUsers = (state: { users: UserState }) => state.users.users;
export const selectUsersLoading = (state: { users: UserState }) => state.users.loading;
export const selectUserPermissions = (state: { users: UserState }, userId: number) => {
  const user = state.users.users.find(user => user.id === userId);
  return user ? user.canAccess : [];
};
export const selectDepartmentPermissions = (state: { users: UserState }, userId: number) => {
  const user = state.users.users.find(user => user.id === userId);
  return user ? user.departmentPermissions : {};
};

// 📌 Export Actions & Reducer
export const { clearUsers } = userSlice.actions;
export default userSlice.reducer;