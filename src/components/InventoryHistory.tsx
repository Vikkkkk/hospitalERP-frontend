import React, { useEffect } from 'react';
import { Tabs, Table, Spin, message } from 'antd';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  fetchCheckInHistory,
  fetchCheckOutHistory,
  fetchAllHistory
} from '../redux/actions/inventoryTransactionActions';

const { TabPane } = Tabs;

interface InventoryHistoryProps {
  context: 'main' | 'department';
  isGlobalUser: boolean;
  userDepartmentId: number | null;
  selectedDepartmentId: number | null;
}

const InventoryHistory: React.FC<InventoryHistoryProps> = ({
  context,
  isGlobalUser,
  userDepartmentId,
  selectedDepartmentId
}) => {
  const dispatch = useAppDispatch();

  const checkInData = useAppSelector(state => state.inventoryTransactions.checkInHistory);
  const checkOutData = useAppSelector(state => state.inventoryTransactions.checkOutHistory);
  const allData = useAppSelector(state => state.inventoryTransactions.transactions);
  const loading = useAppSelector(state => state.inventoryTransactions.transactionLoading);
  const error = useAppSelector(state => state.inventoryTransactions.transactionError);

  // 🧠 Determine effective department for query
  const effectiveDepartmentId = isGlobalUser
    ? selectedDepartmentId
    : userDepartmentId;

  // 🔁 Fetch Data on department selection
  useEffect(() => {
    if (context === 'department' && effectiveDepartmentId === null) {
      // Do not fetch if no department selected in department context
      return;
    }

    // 🧩 In 'main' context, null means all departments — valid
    const params = effectiveDepartmentId !== null ? { departmentId: effectiveDepartmentId } : {};

    dispatch(fetchCheckInHistory(params));
    dispatch(fetchCheckOutHistory(params));
    dispatch(fetchAllHistory(params));
  }, [dispatch, effectiveDepartmentId, context]);

  // 🧨 Handle errors
  useEffect(() => {
    if (error) message.error(error);
  }, [error]);

  const columns = [
    { title: '物品名称', dataIndex: 'itemname', key: 'itemname' },
    { title: '类别', dataIndex: 'category', key: 'category' },
    { title: '数量', dataIndex: 'quantity', key: 'quantity' },
    { title: '交易类型', dataIndex: 'transactiontype', key: 'transactiontype' },
    { title: '操作人', dataIndex: 'performedby', key: 'performedby' },
    {
      title: '时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString(),
    },
  ];

  // ⚠️ Conditional: Only show warning in department context if no dept selected
  const shouldShowWarning = context === 'department' && effectiveDepartmentId === null;

  if (shouldShowWarning) {
    return <p>⚠️ 请先选择一个部门以查看交易历史。</p>;
  }

  return (
    <Tabs defaultActiveKey="checkin">
      <TabPane tab="📥 入库历史" key="checkin">
        <Spin spinning={loading} tip="加载入库历史...">
          <Table columns={columns} dataSource={checkInData} rowKey="id" pagination={{ pageSize: 10 }} />
        </Spin>
      </TabPane>

      <TabPane tab="✅ 核销历史" key="checkout">
        <Spin spinning={loading} tip="加载核销历史...">
          <Table columns={columns} dataSource={checkOutData} rowKey="id" pagination={{ pageSize: 10 }} />
        </Spin>
      </TabPane>

      <TabPane tab="📊 全部交易" key="all">
        <Spin spinning={loading} tip="加载全部交易...">
          <Table columns={columns} dataSource={allData} rowKey="id" pagination={{ pageSize: 10 }} />
        </Spin>
      </TabPane>
    </Tabs>
  );
};

export default InventoryHistory;