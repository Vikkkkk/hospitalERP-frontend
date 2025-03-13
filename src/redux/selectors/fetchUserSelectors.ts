import { RootState } from '../store';
import { User } from '../types/userTypes';

// 🏷 Select all users
export const selectUsers = (state: RootState): User[] => state.fetchUser.users;

// 🏷 Select loading state
export const selectUsersLoading = (state: RootState): boolean => state.fetchUser.loading;

// 🏷 Select error state
export const selectUsersError = (state: RootState): string | null => state.fetchUser.error;