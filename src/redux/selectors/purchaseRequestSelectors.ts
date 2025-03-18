import { RootState } from '../store';

export const selectPurchaseRequests = (state: RootState) => state.purchaseRequests.requests;
export const selectPurchaseLoading = (state: RootState) => state.purchaseRequests.loading;
export const selectPurchaseError = (state: RootState) => state.purchaseRequests.error;