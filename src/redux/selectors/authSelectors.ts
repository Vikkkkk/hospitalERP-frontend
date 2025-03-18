import { RootState } from '../store';

// ✅ Select authenticated user
export const selectUser = (state: RootState) => state.auth.user;

// ✅ Check if user is authenticated
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;

export const selectCurrentUser = (state: RootState) => state.auth.user;