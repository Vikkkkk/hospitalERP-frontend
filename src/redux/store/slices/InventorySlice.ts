import { createSlice } from '@reduxjs/toolkit';
import { InventoryState } from '../types/InventoryActionTypes';
import { fetchInventory, addInventoryItem, transferInventory, updateInventoryUsage, restockInventory } from '../../actions/inventoryActions';

const initialState: InventoryState = {
  inventoryItems: [],
  loading: false,
  error: null,
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {}, // No manual reducers needed (handled by Thunks)
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.inventoryItems = action.payload;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addInventoryItem.fulfilled, (state, action) => {
        state.inventoryItems.push(action.payload);
      })
      .addCase(transferInventory.fulfilled, (state, action) => {
        const updatedItem = action.payload;
        const index = state.inventoryItems.findIndex(item => item.id === updatedItem.id);
        if (index !== -1) state.inventoryItems[index] = updatedItem;
      })
      .addCase(updateInventoryUsage.fulfilled, (state, action) => {
        const updatedItem = action.payload;
        const index = state.inventoryItems.findIndex(item => item.id === updatedItem.id);
        if (index !== -1) state.inventoryItems[index] = updatedItem;
      })
      .addCase(restockInventory.fulfilled, (state, action) => {
        const updatedItem = action.payload;
        const index = state.inventoryItems.findIndex(item => item.id === updatedItem.id);
        if (index !== -1) state.inventoryItems[index] = updatedItem;
      });
  },
});

export default inventorySlice.reducer;
