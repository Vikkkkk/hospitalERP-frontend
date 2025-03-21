import { RootState } from '../store';

// ✅ Select All Active Users
export const selectUsers = (state: RootState) => state.user.users;

// ✅ Select All Deleted Users
export const selectDeletedUsers = (state: RootState) => state.user.deletedUsers;

// ✅ Loading State
export const selectUsersLoading = (state: RootState) => state.user.loading;

// ✅ Error State
export const selectUsersError = (state: RootState) => state.user.error;

// ✅ Select Specific User by ID
export const selectUserById = (state: RootState, userId: number) =>
  state.user.users.find((user) => user.id === userId);

// ✅ User Access Permissions (Full Record)
export const selectUserPermissions = (state: RootState, userId: number) => {
  const user = state.user.users.find((u) => u.id === userId);
  return user ? user.permissions : {};
};

// ✅ Extract Read/Write Access for Specific Module
export const selectUserModuleAccess = (
  state: RootState,
  userId: number,
  moduleKey: string
): { read: boolean; write: boolean } => {
  const user = state.user.users.find((u) => u.id === userId);
  return user?.permissions?.[moduleKey] || { read: false, write: false };
};