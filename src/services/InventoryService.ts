import axios from './api';

/**
 * 📦 Fetch inventory list
 */
export const fetchInventory = async () => {
  try {
    const response = await axios.get('/api/inventory');
    return response.data.inventory;
  } catch (error: any) {
    console.error("❌ 获取库存失败:", error);
    throw new Error(error.response?.data?.message || '❌ 获取库存失败');
  }
};

/**
 * 🔄 Fetch stock transfer requests
 */
export const fetchStockRequests = async () => {
  try {
    const response = await axios.get('/api/inventory-transfer');
    return response.data.requests;
  } catch (error: any) {
    console.error("❌ 获取库存转移请求失败:", error);
    throw new Error(error.response?.data?.message || '❌ 获取库存转移请求失败');
  }
};

/**
 * ➕ Request stock transfer (Check-in)
 */
export const requestStockTransfer = async (itemName: string, quantity: number, departmentId: number) => {
  try {
    const response = await axios.post('/api/inventory-transfer/request', { itemName, quantity, departmentId });
    return response.data;
  } catch (error: any) {
    console.error("❌ 请求库存转移失败:", error);
    throw new Error(error.response?.data?.message || '❌ 请求库存转移失败');
  }
};

/**
 * ✅ Approve a stock transfer request
 */
export const approveStockRequest = async (requestId: number) => {
  try {
    const response = await axios.post(`/api/inventory-transfer/approve/${requestId}`);
    return response.data;
  } catch (error: any) {
    console.error("❌ 批准库存转移请求失败:", error);
    throw new Error(error.response?.data?.message || '❌ 批准库存转移请求失败');
  }
};

/**
 * ❌ Deny a stock transfer request
 */
export const denyStockRequest = async (requestId: number) => {
  try {
    const response = await axios.post(`/api/inventory-transfer/deny/${requestId}`);
    return response.data;
  } catch (error: any) {
    console.error("❌ 拒绝库存转移请求失败:", error);
    throw new Error(error.response?.data?.message || '❌ 拒绝库存转移请求失败');
  }
};