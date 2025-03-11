import { RootState } from '../store';

export const selectInventoryItems = (state: RootState) => state.inventory.inventoryItems;
export const selectInventoryLoading = (state: RootState) => state.inventory.loading;
export const selectInventoryError = (state: RootState) => state.inventory.error;
