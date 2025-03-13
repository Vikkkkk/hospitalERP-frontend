import { RootState } from '../store';
// ✅ Select inventory transactions
export const selectTransactions = (state: RootState) => state.inventoryTransactions.transactions || [];

// ✅ Select loading state for transactions
export const selectTransactionLoading = (state: RootState) => state.inventoryTransactions.transactionLoading || false;

// ✅ Select error state for transactions
export const selectTransactionError = (state: RootState) => state.inventoryTransactions.transactionError || null;

// ✅ Select all stock requests from inventory transactions
export const selectStockRequests = (state: RootState) => state.inventoryTransactions.transactions.filter((t) => t.transactiontype === 'Restocking');