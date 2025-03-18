import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PurchaseRequest } from '../types/purchaseRequestTypes';
import { fetchPurchaseRequests } from '../actions/purchaseRequestActions';

interface PurchaseRequestState {
  requests: PurchaseRequest[];
  loading: boolean;
  error: string | null;
}

const initialState: PurchaseRequestState = {
  requests: [],
  loading: false,
  error: null,
};

const purchaseRequestSlice = createSlice({
  name: 'purchaseRequests',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchaseRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchaseRequests.fulfilled, (state, action: PayloadAction<PurchaseRequest[]>) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(fetchPurchaseRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || '❌ 获取采购请求失败';
      });
  },
});

export default purchaseRequestSlice.reducer;