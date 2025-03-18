// 🔹 Inventory Batch (Shared)
export interface InventoryBatch {
  quantity: number;
  expiryDate?: string | null;
  supplier?: string | null;
}

// 🔹 Main Inventory Item (一级库)
export interface MainInventoryItem {
  id: number;
  itemname: string;  
  category: string;
  unit: string;
  totalQuantity?: number;
  departmentId?: number; // Only used for transfer
  lastRestocked?: string;
  minimumStockLevel: number;
  restockThreshold: number;
  supplier?: string;
  expiryDate?: string;
  purchaseDate?: string;
  createdAt?: string;
  updatedAt?: string;
  batches?: InventoryBatch[];
}

// 🔹 Main Inventory Slice State
export interface MainInventoryState {
  items: MainInventoryItem[];  // ✅ Only Main Inventory
  searchResults: string[];
  loading: boolean;
  error: string | null;
}

// 🔹 Department Inventory Item (二级库)
export interface DepartmentInventoryItem {
  id: number;
  itemname: string;
  category: string;
  unit: string;
  quantity: number;
  supplier?: string;
  lastRestocked?: string;
  batches?: { quantity: number }[];
}

// 🔹 Department Inventory Slice State
export interface DepartmentInventoryState {
  items: DepartmentInventoryItem[];
  checkInHistory: any[];      // ⚠️ Strongly recommend typing later
  checkOutHistory: any[];
  loading: boolean;
  error: string | null;
}



export interface InventoryBatch {
  quantity: number;
  expiryDate?: string | null;
  supplier?: string | null;
}