import { RootState } from '../store';
import { MainInventoryItem } from '../types/inventoryTypes';

// 🔹 Select all Main Inventory (一级库)
export const selectMainInventoryItems = (state: RootState): MainInventoryItem[] =>
  state.mainInventory.items;

// 🔍 Select Main Inventory Loading State
export const selectMainInventoryLoading = (state: RootState): boolean =>
  state.mainInventory.loading;

// ❌ Select Error State for Main Inventory
export const selectMainInventoryError = (state: RootState): string | null =>
  state.mainInventory.error;

// 🔎 Select Item by ID in Main Inventory
export const selectMainInventoryItemById = (id: number) => (state: RootState): MainInventoryItem | undefined =>
  state.mainInventory.items.find(item => item.id === id);

// 🔎 Select Search Results (Names Only)
export const selectMainInventoryItemNames = (state: RootState): string[] =>
  state.mainInventory.items.map(item => item.itemname);

// 📜 Select Raw Search Result List (used in dropdowns etc.)
export const selectMainInventorySearchResults = (state: RootState): string[] =>
  state.mainInventory.searchResults;