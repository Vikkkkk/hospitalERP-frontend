import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { InventoryItem } from '../types/inventoryTypes';

const API_URL = '/inventory'; // Base URL is now handled by `api.ts`

// ✅ API Response Types
interface InventoryResponse {
  inventory: InventoryItem[];
}

interface SingleItemResponse {
  item: InventoryItem;
}

// 📦 Fetch inventory list
export const fetchInventory = createAsyncThunk<InventoryItem[], void>(
  'inventory/fetchInventory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<InventoryResponse>(`${API_URL}`);
      if (!response.data || !response.data.inventory) throw new Error('Invalid API response');
      return response.data.inventory;
    } catch (error: any) {
      console.error("Inventory Fetch Error:", error);
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch inventory');
    }
  }
);

// ➕ Add a new inventory item
export const addInventoryItem = createAsyncThunk<InventoryItem, Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>>(
  'inventory/addInventoryItem',
  async (itemData, { rejectWithValue }) => {
    try {
      const response = await api.post<SingleItemResponse>(`${API_URL}/add`, itemData);
      return response.data.item;
    } catch (error: any) {
      console.error("Add Inventory Error:", error);
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to add inventory item');
    }
  }
);

// 🔄 Transfer inventory
export const transferInventory = createAsyncThunk<InventoryItem, { itemName: string; quantity: number; departmentId: number }>(
  'inventory/transferInventory',
  async ({ itemName, quantity, departmentId }, { rejectWithValue }) => {
    try {
      const response = await api.post<SingleItemResponse>(`${API_URL}/transfer`, { itemName, quantity, departmentId });
      return response.data.item;
    } catch (error: any) {
      console.error("Transfer Inventory Error:", error);
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to transfer inventory');
    }
  }
);

// ✏️ Update inventory usage
export const updateInventoryUsage = createAsyncThunk<InventoryItem, { itemname: string; usedQuantity: number; departmentId: number }>(
  'inventory/updateInventoryUsage',
  async ({ itemname, usedQuantity, departmentId }, { rejectWithValue }) => {
    try {
      const response = await api.patch<SingleItemResponse>(`${API_URL}/update`, { itemname, usedQuantity, departmentId });
      return response.data.item;
    } catch (error: any) {
      console.error("Update Inventory Usage Error:", error);
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update inventory usage');
    }
  }
);

// 🔄 Restock inventory item
export const restockInventory = createAsyncThunk<InventoryItem, number>(
  'inventory/restockInventory',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post<SingleItemResponse>(`${API_URL}/restock/${id}`);
      return response.data.item;
    } catch (error: any) {
      console.error("Restock Inventory Error:", error);
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to request restocking');
    }
  }
);