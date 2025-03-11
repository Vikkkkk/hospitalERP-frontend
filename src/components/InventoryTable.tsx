import React from 'react';
import { useInventory } from '../context/InventoryContext';

const InventoryTable: React.FC = () => {
  const { inventory } = useInventory();

  return (
    <table className="w-full border-collapse border border-gray-300 mt-4">
      <thead>
        <tr className="bg-gray-200">
          <th className="border p-2">物品名称</th>
          <th className="border p-2">分类</th>
          <th className="border p-2">库存数量</th>
          <th className="border p-2">单位</th>
          <th className="border p-2">供应商</th>
          <th className="border p-2">有效期</th>
        </tr>
      </thead>
      <tbody>
        {inventory.map((item) => (
          <tr key={item.id} className="border">
            <td className="border p-2">{item.itemname}</td>
            <td className="border p-2">{item.category}</td>
            <td className="border p-2">{item.quantity}</td>
            <td className="border p-2">{item.unit}</td>
            <td className="border p-2">{item.supplier || 'N/A'}</td>
            <td className="border p-2">{item.expiryDate ? item.expiryDate.split('T')[0] : 'N/A'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default InventoryTable;
