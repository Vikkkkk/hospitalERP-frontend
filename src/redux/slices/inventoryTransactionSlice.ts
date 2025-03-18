import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchInventoryTransactions,
  fetchMonthlyInventoryReport,
  exportInventoryTransactionsCSV,
  requestStockTransfer,
  fetchCheckInHistory,
  fetchCheckOutHistory,
  fetchAllHistory,
} from '../actions/inventoryTransactionActions';
import { InventoryTransaction } from '../types/inventoryTransactionTypes';

interface InventoryTransactionState {
  transactions: InventoryTransaction[]; // For paginated display
  checkInHistory: InventoryTransaction[];  // New
  checkOutHistory: InventoryTransaction[]; // New
  transactionLoading: boolean;
  transactionError: string | null;
  totalPages: number;
  currentPage: number;
  monthlyReport?: {
    month: string;
    year: string;
    totalTransactions: number;
    topUsedItems: Record<number, number>;
    transactions: InventoryTransaction[];
  };
  csvUrl?: string;
}

const initialState: InventoryTransactionState = {
  transactions: [],
  checkInHistory: [],
  checkOutHistory: [],
  transactionLoading: false,
  transactionError: null,
  totalPages: 1,
  currentPage: 1,
  monthlyReport: undefined,
  csvUrl: undefined,
};

const inventoryTransactionSlice = createSlice({
  name: 'inventoryTransactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 📥 Check-In History
      .addCase(fetchCheckInHistory.pending, (state) => {
        state.transactionLoading = true;
        state.transactionError = null;
      })
      .addCase(fetchCheckInHistory.fulfilled, (state, action: PayloadAction<InventoryTransaction[]>) => {
        state.transactionLoading = false;
        state.checkInHistory = action.payload;
      })
      .addCase(fetchCheckInHistory.rejected, (state, action) => {
        state.transactionLoading = false;
        state.transactionError = action.payload as string;
      })

      // 📤 Check-Out History
      .addCase(fetchCheckOutHistory.pending, (state) => {
        state.transactionLoading = true;
        state.transactionError = null;
      })
      .addCase(fetchCheckOutHistory.fulfilled, (state, action: PayloadAction<InventoryTransaction[]>) => {
        state.transactionLoading = false;
        state.checkOutHistory = action.payload;
      })
      .addCase(fetchCheckOutHistory.rejected, (state, action) => {
        state.transactionLoading = false;
        state.transactionError = action.payload as string;
      })

      // 📤 Fetch All History
      .addCase(fetchAllHistory.pending, (state) => {
        state.transactionLoading = true;
        state.transactionError = null;
      })
      .addCase(fetchAllHistory.fulfilled, (state, action) => {
        state.transactionLoading = false;
        state.transactions = action.payload; // Storing in general transactions array
      })
      .addCase(fetchAllHistory.rejected, (state, action) => {
        state.transactionLoading = false;
        state.transactionError = action.payload as string;
      })

      // 📄 Paginated Transactions
      .addCase(fetchInventoryTransactions.pending, (state) => {
        state.transactionLoading = true;
        state.transactionError = null;
      })
      .addCase(fetchInventoryTransactions.fulfilled, (state, action: PayloadAction<{ transactions: InventoryTransaction[]; totalPages: number; currentPage: number }>) => {
        state.transactionLoading = false;
        state.transactions = action.payload.transactions;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchInventoryTransactions.rejected, (state, action) => {
        state.transactionLoading = false;
        state.transactionError = action.payload as string;
      })

      // 🔁 Stock Transfer
      .addCase(requestStockTransfer.pending, (state) => {
        state.transactionLoading = true;
        state.transactionError = null;
      })
      .addCase(requestStockTransfer.fulfilled, (state, action: PayloadAction<InventoryTransaction>) => {
        state.transactionLoading = false;
        state.transactions.unshift(action.payload);
      })
      .addCase(requestStockTransfer.rejected, (state, action) => {
        state.transactionLoading = false;
        state.transactionError = action.payload as string;
      })

      // 📊 Monthly Report
      .addCase(fetchMonthlyInventoryReport.pending, (state) => {
        state.transactionLoading = true;
        state.transactionError = null;
      })
      .addCase(fetchMonthlyInventoryReport.fulfilled, (state, action: PayloadAction<{ month: string; year: string; totalTransactions: number; topUsedItems: Record<number, number>; transactions: InventoryTransaction[] }>) => {
        state.transactionLoading = false;
        state.monthlyReport = action.payload;
      })
      .addCase(fetchMonthlyInventoryReport.rejected, (state, action) => {
        state.transactionLoading = false;
        state.transactionError = action.payload as string;
      })

      // 📤 CSV Export
      .addCase(exportInventoryTransactionsCSV.pending, (state) => {
        state.transactionLoading = true;
      })
      .addCase(exportInventoryTransactionsCSV.fulfilled, (state) => {
        state.transactionLoading = false;
      })
      .addCase(exportInventoryTransactionsCSV.rejected, (state, action) => {
        state.transactionLoading = false;
        state.transactionError = action.payload as string;
      });
  },
});

export default inventoryTransactionSlice.reducer;