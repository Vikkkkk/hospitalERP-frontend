import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { PurchaseRequest } from '../types/purchaseRequestTypes';

export const fetchPurchaseRequests = createAsyncThunk<PurchaseRequest[], void, { rejectValue: string }>(
  'purchaseRequests/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get<{ requests: PurchaseRequest[] }>('/procurement-requests');
      return res.data.requests;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '❌ 获取采购请求失败');
    }
  }
);

export const submitPurchaseRequest = createAsyncThunk<void, number, { rejectValue: string }>(
  'purchaseRequests/submit',
  async (id, { rejectWithValue }) => {
    try {
      await api.post(`/procurement-requests/${id}/submit`);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '❌ 提交失败');
    }
  }
);

export const deletePurchaseRequest = createAsyncThunk<void, number, { rejectValue: string }>(
  'purchaseRequests/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/procurement-requests/${id}`);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '❌ 删除失败');
    }
  }
);