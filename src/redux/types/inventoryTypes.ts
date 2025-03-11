export interface InventoryItem {
    id: number;
    itemname: string;
    category: string;
    unit: string;
    quantity: number;
    minimumStockLevel: number;
    restockThreshold: number;
    supplier?: string;
    expiryDate?: string | null;
    purchaseDate?: string | null;
    departmentId?: number | null;
    lastRestocked?: string | null;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface InventoryState {
    inventoryItems: InventoryItem[];
    loading: boolean;
    error: string | null;
  }
  