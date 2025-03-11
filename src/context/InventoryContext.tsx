import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from '../services/api';

interface InventoryItem {
  id: number;
  itemname: string;
  quantity: number;
  category: 'Medical Supply' | 'Drug' | 'Office Supply' | 'Equipment';
  unit: string;
  departmentid: number | null;
  expiryDate?: string;
  supplier?: string;
  minimumstocklevel: number; 
}

interface InventoryTransaction {
  id: number;
  transactiontype: 'Transfer' | 'Usage' | 'Restocking';
  quantity: number;
  performedby: number;
  createdAt: string;
}

interface StockRequest {
  id: number;
  itemName: string;
  quantity: number;
  departmentId: number;
  status: 'Pending' | 'Approved' | 'Denied';
}

interface InventoryContextType {
  inventory: InventoryItem[];
  transactions: InventoryTransaction[];
  stockRequests: StockRequest[];
  fetchInventory: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  fetchStockRequests: () => Promise<void>;
  approveStockRequest: (requestId: number) => Promise<void>;
  denyStockRequest: (requestId: number) => Promise<void>;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [stockRequests, setStockRequests] = useState<StockRequest[]>([]);

  // 🔄 Fetch all inventory items
  const fetchInventory = async () => {
    try {
      const response = await axios.get('/api/inventory');
      setInventory(response.data.inventory);
    } catch (error) {
      console.error('❌ 获取库存失败:', error);
    }
  };

  // 🔄 Fetch inventory transactions
  const fetchTransactions = async () => {
    try {
      const response = await axios.get('/api/inventory-transactions');
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error('❌ 获取库存交易失败:', error);
    }
  };

  // 🔄 Fetch all stock transfer requests
  const fetchStockRequests = async () => {
    try {
      const response = await axios.get('/api/inventory-transfer');
      setStockRequests(response.data.requests);
    } catch (error) {
      console.error('❌ 获取库存转移请求失败:', error);
    }
  };

  // ✅ Approve stock transfer request
  const approveStockRequest = async (requestId: number) => {
    try {
      await axios.post(`/api/inventory-transfer/approve/${requestId}`);
      setStockRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === requestId ? { ...request, status: 'Approved' } : request
        )
      );
    } catch (error) {
      console.error('❌ 库存转移审批失败:', error);
    }
  };

  // ❌ Deny stock transfer request
  const denyStockRequest = async (requestId: number) => {
    try {
      await axios.post(`/api/inventory-transfer/deny/${requestId}`);
      setStockRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === requestId ? { ...request, status: 'Denied' } : request
        )
      );
    } catch (error) {
      console.error('❌ 库存转移拒绝失败:', error);
    }
  };

  useEffect(() => {
    fetchInventory();
    fetchTransactions();
    fetchStockRequests();
  }, []);

  return (
    <InventoryContext.Provider
      value={{
        inventory,
        transactions,
        stockRequests,
        fetchInventory,
        fetchTransactions,
        fetchStockRequests,
        approveStockRequest,
        denyStockRequest,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
