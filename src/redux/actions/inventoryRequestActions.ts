import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { InventoryRequest } from '../types/InventoryRequestTypes';
import inventoryRequestService from '../../services/inventoryRequestService';

// 📦 Fetch All Inventory Requests with Filters
export const fetchInventoryRequests = createAsyncThunk(
  'inventoryRequests/fetchAll',
  async (
    filters: { search?: string; department?: string | null; status?: string | null; dateRange?: (string | null)[] },
    { rejectWithValue }
  ) => {
    try {
      return await inventoryRequestService.getAllRequests(filters);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '❌ 获取库存申请失败');
    }
  }
);

// 📩 Create Inventory Request
export const createInventoryRequest = createAsyncThunk(
  'inventoryRequests/create',
  async (requestData: Omit<InventoryRequest, 'id' | 'status'>, { rejectWithValue }) => {
    try {
      return await inventoryRequestService.createRequest(requestData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '❌ 创建申请失败');
    }
  }
);

// ✅ Update Inventory Request Status
export const updateInventoryRequest = createAsyncThunk(
  'inventoryRequests/update',
  async (
    { id, status, notes }: { id: number; status: 'Approved' | 'Rejected' | 'Restocking' | 'Procurement'; notes?: string },
    { rejectWithValue }
  ) => {
    try {
      return await inventoryRequestService.updateRequest(id, status, notes);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '❌ 更新申请失败');
    }
  }
);

// 📤 Delete Inventory Request
export const deleteInventoryRequest = createAsyncThunk(
  'inventoryRequests/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await inventoryRequestService.deleteRequest(id);
      return id; // Return ID to remove from state
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '❌ 删除失败');
    }
  }
);

// 🚀 Generate QR Code for Checkout
export const generateCheckoutQRCode = createAsyncThunk(
  'inventoryRequests/generateQRCode',
  async (id: number, { rejectWithValue }) => {
    try {
      return await inventoryRequestService.generateCheckoutQRCode(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || '❌ 生成二维码失败');
    }
  }
);

// 🧾 Complete Checkout Process
export const completeCheckoutRequest = createAsyncThunk(
  'inventoryRequests/completeCheckout',
  async ({ id, checkoutUser }: { id: number; checkoutUser?: string }, { rejectWithValue }) => {
    try {
      return await inventoryRequestService.completeCheckoutRequest(id, checkoutUser);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || '❌ 核销失败');
    }
  }
);


// 🔄 Fetch Pending Inventory Requests
export const fetchPendingRequests = createAsyncThunk<InventoryRequest[], void, { rejectValue: string }>(
  'inventoryRequests/fetchPendingRequests',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get<{ requests: InventoryRequest[] }>('/inventory-requests?status=Pending');
      return res.data.requests;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '❌ 获取库存请求失败');
    }
  }
);

export const approveInventoryRequest = createAsyncThunk<void, number, { rejectValue: string }>(
  'inventoryRequests/approve',
  async (requestId, { rejectWithValue }) => {
    try {
      await api.post(`/inventory-requests/${requestId}/approve`);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '❌ 批准请求失败');
    }
  }
);