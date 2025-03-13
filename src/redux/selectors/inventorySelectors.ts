import { RootState } from '../store';

// ✅ Select inventory items from Redux store
export const selectInventoryItems = (state: RootState) => state.inventory.inventoryItems;

// ✅ Select loading state for inventory
export const selectInventoryLoading = (state: RootState) => state.inventory.loading;

// ✅ Select error state for inventory
export const selectInventoryError = (state: RootState) => state.inventory.error;

