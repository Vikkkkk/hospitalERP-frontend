// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { toast } from 'react-toastify';
// import { AppDispatch } from '../redux/store';
// import { fetchInventory, transferInventory } from '../redux/actions/inventoryActions';
// import { fetchInventoryTransactions } from '../redux/actions/inventoryTransactionActions';
// import { selectInventoryItems } from '../redux/selectors/inventorySelectors';
// import { selectTransactions } from '../redux/selectors/inventoryTransactionSelectors';
// import { format } from 'date-fns';

// const Inventory: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const inventory = useSelector(selectInventoryItems);
//   const transactions = useSelector(selectTransactions);

//   const [transferItemName, setTransferItemName] = useState('');
//   const [transferQuantity, setTransferQuantity] = useState(0);
//   const [targetDepartmentId, setTargetDepartmentId] = useState<number | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [departments, setDepartments] = useState<{ id: number; name: string }[]>([]);

//   useEffect(() => {
//     dispatch(fetchInventory());
//     dispatch(fetchInventoryTransactions({ page: 1, limit: 5 }));

//     // ✅ Fetch department list (Simulated API call)
//     setTimeout(() => {
//       setDepartments([
//         { id: 1, name: 'IT Department' },
//         { id: 2, name: 'HR Department' },
//         { id: 3, name: 'Finance Department' },
//       ]);
//     }, 1000);
//   }, [dispatch]);

//   const handleTransfer = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!transferItemName || transferQuantity <= 0 || !targetDepartmentId) {
//       toast.error('⚠️ Please fill out all fields correctly.');
//       return;
//     }

//     try {
//       await dispatch(
//         transferInventory({ itemName: transferItemName, quantity: transferQuantity, departmentId: targetDepartmentId })
//       ).unwrap();
//       toast.success('✅ Stock transferred successfully.');
//       dispatch(fetchInventory());
//       dispatch(fetchInventoryTransactions({ page: 1, limit: 5 }));
//       setTransferItemName('');
//       setTransferQuantity(0);
//       setTargetDepartmentId(null);
//     } catch (error) {
//       console.error(error);
//       toast.error('❌ Failed to transfer stock.');
//     }
//   };

//   return (
//     <div className="p-6 bg-white rounded-lg shadow-md max-w-5xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">📦 Inventory Management</h1>

//       {/* ✅ Transfer Stock Form */}
//       <form onSubmit={handleTransfer} className="space-y-4 mb-8">
//         <h2 className="text-xl font-semibold mb-2">🔄 Transfer Stock</h2>

//         <div>
//           <label className="block text-gray-700">Item Name</label>
//           <select
//             value={transferItemName}
//             onChange={(e) => setTransferItemName(e.target.value)}
//             className="w-full p-2 border rounded-lg"
//           >
//             <option value="">Select Item</option>
//             {inventory.map((item) => (
//               <option key={item.id} value={item.itemname}>
//                 {item.itemname} (Qty: {item.quantity})
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block text-gray-700">Quantity</label>
//           <input
//             type="number"
//             value={transferQuantity}
//             onChange={(e) => setTransferQuantity(Number(e.target.value))}
//             className="w-full p-2 border rounded-lg"
//             placeholder="Enter quantity"
//             min="1"
//           />
//         </div>

//         <div>
//           <label className="block text-gray-700">Target Department</label>
//           <select
//             value={targetDepartmentId ?? ''}
//             onChange={(e) => setTargetDepartmentId(Number(e.target.value))}
//             className="w-full p-2 border rounded-lg"
//           >
//             <option value="">Select Department</option>
//             {departments.map((dept) => (
//               <option key={dept.id} value={dept.id}>
//                 {dept.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
//           Transfer Stock
//         </button>
//       </form>

//       {/* ✅ Inventory List */}
//       <h2 className="text-xl font-semibold mb-4">📋 Current Inventory</h2>
//       <div className="space-y-4">
//         {inventory.length > 0 ? (
//           inventory.map((item) => (
//             <div key={item.id} className="p-4 bg-gray-100 rounded-lg shadow">
//               <h3 className="font-bold text-lg">{item.itemname}</h3>
//               <p className="text-gray-700">Quantity: {item.quantity}</p>
//               <p className="text-gray-700">Department: {departments.find((d) => d.id === item.departmentId)?.name || 'Main Warehouse'}</p>
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-500">❌ No inventory items found.</p>
//         )}
//       </div>

//       {/* ✅ Inventory Transactions */}
//       <h2 className="text-xl font-semibold mt-10">🔄 Inventory Transactions</h2>
//       <table className="w-full table-auto border-collapse bg-gray-100 p-4 rounded-lg">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="p-3 text-left">🔄 Type</th>
//             <th className="p-3 text-left">📦 Quantity</th>
//             <th className="p-3 text-left">👤 Performed By</th>
//             <th className="p-3 text-left">📅 Date</th>
//           </tr>
//         </thead>
//         <tbody>
//           {transactions.length > 0 ? (
//             transactions.map((txn) => (
//               <tr key={txn.id} className="border-b">
//                 <td className="p-3">{txn.transactiontype}</td>
//                 <td className="p-3">{txn.quantity}</td>
//                 <td className="p-3">User ID: {txn.performedby || 'N/A'}</td>
//                 <td className="p-3">{format(new Date(txn.createdAt), 'yyyy-MM-dd HH:mm')}</td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan={4} className="p-3 text-center text-gray-500">❌ No transactions found.</td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Inventory;