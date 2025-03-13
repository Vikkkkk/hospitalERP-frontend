import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api'; // ✅ Use centralized API service
import { InventoryTransaction } from '../types/inventoryTransactionTypes';

const API_URL = '/inventory-transactions'; // Base path (since `api` already has baseURL)

// ✅ Fetch all inventory transactions (with filters & pagination)
export const fetchInventoryTransactions = createAsyncThunk<
  { transactions: InventoryTransaction[]; totalPages: number; currentPage: number },
  { page?: number; limit?: number; type?: string; departmentId?: number; startDate?: string; endDate?: string }
>(
  'inventoryTransactions/fetchTransactions',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}`, { params: filters });
      return response.data; // Contains transactions, totalPages, and currentPage
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch transactions');
    }
  }
);

// ✅ Fetch monthly inventory report
export const fetchMonthlyInventoryReport = createAsyncThunk<
  { month: string; year: string; totalTransactions: number; topUsedItems: Record<number, number>; transactions: InventoryTransaction[] },
  { month: string; year: string }
>(
  'inventoryTransactions/fetchMonthlyReport',
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/monthly-report`, { params: { month, year } });
      return response.data; // Contains report data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch monthly report');
    }
  }
);

// ✅ Export inventory transactions as CSV (Triggers Download)
export const exportInventoryTransactionsCSV = createAsyncThunk<void, void>(
  'inventoryTransactions/exportCSV',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/export/csv`, {
        responseType: 'blob', // Handle CSV file correctly
      });

      // Create a downloadable link
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'inventory_transactions.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to export transactions CSV');
    }
  }
);

/**
 * 📦 Request Stock Transfer (New Action)
 */
export const requestStockTransfer = createAsyncThunk(
  'inventoryTransactions/requestStockTransfer',
  async ({ itemname, quantity, departmentId }: { itemname: string; quantity: number; departmentId: number }, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/transfer`, { itemname, quantity, departmentId });
      return response.data.transaction;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to request stock transfer');
    }
  }
);