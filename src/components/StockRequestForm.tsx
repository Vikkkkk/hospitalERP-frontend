import React, { useState } from 'react';
import { requestStockTransfer } from '../services/InventoryService';
import { useAuth } from '../context/AuthContext';
import { useInventory } from '../context/InventoryContext';
import { toast } from 'react-toastify';

const StockRequestForm: React.FC = () => {
  const { user } = useAuth();
  const { fetchStockRequests } = useInventory();
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await requestStockTransfer(itemName, quantity, user?.departmentid!);
      toast.success('库存请求已提交！');
      fetchStockRequests();
      setItemName('');
      setQuantity(1);
    } catch (error) {
      toast.error('库存请求提交失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">📦 请求库存转移</h2>

      <label className="block mb-2">物品名称</label>
      <input
        type="text"
        className="w-full p-2 border rounded"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        required
      />

      <label className="block mt-4 mb-2">数量</label>
      <input
        type="number"
        className="w-full p-2 border rounded"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        min="1"
        required
      />

      <button
        type="submit"
        className="mt-4 w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
        disabled={loading}
      >
        {loading ? '提交中...' : '提交请求'}
      </button>
    </form>
  );
};

export default StockRequestForm;
