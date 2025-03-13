import React from 'react';
import { useSelector } from 'react-redux';
import { selectStockRequests } from '../redux/selectors/inventoryTransactionSelectors';

const StockRequestList: React.FC = () => {
  const stockRequests = useSelector(selectStockRequests); // ✅ Fetch from Redux

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
          {stockRequests.length > 0 ? (
            stockRequests.map((request) => (
              <tr key={request.id} className="border">
                <td className="border p-2">{request.itemname}</td> {/* ✅ Corrected field name */}
                <td className="border p-2">{request.quantity}</td>
                <td className="border p-2">{request.departmentId ?? 'Main Warehouse'}</td> {/* ✅ Handle null */}
                <td className="border p-2">{request.transactiontype}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="p-3 text-center text-gray-500">❌ No stock requests found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StockRequestList;