import { RootState } from '../store';
import { InventoryRequest } from '../types/InventoryRequestTypes';

// 🔍 All Requests
export const selectAllInventoryRequests = (state: RootState): InventoryRequest[] =>
  state.inventoryRequests.requests;

// 🔄 Pending Requests
export const selectPendingRequests = (state: RootState): InventoryRequest[] =>
  state.inventoryRequests.requests.filter((req) => req.status === 'Pending');

// ✅ Approved Requests
export const selectApprovedRequests = (state: RootState): InventoryRequest[] =>
  state.inventoryRequests.requests.filter((req) => req.status === 'Approved');

// ⏳ Loading
export const selectInventoryRequestsLoading = (state: RootState): boolean =>
  state.inventoryRequests.loading;

// ❌ Error
export const selectInventoryRequestsError = (state: RootState): string | null =>
  state.inventoryRequests.error;

// 🔍 Search Term
export const selectInventoryRequestSearchTerm = (state: RootState): string =>
  state.inventoryRequests.searchTerm;

// 📲 QR Code for Checkout
export const selectQRCodeData = (state: RootState): string | null =>
  state.inventoryRequests.qrCodeData;

export const selectRequestLoading = (state: RootState) =>
  state.inventoryRequests.loading;