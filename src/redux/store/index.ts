import { configureStore } from '@reduxjs/toolkit';
import inventoryReducer from './slices/inventorySlice';
import inventoryTransactionReducer from './slices/inventoryTransactionSlice';
import departmentReducer from './slices/departmentSlice'
import authReducer from './slices/authSlice'; // ✅ Added
import fetchUserReducer from './slices/fetchUserSlice';

export const store = configureStore({
  reducer: {
    inventory: inventoryReducer,
    inventoryTransactions: inventoryTransactionReducer,
    department:departmentReducer,
    auth: authReducer, // ✅ Now Redux tracks authentication state
    fetchUser:fetchUserReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;