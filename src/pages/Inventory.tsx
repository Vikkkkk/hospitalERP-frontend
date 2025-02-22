import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../services/api';

interface InventoryItem {
  id: number;
  itemName: string;
  quantity: number;
  departmentId: number | null;
  minimumStockLevel: number;
}

const Inventory: React.FC = () => {
  const { user } = useAuth();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [transferItemName, setTransferItemName] = useState('');
  const [transferQuantity, setTransferQuantity] = useState(0);
  const [targetDepartmentId, setTargetDepartmentId] = useState<number | null>(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await api.get('/api/inventory');
      setInventory(response.data.inventory);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch inventory.');
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!transferItemName || transferQuantity <= 0 || !targetDepartmentId) {
      toast.error('Please fill out all fields correctly.');
      return;
    }

    try {
      await api.post('/api/inventory/transfer', {
        itemName: transferItemName,
        quantity: transferQuantity,
        departmentId: targetDepartmentId,
      });

      toast.success('Stock transferred successfully.');
      fetchInventory();
      setTransferItemName('');
      setTransferQuantity(0);
      setTargetDepartmentId(null);
    } catch (error) {
      console.error(error);
      toast.error('Failed to transfer stock.');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Inventory Management</h1>

      {/* Transfer Stock Form */}
      {user?.role === 'Admin' || user?.role === 'WarehouseStaff' ? (
        <form onSubmit={handleTransfer} className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold mb-2">Transfer Stock</h2>

          <div>
            <label htmlFor="transferItemName" className="block text-gray-700">Item Name</label>
            <input
              type="text"
              id="transferItemName"
              value={transferItemName}
              onChange={(e) => setTransferItemName(e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="Enter item name"
            />
          </div>

          <div>
            <label htmlFor="transferQuantity" className="block text-gray-700">Quantity</label>
            <input
              type="number"
              id="transferQuantity"
              value={transferQuantity}
              onChange={(e) => setTransferQuantity(Number(e.target.value))}
              className="w-full p-2 border rounded-lg"
              placeholder="Enter quantity"
            />
          </div>

          <div>
            <label htmlFor="targetDepartmentId" className="block text-gray-700">Target Department ID</label>
            <input
              type="number"
              id="targetDepartmentId"
              value={targetDepartmentId ?? ''}
              onChange={(e) => setTargetDepartmentId(Number(e.target.value))}
              className="w-full p-2 border rounded-lg"
              placeholder="Enter department ID"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
          >
            Transfer Stock
          </button>
        </form>
      ) : null}

      {/* Inventory List */}
      <h2 className="text-xl font-semibold mb-4">Current Inventory</h2>
      <div className="space-y-4">
        {inventory.length > 0 ? (
          inventory.map((item) => (
            <div key={item.id} className="p-4 bg-gray-100 rounded-lg shadow">
              <h3 className="font-bold text-lg">{item.itemName}</h3>
              <p className="text-gray-700">Quantity: {item.quantity}</p>
              <p className="text-gray-700">
                Department ID: {item.departmentId !== null ? item.departmentId : 'Main Warehouse'}
              </p>
              <p className="text-gray-700">Minimum Stock Level: {item.minimumStockLevel}</p>
              {item.quantity < item.minimumStockLevel && (
                <p className="text-red-500 font-semibold">Low Stock Alert</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No inventory items found.</p>
        )}
      </div>
    </div>
  );
};

export default Inventory;
