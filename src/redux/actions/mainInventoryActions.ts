import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { MainInventoryItem } from '../types/inventoryTypes';

const API_URL = '/inventory';

interface InventoryResponse {
  inventory: MainInventoryItem[];
}
interface SingleItemResponse {
  item: MainInventoryItem;
}

// 🔍 Fetch Main Inventory
export const fetchMainInventory = createAsyncThunk<MainInventoryItem[], void>(
  'mainInventory/fetchMainInventory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<InventoryResponse>(`${API_URL}/main`);
      return response.data.inventory;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '❌ 获取主库存失败');
    }
  }
);

// ➕ Add Inventory Item
export const addInventoryItem = createAsyncThunk<
  MainInventoryItem,
  Omit<MainInventoryItem, 'id' | 'createdAt' | 'updatedAt'>
>(
  'mainInventory/addInventoryItem',
  async (itemData, { rejectWithValue }) => {
    try {
      const response = await api.post<SingleItemResponse>(`${API_URL}/add`, itemData);
      return response.data.item;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '❌ 添加库存物品失败');
    }
  }
);

// 🔄 Restock with Batches
export const restockInventory = createAsyncThunk<
  MainInventoryItem,
  { id: number; batches: { quantity: number; expiryDate?: string; supplier?: string }[] }
>(
  'mainInventory/restockInventory',
  async ({ id, batches }, { rejectWithValue }) => {
    try {
      const response = await api.post<SingleItemResponse>(`${API_URL}/restock/${id}`, { batches });
      return response.data.item;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '❌ 物资补充失败');
    }
  }
);

// 🔄 Transfer Inventory to Department (IR Approved)
export const transferInventory = createAsyncThunk<
  MainInventoryItem,
  { itemName: string; quantity: number; departmentId: number }
>(
  'mainInventory/transferInventory',
  async ({ itemName, quantity, departmentId }, { rejectWithValue }) => {
    try {
      const response = await api.post<SingleItemResponse>(`${API_URL}/transfer`, {
        itemName,
        quantity,
        departmentId,
      });
      return response.data.item;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '❌ 库存转移失败');
    }
  }
);

// 🔎 Search Inventory (Dropdown Search)
export const searchMainInventory = createAsyncThunk<string[], { searchQuery: string }>(
  'mainInventory/searchMainInventory',
  async ({ searchQuery }, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/main`, { params: { search: searchQuery } });
      return response.data.inventory.map((item: MainInventoryItem) => item.itemname);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '❌ 搜索主库存失败');
    }
  }
);

// 📥 Request Inventory (IR)
export const requestInventory = createAsyncThunk<
  void,
  { itemName: string; quantity: number; }
>(
  'mainInventory/requestInventory',
  async ({ itemName, quantity }, { rejectWithValue }) => {
    try {
      await api.post('/inventory-requests', { itemName, quantity});
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '❌ 物资申请失败');
    }
  }
);

// 🛒 Create Purchase Request (PR)
export const createPurchaseRequest = createAsyncThunk<
  void,
  { itemname: string; quantity: number; deadlineDate: string; departmentId: number }
>(
  'mainInventory/createPurchaseRequest',
  async ({ itemname, quantity, deadlineDate, departmentId }, { rejectWithValue }) => {
    try {
      await api.post('/procurement-requests', { itemname, quantity, deadlineDate, departmentId });
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '❌ 采购申请失败');
    }
  }
);