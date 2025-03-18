import { RootState } from '../store';
import { InventoryTransaction } from '../types/inventoryTransactionTypes';

// 📦 Get all inventory transactions
export const selectTransactions = (state: RootState) =>
  state.inventoryTransactions.transactions;

// ⏳ Get transaction loading status
export const selectTransactionLoading = (state: RootState) =>
  state.inventoryTransactions.transactionLoading;

// ❌ Get transaction error message
export const selectTransactionError = (state: RootState) =>
  state.inventoryTransactions.transactionError;

// 📊 Monthly Report
export const selectMonthlyReport = (state: RootState) =>
  state.inventoryTransactions.monthlyReport;

// 📁 CSV Export URL (if needed)
export const selectTransactionCSVUrl = (state: RootState) =>
  state.inventoryTransactions.csvUrl;

// 🔄 Pagination Helpers
export const selectTransactionTotalPages = (state: RootState) =>
  state.inventoryTransactions.totalPages;

export const selectTransactionCurrentPage = (state: RootState) =>
  state.inventoryTransactions.currentPage;

// 🆕 🔄 Stock Transfer Requests Only
export const selectStockRequests = (state: RootState): InventoryTransaction[] =>
  state.inventoryTransactions.transactions.filter(
    (tx) => tx.transactiontype === 'Transfer'
  );