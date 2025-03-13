import React from 'react';
import InventoryTable from '../components/InventoryTable';
import InventoryStats from '../components/InventoryStats';

const InventoryDashboard: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📦 库存管理</h1>

      <InventoryStats />

      <h2 className="text-xl font-semibold mt-6">库存列表</h2>
      <InventoryTable />
    </div>
  );
};

export default InventoryDashboard;
