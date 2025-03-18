import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MainInventoryItem, MainInventoryState } from '../types/inventoryTypes';
import {
  fetchMainInventory,
  addInventoryItem,
  transferInventory,
  restockInventory,
  searchMainInventory,
  requestInventory,
  createPurchaseRequest
} from '../actions/mainInventoryActions';

// 🧩 Initial State (Main Inventory)
const initialState: MainInventoryState = {
  items: [],
  searchResults: [],
  loading: false,
  error: null,
};

// 🧮 Utility to find index by ID
const findInventoryItemIndex = (items: MainInventoryItem[], itemId: number) =>
  items.findIndex(item => item.id === itemId);

// ⚙️ Slice Definition (Main Inventory)
const mainInventorySlice = createSlice({
  name: 'mainInventory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔍 Fetch Main Inventory
      .addCase(fetchMainInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMainInventory.fulfilled, (state, action: PayloadAction<MainInventoryItem[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMainInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '❌ 获取主库存失败';
      })

      // 🔍 Search Main Inventory
      .addCase(searchMainInventory.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchMainInventory.fulfilled, (state, action: PayloadAction<string[]>) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchMainInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '❌ 搜索主库存失败';
      })

      // ➕ Add Item to Main Inventory
      .addCase(addInventoryItem.fulfilled, (state, action: PayloadAction<MainInventoryItem>) => {
        state.items.push(action.payload);
      })
      .addCase(addInventoryItem.rejected, (state, action) => {
        state.error = action.error.message || '❌ 添加库存失败';
      })

      // 🔄 Transfer Inventory (Handled in Dept Slice - omit here)

      // 🔄 Restock Item
      .addCase(restockInventory.fulfilled, (state, action: PayloadAction<MainInventoryItem>) => {
        const index = findInventoryItemIndex(state.items, action.payload.id);
        if (index !== -1) {
          state.items[index] = {
            ...state.items[index],
            ...action.payload,
          };
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(restockInventory.rejected, (state, action) => {
        state.error = action.error.message || '❌ 物资补充失败';
      })

      // 📩 Request Inventory (IR)
      .addCase(requestInventory.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(requestInventory.rejected, (state, action) => {
        state.error = action.error.message || '❌ 物资申请失败';
      })

      // 🛒 Purchase Request (PR)
      .addCase(createPurchaseRequest.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createPurchaseRequest.rejected, (state, action) => {
        state.error = action.error.message || '❌ 采购申请失败';
      });
  },
});

export default mainInventorySlice.reducer;