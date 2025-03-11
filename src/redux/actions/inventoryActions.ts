import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { InventoryItem } from '../types/inventoryTypes';

const API_URL = 'http://localhost:5080/api/inventory';

// 📦 Fetch inventory list
export const fetchInventory = createAsyncThunk(
  'inventory/fetchInventory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}`);
      return response.data.inventory; // Extract the inventory array from API response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch inventory');
    }
  }
);

// ➕ Add a new inventory item
export const addInventoryItem = createAsyncThunk(
  'inventory/addInventoryItem',
  async (itemData: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/add`, itemData);
      return response.data.item;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add inventory item');
    }
  }
);

// 🔄 Transfer inventory
export const transferInventory = createAsyncThunk(
  'inventory/transferInventory',
  async ({ itemName, quantity, departmentId }: { itemName: string; quantity: number; departmentId: number }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/transfer`, { itemName, quantity, departmentId });
      return response.data.item;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to transfer inventory');
    }
  }
);

// ✏️ Update inventory usage
export const updateInventoryUsage = createAsyncThunk(
  'inventory/updateInventoryUsage',
  async ({ itemName, usedQuantity, departmentId }: { itemName: string; usedQuantity: number; departmentId: number }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/update`, { itemName, usedQuantity, departmentId });
      return response.data.item;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update inventory usage');
    }
  }
);

// 🔄 Restock inventory item
export const restockInventory = createAsyncThunk(
  'inventory/restockInventory',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/restock/${id}`);
      return response.data.item;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to request restocking');
    }
  }
);
