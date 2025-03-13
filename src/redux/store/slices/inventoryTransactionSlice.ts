import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchInventoryTransactions,
  fetchMonthlyInventoryReport,
  exportInventoryTransactionsCSV,
  requestStockTransfer,
} from '../../actions/inventoryTransactionActions';
import { InventoryTransaction } from '../../types/inventoryTransactionTypes';

interface InventoryTransactionState {
  transactions: InventoryTransaction[];
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
      // ✅ Handle fetching inventory transactions
      .addCase(fetchInventoryTransactions.pending, (state) => {
        state.transactionLoading = true;
        state.transactionError = null;
      })
      .addCase(
        fetchInventoryTransactions.fulfilled,
        (state, action: PayloadAction<{ transactions: InventoryTransaction[]; totalPages: number; currentPage: number }>) => {
          state.transactionLoading = false;
          state.transactions = action.payload.transactions;
          state.totalPages = action.payload.totalPages;
          state.currentPage = action.payload.currentPage;
        }
      )
      .addCase(fetchInventoryTransactions.rejected, (state, action) => {
        state.transactionLoading = false;
        state.transactionError = action.payload as string;
      })

      // ✅ Handle stock transfer request
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

      // ✅ Handle fetching monthly inventory report
      .addCase(fetchMonthlyInventoryReport.pending, (state) => {
        state.transactionLoading = true;
        state.transactionError = null;
      })
      .addCase(
        fetchMonthlyInventoryReport.fulfilled,
        (state, action: PayloadAction<{ month: string; year: string; totalTransactions: number; topUsedItems: Record<number, number>; transactions: InventoryTransaction[] }>) => {
          state.transactionLoading = false;
          state.monthlyReport = action.payload;
        }
      )
      .addCase(fetchMonthlyInventoryReport.rejected, (state, action) => {
        state.transactionLoading = false;
        state.transactionError = action.payload as string;
      })

      // ✅ Handle exporting transactions as CSV
      .addCase(exportInventoryTransactionsCSV.pending, (state) => {
        state.transactionLoading = true;
      })
      .addCase(exportInventoryTransactionsCSV.fulfilled, (state, action) => {
        state.transactionLoading = false;
      })
      .addCase(exportInventoryTransactionsCSV.rejected, (state, action) => {
        state.transactionLoading = false;
        state.transactionError = action.payload as string;
      });
  },
});

export default inventoryTransactionSlice.reducer;