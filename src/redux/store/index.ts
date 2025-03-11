import { configureStore } from '@reduxjs/toolkit';
import inventoryReducer from './slices/InventorySlice';
import thunk from 'redux-thunk';

export const store = configureStore({
  reducer: {
    inventory: inventoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;