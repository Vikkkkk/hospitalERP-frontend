// import React from 'react';
// import { useSelector } from 'react-redux';
// import { selectDepartmentInventory } from '../redux/selectors/mainInventorySelectors'; // Change as needed

// const InventoryStats: React.FC = () => {
//   // ✅ Get inventory data (二级库 or 一级库 based on context)
//   const inventory = useSelector(selectDepartmentInventory); // or selectMainInventory

//   const totalItems = inventory.length;

//   // ✅ Calculate low stock items based on batch quantity
//   const lowStockItems = inventory.filter((item) => {
//     const totalQty = item.batches?.reduce((sum, batch) => sum + batch.quantity, 0) || 0;
//     return totalQty < item.restockThreshold;
//   }).length;

//   return (
//     <div className="p-4 bg-blue-100 rounded-lg flex justify-between">
//       <div>
//         <h2 className="text-lg font-semibold">📦 库存总数</h2>
//         <p className="text-xl">{totalItems} 种物品</p>
//       </div>

//       <div>
//         <h2 className="text-lg font-semibold">⚠️ 低库存警报</h2>
//         <p className="text-xl text-red-500">{lowStockItems} 种物品低于库存警戒线</p>
//       </div>
//     </div>
//   );
// };

// export default InventoryStats;