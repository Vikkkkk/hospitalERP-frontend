export interface InventoryItem {
    id: number;
    itemname: string;  
    category: string;
    quantity: number;
    unit: string;
    departmentId?: number; // Optional for warehouse items
    lastRestocked?: string; // Optional timestamp for restocking
    minimumStockLevel: number;
    restockThreshold: number;
    supplier?: string; // Optional field
    expiryDate?: string; // Optional, stored as a string in frontend
    purchaseDate?: string; // Optional, stored as a string in frontend
    createdAt?: string; // Optional, for tracking record creation
    updatedAt?: string; // Optional, for tracking last update
  }
  
  export interface InventoryState {
    inventoryItems: InventoryItem[];
    loading: boolean;
    error: string | null;
  }