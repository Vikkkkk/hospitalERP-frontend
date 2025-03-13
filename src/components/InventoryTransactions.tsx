import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInventoryTransactions } from '../redux/actions/inventoryTransactionActions';
import { selectTransactions, selectTransactionLoading, selectTransactionError } from '../redux/selectors/inventoryTransactionSelectors';
import { AppDispatch } from '../redux/store';
import { format } from 'date-fns';

const InventoryTransactions: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // ✅ Retrieve Redux state
  const transactions = useSelector(selectTransactions);
  const loading = useSelector(selectTransactionLoading);
  const error = useSelector(selectTransactionError);

  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  useEffect(() => {
    dispatch(fetchInventoryTransactions({ page: currentPage, limit: transactionsPerPage }));
  }, [dispatch, currentPage]);

  // Pagination logic
  const totalPages = Math.ceil(transactions.length / transactionsPerPage);
  const currentTransactions = transactions.slice(
    (currentPage - 1) * transactionsPerPage,
    currentPage * transactionsPerPage
  );

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">📦 Inventory Transactions</h2>

      {/* Loading & Error Handling */}
      {loading && <p className="text-blue-500">Loading transactions...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">🔄 Type</th>
              <th className="p-3 text-left">📦 Quantity</th>
              <th className="p-3 text-left">👤 Performed By</th>
              <th className="p-3 text-left">📅 Date</th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.length > 0 ? (
              currentTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b">
                  <td className="p-3">{transaction.transactiontype}</td>
                  <td className="p-3">{transaction.quantity}</td>
                  <td className="p-3">User ID: {transaction.performedby || 'N/A'}</td>
                  <td className="p-3">{format(new Date(transaction.createdAt), 'yyyy-MM-dd HH:mm')}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-3 text-center text-gray-500">
                  ❌ No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center space-x-2">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            ⬅ Previous
          </button>
          <span className="px-4 py-2 border rounded">Page {currentPage} of {totalPages}</span>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next ➡
          </button>
        </div>
      )}
    </div>
  );
};

export default InventoryTransactions;