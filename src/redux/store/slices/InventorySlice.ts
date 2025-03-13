import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InventoryState, InventoryItem } from '../../types/inventoryTypes';
import { fetchInventory, addInventoryItem, transferInventory, updateInventoryUsage, restockInventory } from '../../actions/inventoryActions';

const initialState: InventoryState = {
  inventoryItems: [],
  loading: false,
  error: null,
};

// ✅ Utility function to find an inventory item by ID
const findInventoryItemIndex = (state: InventoryState, itemId: number) => {
  return state.inventoryItems.findIndex(item => item.id === itemId);
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {}, // No manual reducers needed (handled by Thunks)
  extraReducers: (builder) => {
    builder
      // ✅ Fetch Inventory
      .addCase(fetchInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action: PayloadAction<InventoryItem[]>) => {
        state.loading = false;
        state.inventoryItems = action.payload;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch inventory';
      })

      // ✅ Add Inventory Item
      .addCase(addInventoryItem.fulfilled, (state, action: PayloadAction<InventoryItem>) => {
        state.inventoryItems.push(action.payload);
      })
      .addCase(addInventoryItem.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to add inventory item';
      })

      // ✅ Transfer Inventory
      .addCase(transferInventory.fulfilled, (state, action: PayloadAction<InventoryItem>) => {
        const index = findInventoryItemIndex(state, action.payload.id);
        if (index !== -1) state.inventoryItems[index] = action.payload;
      })
      .addCase(transferInventory.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to transfer inventory';
      })

      // ✅ Update Inventory Usage
      .addCase(updateInventoryUsage.fulfilled, (state, action: PayloadAction<InventoryItem>) => {
        const index = findInventoryItemIndex(state, action.payload.id);
        if (index !== -1) state.inventoryItems[index] = action.payload;
      })
      .addCase(updateInventoryUsage.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update inventory usage';
      })

      // ✅ Restock Inventory
      .addCase(restockInventory.fulfilled, (state, action: PayloadAction<InventoryItem>) => {
        const index = findInventoryItemIndex(state, action.payload.id);
        if (index !== -1) state.inventoryItems[index] = action.payload;
      })
      .addCase(restockInventory.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to restock inventory';
      });
  },
});

export default inventorySlice.reducer;