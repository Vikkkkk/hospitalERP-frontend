// ✅ Define Inventory Transaction Type
export interface InventoryTransaction {
    id: number;
    itemname: string;
    inventoryid: number;
    departmentId?: number;
    transactiontype: string; // "Transfer", "Usage", "Restock"
    quantity: number;
    performedby?: number;
    category: string;
    createdAt: string;
    updatedAt?: string;
    deletedAt?: string | null;
  }
  
  // ✅ Define Inventory Transaction Redux State
  export interface InventoryTransactionState {
    transactions: InventoryTransaction[];
    totalPages: number;
    currentPage: number;
    transactionLoading: boolean;
    transactionError: string | null;
    monthlyReport: {
      month: string;
      year: string;
      totalTransactions: number;
      topUsedItems: Record<number, number>;
      transactions: InventoryTransaction[];
    } | null;
    csvUrl: string | null;
  }