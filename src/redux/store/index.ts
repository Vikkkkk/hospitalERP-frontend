import { configureStore } from '@reduxjs/toolkit';
import inventoryReducer from './slices/inventorySlice';
import inventoryTransactionReducer from './slices/inventoryTransactionSlice';
import authReducer from './slices/authSlice'; // ✅ Added

export const store = configureStore({
  reducer: {
    inventory: inventoryReducer,
    inventoryTransactions: inventoryTransactionReducer,
    auth: authReducer, // ✅ Now Redux tracks authentication state
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;