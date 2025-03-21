import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loginUser, logoutUser, updateUser } from '../actions/authActions';

interface User {
  id: number;
  username: string;
  role: string;
  wecom_userid?: string;
  departmentId?: number;
  isglobalrole: boolean;
  permissions: {
    [module: string]: {
      read: boolean;
      write: boolean;
    };
  };
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  isAuthenticated: !!localStorage.getItem('authToken'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<User>) {
      state.user = {
        ...action.payload,
        permissions: action.payload.permissions || {}, // ✅ Ensure permissions initialized
      };
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = {
          ...action.payload,
          permissions: action.payload.permissions || {}, // ✅ Store permissions
        };
        state.isAuthenticated = true;
        localStorage.setItem('user', JSON.stringify(state.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<Partial<User>>) => {
        if (state.user) {
          state.user = {
            ...state.user,
            ...action.payload,
            permissions: action.payload.permissions || state.user.permissions || {}, // ✅ Preserve or update permissions
          };
          localStorage.setItem('user', JSON.stringify(state.user));
        }
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      });
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;