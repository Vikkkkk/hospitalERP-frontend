// 🔹 Purchase Request Interface
export interface PurchaseRequest {
    id: number;
    itemname: string;
    quantity: number;
    deadlineDate: string; // 📅 Deadline for procurement
    departmentId: number; // 📌 Requesting Department
    status: 'Pending' | 'Submitted' | 'Approved' | 'Rejected';
    createdAt: string;
    updatedAt: string;
  }

  export interface PurchaseRequestState {
    requests: PurchaseRequest[];
    loading: boolean;
    error: string | null;
  }