import { RootState } from '../store';
import { User } from '../actions/userActions'; // Ensure this matches the interface

// 🏷 **Select all active (non-deleted) users**
export const selectUsers = (state: RootState): User[] => state.user.users;

// 🏷 **Select all soft-deleted users**
export const selectDeletedUsers = (state: RootState): User[] => state.user.deletedUsers || [];

// 🏷 **Select loading state**
export const selectUsersLoading = (state: RootState): boolean => state.user.loading;

// 🏷 **Select error state**
export const selectUsersError = (state: RootState): string | null => state.user.error;

// 🏷 **Select a user by ID (from active users)**
export const selectUserById = (state: RootState, userId: number): User | undefined =>
  state.user.users.find(user => user.id === userId);

// 🏷 **Select a soft-deleted user by ID**
export const selectDeletedUserById = (state: RootState, userId: number): User | undefined =>
  state.user.deletedUsers?.find(user => user.id === userId);