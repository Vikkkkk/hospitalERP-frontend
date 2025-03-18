import React, { useEffect, useState } from 'react';
import { Button, Table, Tabs, Spin, message, Select } from 'antd';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

import { fetchMainInventory } from '../redux/actions/mainInventoryActions';
import { fetchDepartmentInventoryById } from '../redux/actions/departmentInventoryActions';
import { fetchPendingRequests, approveInventoryRequest } from '../redux/actions/inventoryRequestActions';
import { fetchPurchaseRequests, submitPurchaseRequest, deletePurchaseRequest } from '../redux/actions/purchaseRequestActions';
import { fetchDepartments } from '../redux/actions/departmentActions';

import { selectUser } from '../redux/selectors/authSelectors';
import { selectMainInventoryItems, selectMainInventoryLoading } from '../redux/selectors/mainInventorySelectors';
import { selectDepartmentInventoryItems, selectDepartmentInventoryLoading } from '../redux/selectors/departmentInventorySelectors';
import { selectPendingRequests, selectRequestLoading } from '../redux/selectors/inventoryRequestSelectors';
import { selectPurchaseRequests, selectPurchaseLoading } from '../redux/selectors/purchaseRequestSelectors';
import { selectDepartments } from '../redux/selectors/departmentSelectors';

import InventoryTable from '../components/InventoryTable';
import InventoryHistory from '../components/InventoryHistory';
import AddMainInventoryModal from '../components/AddMainInventoryModal';

const { TabPane } = Tabs;

const MainInventoryPage: React.FC = () => {
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectUser);
  const mainInventory = useAppSelector(selectMainInventoryItems);
  const departmentInventory = useAppSelector(selectDepartmentInventoryItems);
  const departments = useAppSelector(selectDepartments);

  const loading = useAppSelector(selectMainInventoryLoading);
  const deptLoading = useAppSelector(selectDepartmentInventoryLoading);
  const pendingRequests = useAppSelector(selectPendingRequests);
  const requestLoading = useAppSelector(selectRequestLoading);
  const purchaseRequests = useAppSelector(selectPurchaseRequests);
  const purchaseLoading = useAppSelector(selectPurchaseLoading);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);
  const [selectedHistoryDepartmentId, setSelectedHistoryDepartmentId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchMainInventory());
    dispatch(fetchDepartments());
    dispatch(fetchPendingRequests());
    dispatch(fetchPurchaseRequests());
  }, [dispatch]);

  const handleDepartmentChange = (deptId: number) => {
    setSelectedDepartment(deptId);
    dispatch(fetchDepartmentInventoryById(deptId));
  };

  const handleApproveRequest = async (requestId: number) => {
    try {
      await dispatch(approveInventoryRequest(requestId)).unwrap();
      message.success('✅ 已批准库存请求');
      dispatch(fetchMainInventory());
      dispatch(fetchPendingRequests());
      if (selectedDepartment !== null) {
        dispatch(fetchDepartmentInventoryById(selectedDepartment));
      }
    } catch (error) {
      message.error('❌ 批准失败');
    }
  };

  const handleSubmitPurchase = async (id: number) => {
    await dispatch(submitPurchaseRequest(id));
    message.success('✅ 已提交采购请求');
    dispatch(fetchPurchaseRequests());
  };

  const handleDeletePurchase = async (id: number) => {
    await dispatch(deletePurchaseRequest(id));
    message.success('❌ 已删除采购请求');
    dispatch(fetchPurchaseRequests());
  };

  const purchaseColumns = [
    { title: '物品名称', dataIndex: 'itemname', key: 'itemname' },
    { title: '数量', dataIndex: 'quantity', key: 'quantity' },
    { title: '截止日期', dataIndex: 'deadlineDate', key: 'deadlineDate' },
    {
      title: '操作',
      key: 'actions',
      render: (_: any, record: any) => (
        <>
          <Button onClick={() => handleSubmitPurchase(record.id)} type="link">✅ 提交</Button>
          <Button onClick={() => handleDeletePurchase(record.id)} type="link">❌ 删除</Button>
        </>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🏭 主库存管理 (一级库)</h1>

      <Button type="primary" onClick={() => setShowAddModal(true)} className="mb-4">
        ➕ 添加库存物品
      </Button>

      <Tabs defaultActiveKey="main"
        items={[
          {
            label: '📦 一级库存',
            key: 'main',
            children: loading ? (
              <Spin spinning={true} tip="加载中...">
                <div style={{ height: '100px' }} />
              </Spin>
            ) : (
              <InventoryTable data={mainInventory} type="main" />
            ),
          },
          {
            label: '🏢 部门库存 (二级库)',
            key: 'department',
            children: (
              <>
                <div className="mb-4 flex gap-4 items-center">
                  <span>选择部门：</span>
                  <Select
                    placeholder="请选择部门"
                    style={{ width: 200 }}
                    value={selectedDepartment}
                    onChange={handleDepartmentChange}
                    loading={loading}
                  >
                    {departments.map(dept => (
                      <Select.Option key={dept.id} value={dept.id}>
                        {dept.name}
                      </Select.Option>
                    ))}
                  </Select>
                </div>

                {deptLoading ? (
                  <Spin spinning={true} tip="加载中...">
                    <div style={{ height: '100px' }} />
                  </Spin>
                ) : (
                  <InventoryTable data={departmentInventory} type="department" />
                )}
              </>
            ),
          },
          {
            label: '📥 待处理库存请求 (IR)',
            key: 'requests',
            children: requestLoading ? (
              <Spin spinning={true} tip="加载中...">
                <div style={{ height: '100px' }} />
              </Spin>
            ) : (
              <Table
                columns={[
                  { title: '请求人', dataIndex: 'requestedBy', key: 'requestedBy' },
                  { title: '物品', dataIndex: 'itemname', key: 'itemname' },
                  { title: '数量', dataIndex: 'quantity', key: 'quantity' },
                  {
                    title: '操作',
                    key: 'actions',
                    render: (_: any, record: any) => (
                      <Button onClick={() => handleApproveRequest(record.id)} type="link">
                        ✅ 批准
                      </Button>
                    ),
                  },
                ]}
                dataSource={pendingRequests}
                rowKey="id"
                pagination={{ pageSize: 8 }}
              />
            ),
          },
          {
            label: '🛒 采购请求 (PR)',
            key: 'purchase',
            children: purchaseLoading ? (
              <Spin tip="加载中..." />
            ) : (
              <Table
                columns={purchaseColumns}
                dataSource={purchaseRequests}
                rowKey="id"
                pagination={{ pageSize: 8 }}
              />
            ),
          },
          {
            label: '📊 交易历史',
            key: 'history',
            children: (
              <>
                <div className="mb-4 flex gap-4 items-center">
                  <span>选择部门：</span>
                  <Select
                    placeholder="请选择部门"
                    style={{ width: 240 }}
                    value={selectedHistoryDepartmentId}
                    onChange={(value) => setSelectedHistoryDepartmentId(value)}
                  >
                    <Select.Option value={null}>全部部门</Select.Option>
                    {departments.map((dept) => (
                      <Select.Option key={dept.id} value={dept.id}>
                        {dept.name}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
          
                <InventoryHistory
                  context="main"
                  isGlobalUser={user?.isglobalrole ?? false}
                  userDepartmentId={user?.departmentId ?? null}
                  selectedDepartmentId={selectedHistoryDepartmentId}
                />
              </>
            ),
          }
        ]}
      />

      {showAddModal && (
        <AddMainInventoryModal visible={showAddModal} onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
};

export default MainInventoryPage;