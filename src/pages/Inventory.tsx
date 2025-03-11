import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useInventory } from '../context/InventoryContext';
import { toast } from 'react-toastify';
import api from '../services/api';

interface InventoryItem {
  id: number;
  itemname: string;
  quantity: number;
  departmentid: number | null;
  minimumstocklevel: number;
}

interface InventoryTransaction {
  id: number;
  transactiontype: 'Transfer' | 'Usage' | 'Restocking';
  quantity: number;
  performedby: number;
  createdAt: string;
}

const Inventory: React.FC = () => {
  const { user } = useAuth();
  const { inventory, fetchInventory, transactions, fetchTransactions } = useInventory();
  const [transferItemName, setTransferItemName] = useState('');
  const [transferQuantity, setTransferQuantity] = useState(0);
  const [targetDepartmentId, setTargetDepartmentId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchInventory();
    fetchTransactions();
  }, []);

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
        departmentid: targetDepartmentId,
      });

      toast.success('Stock transferred successfully.');
      fetchInventory();
      fetchTransactions();
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
      <h1 className="text-2xl font-bold mb-4">📦 Inventory Management</h1>

      {/* Transfer Stock Form */}
      {user?.role === 'Admin' || user?.role === 'WarehouseStaff' ? (
        <form onSubmit={handleTransfer} className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold mb-2">🔄 Transfer Stock</h2>

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
      <h2 className="text-xl font-semibold mb-4">📋 Current Inventory</h2>
      <div className="space-y-4">
        {inventory.length > 0 ? (
          inventory.map((item) => (
            <div key={item.id} className="p-4 bg-gray-100 rounded-lg shadow">
              <h3 className="font-bold text-lg">{item.itemname}</h3>
              <p className="text-gray-700">Quantity: {item.quantity}</p>
              <p className="text-gray-700">
                Department ID: {item.departmentid !== null ? item.departmentid : 'Main Warehouse'}
              </p>
              <p className="text-gray-700">Minimum Stock Level: {item.minimumstocklevel}</p>
              {item.quantity < item.minimumstocklevel && (
                <p className="text-red-500 font-semibold">⚠ Low Stock Alert</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">❌ No inventory items found.</p>
        )}
      </div>

      {/* Inventory Transactions */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">🔄 Inventory Transactions</h2>
        <div className="overflow-x-auto bg-gray-100 p-4 rounded-lg">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 text-left">🆔 ID</th>
                <th className="p-3 text-left">🔄 Type</th>
                <th className="p-3 text-left">📦 Quantity</th>
                <th className="p-3 text-left">👤 Performed By</th>
                <th className="p-3 text-left">📅 Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.slice((currentPage - 1) * 5, currentPage * 5).map((txn) => (
                  <tr key={txn.id} className="border-b">
                    <td className="p-3">{txn.id}</td>
                    <td className="p-3">{txn.transactiontype}</td>
                    <td className="p-3">{txn.quantity}</td>
                    <td className="p-3">{txn.performedby}</td>
                    <td className="p-3">{new Date(txn.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-3 text-center text-gray-500">
                    ❌ No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-l-lg"
            disabled={currentPage === 1}
          >
            ◀ Previous
          </button>
          <span className="px-4 py-2 bg-white border">{currentPage}</span>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-r-lg"
            disabled={transactions.length < currentPage * 5}
          >
            Next ▶
          </button>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
