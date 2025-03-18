// src/redux/actions/inventoryTransactionActions.ts
import { createAsyncThunk } from '@reduxjs/toolkit'; 
import api from '../../services/api'; 
import { InventoryTransaction } from '../types/inventoryTransactionTypes';

const API_URL = '/inventory-transactions';

// ✅ Response Type for Pagination
interface PaginatedTransactionResponse {
  transactions: InventoryTransaction[];
  totalPages: number;
  currentPage: number;
}

// 📦 Fetch all inventory transactions with filters
export const fetchInventoryTransactions = createAsyncThunk<
  PaginatedTransactionResponse,
  { page?: number; limit?: number; type?: string; departmentId?: number; startDate?: string; endDate?: string }
>(
  'inventoryTransactions/fetchTransactions',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await api.get(API_URL, { params: filters });
      return response.data;
    } catch (error: any) {
      console.error("❌ 获取库存交易失败:", error);
      return rejectWithValue(error.response?.data?.message || '❌ 获取库存交易失败');
    }
  }
);
// 📥 Fetch 入库 (Check-in) History with Optional departmentId
export const fetchCheckInHistory = createAsyncThunk<InventoryTransaction[], { departmentId?: number } | void>(
  'inventoryTransactions/fetchCheckInHistory',
  async (filters, { rejectWithValue }) => {
    try {
      const params: any = {
        type: 'Procurement,Restocking,Transfer',
      };
      if (filters && filters.departmentId !== undefined) {
        params.departmentId = filters.departmentId;
      }

      const response = await api.get(API_URL, { params });
      return response.data.transactions;
    } catch (error: any) {
      console.error("❌ 获取入库历史失败:", error);
      return rejectWithValue(error.response?.data?.message || '❌ 获取入库历史失败');
    }
  }
);

// 📤 Fetch 核销 (Check-out) History with Optional departmentId
export const fetchCheckOutHistory = createAsyncThunk<InventoryTransaction[], { departmentId?: number } | void>(
  'inventoryTransactions/fetchCheckOutHistory',
  async (filters, { rejectWithValue }) => {
    try {
      const params: any = {
        type: 'Usage,Checkout',
      };
      if (filters && filters.departmentId !== undefined) {
        params.departmentId = filters.departmentId;
      }

      const response = await api.get(API_URL, { params });
      return response.data.transactions;
    } catch (error: any) {
      console.error("❌ 获取核销历史失败:", error);
      return rejectWithValue(error.response?.data?.message || '❌ 获取核销历史失败');
    }
  }
);

// 📚 Fetch All Inventory Transaction History with Optional departmentId
export const fetchAllHistory = createAsyncThunk<InventoryTransaction[], { departmentId?: number } | void>(
  'inventoryTransactions/fetchAllHistory',
  async (filters, { rejectWithValue }) => {
    try {
      const params: any = {};
      if (filters && filters.departmentId !== undefined) {
        params.departmentId = filters.departmentId;
      }

      const response = await api.get(API_URL, { params });
      return response.data.transactions;
    } catch (error: any) {
      console.error("❌ 获取全部库存历史失败:", error);
      return rejectWithValue(error.response?.data?.message || '❌ 获取全部库存历史失败');
    }
  }
);

// 📊 Monthly Report
export const fetchMonthlyInventoryReport = createAsyncThunk<
  { month: string; year: string; totalTransactions: number; topUsedItems: Record<number, number>; transactions: InventoryTransaction[] },
  { month: string; year: string }
>(
  'inventoryTransactions/fetchMonthlyReport',
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/monthly-report`, { params: { month, year } });
      return response.data;
    } catch (error: any) {
      console.error("❌ 获取月度库存报告失败:", error);
      return rejectWithValue(error.response?.data?.message || '❌ 获取月度库存报告失败');
    }
  }
);

// 🗂 Export CSV
export const exportInventoryTransactionsCSV = createAsyncThunk<void, void>(
  'inventoryTransactions/exportCSV',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/export/csv`, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'inventory_transactions.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error: any) {
      console.error("❌ 导出库存交易 CSV 失败:", error);
      return rejectWithValue(error.response?.data?.message || '❌ 导出库存交易 CSV 失败');
    }
  }
);

// ➕ Manual Stock Transfer (Optional utility)
export const requestStockTransfer = createAsyncThunk<
  InventoryTransaction,
  { itemname: string; quantity: number; departmentId: number }
>(
  'inventoryTransactions/requestStockTransfer',
  async ({ itemname, quantity, departmentId }, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/transfer`, { itemname, quantity, departmentId });
      return response.data.transaction;
    } catch (error: any) {
      console.error("❌ 库存转移请求失败:", error);
      return rejectWithValue(error.response?.data?.message || '❌ 库存转移请求失败');
    }
  }
);