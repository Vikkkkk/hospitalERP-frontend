import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loginUser, logoutUser, updateUser } from '../actions/authActions';

interface User {
  id: number;
  username: string;
  role: string;
  wecom_userid?: string;
  departmentId?: number;
  isglobalrole: boolean; 
  canAccess: string[]; // ✅ Added canAccess to track user module access
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
      state.user = { ...action.payload, canAccess: action.payload.canAccess || [] }; // ✅ Ensure `canAccess` is initialized
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
        state.user = { ...action.payload, canAccess: action.payload.canAccess || [] }; // ✅ Store `canAccess`
        state.isAuthenticated = true;
        localStorage.setItem('user', JSON.stringify(state.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = { 
          ...state.user, 
          ...action.payload, 
          canAccess: action.payload.canAccess || state.user?.canAccess || [] // ✅ Keep existing canAccess if not updated
        };
        localStorage.setItem('user', JSON.stringify(state.user));
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