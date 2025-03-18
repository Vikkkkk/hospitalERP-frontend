import api from './api';
import { InventoryRequest } from '../redux/types/InventoryRequestTypes';

// ✅ Response types from backend
interface InventoryRequestResponse {
  requests: InventoryRequest[];
}

interface SingleRequestResponse {
  request: InventoryRequest;
}

const inventoryRequestService = {
  // 📥 Fetch All Inventory Requests with optional filters
  getAllRequests: async (
    filters: { search?: string; department?: string | null; status?: string | null; dateRange?: (string | null)[] }
  ): Promise<InventoryRequest[]> => {
    const response = await api.get<InventoryRequestResponse>('/inventory-requests', { params: filters });
    return response.data.requests;
  },

  // ✅ Create a new Inventory Request
  createRequest: async (requestData: Omit<InventoryRequest, 'id' | 'status'>): Promise<InventoryRequest> => {
    const response = await api.post<SingleRequestResponse>('/inventory-requests', requestData);
    return response.data.request;
  },

  // ✏️ Update Inventory Request Status
  updateRequest: async (
    id: number,
    status: 'Approved' | 'Rejected' | 'Restocking' | 'Procurement',
    notes?: string
  ): Promise<InventoryRequest> => {
    const response = await api.patch<SingleRequestResponse>(`/inventory-requests/${id}/status`, { status, notes });
    return response.data.request;
  },

  // ❌ Delete Inventory Request
  deleteRequest: async (id: number): Promise<void> => {
    await api.delete(`/inventory-requests/${id}`);
  },

  // 🚀 Generate QR Code for Checkout
  generateCheckoutQRCode: async (id: number): Promise<{ qrCode: string }> => {
    const response = await api.get<{ qrCode: string }>(`/inventory-requests/${id}/checkout`);
    return response.data;
  },

  // 🧾 Complete Checkout Request
  completeCheckoutRequest: async (id: number, checkoutUser: string | undefined): Promise<InventoryRequest> => {
    const response = await api.post<SingleRequestResponse>(`/inventory-requests/${id}/checkout`, { checkoutUser });
    return response.data.request;
  },
};

export default inventoryRequestService;