import React from 'react';
import { useSelector } from 'react-redux';
import { selectInventoryItems } from '../redux/selectors/inventorySelectors';

const InventoryStats: React.FC = () => {
  // ✅ Get inventory data from Redux store
  const inventory = useSelector(selectInventoryItems);

  const totalItems = inventory.length;
  const lowStockItems = inventory.filter((item) => item.quantity < 5).length;

  return (
    <div className="p-4 bg-blue-100 rounded-lg flex justify-between">
      <div>
        <h2 className="text-lg font-semibold">📦 库存总数</h2>
        <p className="text-xl">{totalItems} 种物品</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold">⚠️ 低库存警报</h2>
        <p className="text-xl text-red-500">{lowStockItems} 种物品低于库存警戒线</p>
      </div>
    </div>
  );
};

export default InventoryStats;