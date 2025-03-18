import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { InventoryRequest } from '../types/InventoryRequestTypes';
import {
  fetchInventoryRequests,
  createInventoryRequest,
  updateInventoryRequest,
  deleteInventoryRequest,
  generateCheckoutQRCode,
  completeCheckoutRequest,
  fetchPendingRequests
} from '../actions/inventoryRequestActions';
import { RootState } from '../store';
import { message } from 'antd'; // ✅ Fix TS2552: Cannot find name 'message'


// 🛠️ **Slice Definition**
const inventoryRequestSlice = createSlice({
  name: 'inventoryRequests',
  initialState: {
    requests: [] as InventoryRequest[],
    loading: false,
    qrCodeData: null as string | null,
    error: null as string | null,
    searchTerm: '', // 🔍 Store search input
  },
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventoryRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventoryRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(fetchInventoryRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createInventoryRequest.fulfilled, (state, action) => {
        state.requests.push(action.payload);
      })
      .addCase(updateInventoryRequest.fulfilled, (state, action) => {
        const index = state.requests.findIndex((req) => req.id === action.payload.id);
        if (index !== -1) state.requests[index] = action.payload;
      })
      .addCase(deleteInventoryRequest.fulfilled, (state, action) => {
        state.requests = state.requests.filter((req) => req.id !== action.payload);
      })
      .addCase(generateCheckoutQRCode.pending, (state) => {
        state.qrCodeData = null;
      })
      .addCase(generateCheckoutQRCode.fulfilled, (state, action) => {
        state.qrCodeData = action.payload.qrCode;
      })
      .addCase(generateCheckoutQRCode.rejected, (state, action) => {
        state.qrCodeData = null;
        state.error = action.payload as string;
      })
      .addCase(completeCheckoutRequest.fulfilled, () => {
        message.success('Checkout completed successfully!');
      })
      .addCase(completeCheckoutRequest.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(fetchPendingRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPendingRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload; // 👈 Could override OR merge depending on UX
      })
      .addCase(fetchPendingRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  },
});

export default inventoryRequestSlice.reducer;

// 🔍 **Selectors**
export const selectInventoryRequests = (state: RootState) => state.inventoryRequests.requests;
export const selectInventoryRequestsLoading = (state: RootState) => state.inventoryRequests.loading;
export const selectInventoryRequestsError = (state: RootState) => state.inventoryRequests.error;
export const selectSearchTerm = (state: RootState) => state.inventoryRequests.searchTerm;

// 📌 **Actions**
export const { setSearchTerm } = inventoryRequestSlice.actions;