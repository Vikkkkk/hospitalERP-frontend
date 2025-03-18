import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchDepartmentInventoryById, // ✅ Keep if used
  requestDepartmentInventory,
  checkoutInventory,
} from '../actions/departmentInventoryActions';

import { DepartmentInventoryItem } from '../types/inventoryTypes';

interface DepartmentInventoryState {
  items: DepartmentInventoryItem[];
  checkInHistory: any[];  // TODO: Strong typing if used
  checkOutHistory: any[];
  loading: boolean;
  error: string | null;
}

const initialState: DepartmentInventoryState = {
  items: [],
  checkInHistory: [],
  checkOutHistory: [],
  loading: false,
  error: null,
};

const departmentInventorySlice = createSlice({
  name: 'departmentInventory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    // 📦 Fetch by ID 
    builder
      .addCase(fetchDepartmentInventoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartmentInventoryById.fulfilled, (state, action: PayloadAction<DepartmentInventoryItem[]>) => {
        state.loading = false;
        state.items = action.payload;  // ✅ Fix property
      })
      .addCase(fetchDepartmentInventoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ➕ Request inventory (no immediate UI update)
    builder.addCase(requestDepartmentInventory.fulfilled, () => {});

    // ✅ 核销：Update stock in batches
    builder.addCase(checkoutInventory.fulfilled, (state, action: PayloadAction<{ itemId: number; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.itemId);
      let qtyToDeduct = action.payload.quantity;

      if (item?.batches) {
        for (const batch of item.batches) {
          if (qtyToDeduct <= 0) break;
          const deduct = Math.min(batch.quantity, qtyToDeduct);
          batch.quantity -= deduct;
          qtyToDeduct -= deduct;
        }
      }
    });
  },
});

export default departmentInventorySlice.reducer;