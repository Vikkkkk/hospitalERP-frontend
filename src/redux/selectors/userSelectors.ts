import { RootState } from '../store';
import { User } from '../actions/userActions'; // Ensure this matches the interface

// 🏷 Select all users
export const selectUsers = (state: RootState): User[] => state.user.users;

// 🏷 Select loading state
export const selectUsersLoading = (state: RootState): boolean => state.user.loading;

// 🏷 Select error state
export const selectUsersError = (state: RootState): string | null => state.user.error;

// 🏷 Select a user by ID
export const selectUserById = (state: RootState, userId: number): User | undefined =>
  state.user.users.find(user => user.id === userId);