import React from 'react';
import StockRequestForm from '../components/StockRequestForm';
import StockRequestList from '../components/StockRequestList';

const RequestStock: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">🔄 申请库存转移</h1>
      <StockRequestForm />
      <StockRequestList />
    </div>
  );
};

export default RequestStock;
