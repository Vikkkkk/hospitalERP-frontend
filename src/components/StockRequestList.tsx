import React from 'react';
import { useInventory } from '../context/InventoryContext';

const StockRequestList: React.FC = () => {
  const { stockRequests } = useInventory();

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold">📜 库存请求列表</h2>

      <table className="w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">物品名称</th>
            <th className="border p-2">数量</th>
            <th className="border p-2">部门</th>
            <th className="border p-2">状态</th>
          </tr>
        </thead>
        <tbody>
          {stockRequests.map((request) => (
            <tr key={request.id} className="border">
              <td className="border p-2">{request.itemName}</td>
              <td className="border p-2">{request.quantity}</td>
              <td className="border p-2">{request.departmentId}</td>
              <td className="border p-2">{request.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockRequestList;
