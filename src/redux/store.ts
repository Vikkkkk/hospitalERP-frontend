import { configureStore } from '@reduxjs/toolkit';
import mainInventoryReducer from './slices/mainInventorySlice';
import inventoryTransactionReducer from './slices/inventoryTransactionSlice';
import departmentReducer from './slices/departmentSlice';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import inventoryRequestReducer from './slices/inventoryRequestSlice';
import departmentInventoryReducer from './slices/departmentInventorySlice';
import purchaseRequestReducer from './slices/purchaseRequestSlice'; //Todo

export const store = configureStore({
  reducer: {
    mainInventory: mainInventoryReducer,
    inventoryTransactions: inventoryTransactionReducer,
    department: departmentReducer,
    auth: authReducer,
    user: userReducer,
    inventoryRequests: inventoryRequestReducer,
    departmentInventory: departmentInventoryReducer,
    purchaseRequests: purchaseRequestReducer, // ✅ Todo
  },
});

// 🔐 Types from store
export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];


