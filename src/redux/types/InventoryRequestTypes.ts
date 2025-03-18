export interface InventoryRequest {
  id: number;
  itemName: string;
  quantity: number;
  departmentId: number;
  requestedBy: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'CheckedOut' | 'Restocking' | 'Procurement';
  createdAt?: string; // Optional for UI display
  updatedAt?: string;
  requesterName?: string; // Optional, backend can join user
  departmentName?: string; // Optional, backend can join department
}

export interface InventoryRequestState {
  requests: InventoryRequest[];
  loading: boolean;
  error: string | null;
}