import axios from './api';

export const fetchInventory = async () => {
  const response = await axios.get('/api/inventory');
  return response.data.inventory;
};

export const fetchStockRequests = async () => {
  const response = await axios.get('/api/inventory-transfer');
  return response.data.requests;
};

export const requestStockTransfer = async (itemName: string, quantity: number, departmentId: number) => {
  const response = await axios.post('/api/inventory-transfer/request', { itemName, quantity, departmentId });
  return response.data;
};

export const approveStockRequest = async (requestId: number) => {
  const response = await axios.post(`/api/inventory-transfer/approve/${requestId}`);
  return response.data;
};

export const denyStockRequest = async (requestId: number) => {
  const response = await axios.post(`/api/inventory-transfer/deny/${requestId}`);
  return response.data;
};
