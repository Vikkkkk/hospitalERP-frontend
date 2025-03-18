import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { DepartmentInventoryItem } from '../types/inventoryTypes';
import { InventoryTransaction } from '../types/inventoryTransactionTypes';

// 🛠️ Types for API Response
interface InventoryResponse {
  inventory: DepartmentInventoryItem[];
}
interface HistoryResponse {
  transactions: InventoryTransaction[];
}

// 🔍 Fetch Department Inventory (二级库)
// export const fetchDepartmentInventory = createAsyncThunk<DepartmentInventoryItem[], number, { rejectValue: string }>(
//   'departmentInventory/fetch',
//   async (departmentId: number, { rejectWithValue }) => {
//     try {
//       const response = await api.get<InventoryResponse>(`/inventory/department/${departmentId}`);
//       return response.data.inventory;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || '获取部门库存失败');
//     }
//   }
// );

export const fetchDepartmentInventoryById = createAsyncThunk<
  DepartmentInventoryItem[],
  number // departmentId
>(
  'inventory/fetchDepartmentInventoryById',
  async (departmentId, { rejectWithValue }) => {
    try {
      const response = await api.get('/inventory/department', { params: { departmentId } });
      return response.data.inventory;
    } catch (error: any) {
      console.error("❌ 获取指定部门库存失败:", error);
      return rejectWithValue(error.response?.data?.message || '❌ 获取部门库存失败');
    }
  }
);

// // 📥 Fetch Check-in History (入库)
// export const fetchCheckInHistory = createAsyncThunk<
//   InventoryTransaction[],
//   number,
//   { rejectValue: string }
// >(
//   'departmentInventory/fetchCheckInHistory',
//   async (departmentId, { rejectWithValue }) => {
//     try {
//       const response = await api.get<HistoryResponse>(`/inventory/department/${departmentId}/checkin-history`);
//       return response.data.transactions;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || '获取入库历史失败');
//     }
//   }
// );

// // 📤 Fetch Check-out History (核销)
// export const fetchCheckOutHistory = createAsyncThunk<
//   InventoryTransaction[],
//   number,
//   { rejectValue: string }
// >(
//   'departmentInventory/fetchCheckOutHistory',
//   async (departmentId, { rejectWithValue }) => {
//     try {
//       const response = await api.get<HistoryResponse>(`/inventory/department/${departmentId}/checkout-history`);
//       return response.data.transactions;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || '获取核销历史失败');
//     }
//   }
// );

// 📝 Request Inventory (申请物资)
export const requestDepartmentInventory = createAsyncThunk<
  void, // ✅ No return needed
  { itemName: string; quantity: number; departmentId: number },
  { rejectValue: string }
>(
  'departmentInventory/requestInventory',
  async ({ itemName, quantity, departmentId }, { rejectWithValue }) => {
    try {
      await api.post('/inventory-requests', { itemName, quantity, departmentId });
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '申请物资失败');
    }
  }
);

// ✅ Checkout Inventory (核销物资)
export const checkoutInventory = createAsyncThunk<
  { itemId: number; quantity: number },
  { itemId: number; quantity: number },
  { rejectValue: string }
>(
  'departmentInventory/checkoutInventory',
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      await api.post(`/inventory/${itemId}/checkout`, { quantity });
      return { itemId, quantity }; // ✅ Return for reducer
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '核销物资失败');
    }
  }
);