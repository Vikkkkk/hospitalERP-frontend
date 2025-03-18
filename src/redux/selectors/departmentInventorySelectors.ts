import { RootState } from '../store';
import { DepartmentInventoryItem } from '../types/inventoryTypes'; // 🛠️ Import item type

// 📦 Select All Inventory Items (二级库)
export const selectDepartmentInventoryItems = (state: RootState): DepartmentInventoryItem[] =>
  state.departmentInventory.items;

// 📥 Select Check-in History (入库)
export const selectCheckInHistory = (state: RootState): any[] =>
  state.departmentInventory.checkInHistory;

// 📤 Select Check-out History (核销)
export const selectCheckOutHistory = (state: RootState): any[] =>
  state.departmentInventory.checkOutHistory;

// ⏳ Select Loading State
export const selectDepartmentInventoryLoading = (state: RootState): boolean =>
  state.departmentInventory.loading;

// ❌ Select Error State
export const selectDepartmentInventoryError = (state: RootState): string | null =>
  state.departmentInventory.error;