import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  fetchInventoryRequests,
  updateInventoryRequest,
  deleteInventoryRequest,
  generateCheckoutQRCode,
  completeCheckoutRequest,
} from '../redux/actions/inventoryRequestActions';
import { useAppDispatch } from '../redux/hooks';
import { RootState } from '../redux/store';
import { InventoryRequest } from '../redux/types/InventoryRequestTypes';
import {
  Button,
  Table,
  Select,
  message,
  DatePicker,
  Input,
  Modal,
  QRCode,
} from 'antd';
import { debounce } from 'lodash';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

const InventoryRequestPage: React.FC = () => {
  const dispatch = useAppDispatch();

  // Redux State
  const requests = useSelector((state: RootState) => state.inventoryRequests.requests);
  const loading = useSelector((state: RootState) => state.inventoryRequests.loading);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);

  // QR Code Checkout
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const [checkoutUser, setCheckoutUser] = useState<string>('');

  // 🚀 Fetch Requests with Filters
  useEffect(() => {
    dispatch(
      fetchInventoryRequests({
        search: searchTerm || undefined,
        department: departmentFilter || undefined,
        status: statusFilter || undefined,
        dateRange: dateRange.map(date => (date ? date.format('YYYY-MM-DD') : null)),
      })
    );
  }, [dispatch, searchTerm, departmentFilter, statusFilter, dateRange]);

  // 🔎 Debounce Search Input
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
    }, 300),
    []
  );

  // ✅ Update Request Status
  const handleUpdateRequest = async (
    id: number,
    status: 'Approved' | 'Rejected' | 'Restocking' | 'Procurement',
    notes?: string
  ) => {
    try {
      await dispatch(updateInventoryRequest({ id, status, notes })).unwrap();
      message.success(`Request updated to ${status}`);
    } catch (error: any) {
      message.error(error.message || 'Failed to update request');
    }
  };

  // 📲 Generate QR Code
  const handleGenerateQRCode = async (id: number) => {
    try {
      const result = await dispatch(generateCheckoutQRCode(id)).unwrap();
      setQrCodeData(result.qrCode);
      setCheckoutModalVisible(true);
      setSelectedRequestId(id);
    } catch (error: any) {
      message.error(error.message || 'Failed to generate QR Code');
    }
  };

  // ✅ Complete Checkout (QR or Manual)
  const handleCompleteCheckout = async () => {
    if (!selectedRequestId) return;
    try {
      await dispatch(
        completeCheckoutRequest({
          id: selectedRequestId,
          checkoutUser: checkoutUser || undefined,
        })
      ).unwrap();

      message.success('✅ Checkout successful');
      setCheckoutModalVisible(false);
      setQrCodeData(null);
      setCheckoutUser('');
    } catch (error: any) {
      message.error(error.message || 'Checkout failed');
    }
  };

  // ❌ Delete Request
  const handleDeleteRequest = async (id: number) => {
    try {
      await dispatch(deleteInventoryRequest(id)).unwrap();
      message.success('Request deleted successfully');
    } catch (error: any) {
      message.error(error.message || 'Failed to delete request');
    }
  };

  // 📊 Table Columns
  const columns = [
    { title: 'Item', dataIndex: 'itemname', key: 'itemname' },
    { title: 'Qty', dataIndex: 'quantity', key: 'quantity' },
    { title: 'Department', dataIndex: 'departmentId', key: 'departmentId' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: InventoryRequest) => (
        <>
          <Select
            defaultValue={record.status}
            style={{ width: 150, marginRight: 8 }}
            onChange={(value) => {
              if (value !== 'Pending') {
                handleUpdateRequest(record.id, value as any); // Cast to bypass TS enum
              }
            }}
          >
            <Option value="Approved">Approve</Option>
            <Option value="Rejected">Reject</Option>
            <Option value="Restocking">Restocking</Option>
            <Option value="Procurement">Procurement</Option>
          </Select>

          {record.status === 'Approved' && (
            <>
              <Button onClick={() => handleGenerateQRCode(record.id)} style={{ marginRight: 8 }}>
                QR Checkout
              </Button>
              <Button type="primary" onClick={() => handleCompleteCheckout()}>
                Manual Checkout
              </Button>
            </>
          )}

          <Button danger onClick={() => handleDeleteRequest(record.id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2>📦 Inventory Requests (Management)</h2>

      {/* 🔍 Filters */}
      <Input
        placeholder="Search item..."
        style={{ width: 250, marginBottom: 16, marginRight: 12 }}
        onChange={(e) => debouncedSearch(e.target.value)}
      />

      <Select
        placeholder="Department"
        style={{ width: 180, marginRight: 12 }}
        allowClear
        onChange={(value) => setDepartmentFilter(value)}
      >
        <Option value="logistics">Logistics</Option>
        <Option value="IT">IT</Option>
      </Select>

      <Select
        placeholder="Status"
        style={{ width: 180, marginRight: 12 }}
        allowClear
        onChange={(value) => setStatusFilter(value)}
      >
        <Option value="Pending">Pending</Option>
        <Option value="Approved">Approved</Option>
        <Option value="Rejected">Rejected</Option>
        <Option value="Restocking">Restocking</Option>
        <Option value="Procurement">Procurement</Option>
      </Select>

      <RangePicker
        onChange={(dates) => setDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null])}
      />

      {/* 📊 Table */}
      <Table
        columns={columns}
        dataSource={requests}
        rowKey="id"
        loading={loading}
        style={{ marginTop: 20 }}
      />

      {/* 🧩 QR Modal */}
      <Modal
        title="Checkout Inventory"
        open={checkoutModalVisible}
        onCancel={() => setCheckoutModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setCheckoutModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="confirm" type="primary" onClick={handleCompleteCheckout}>
            Confirm Checkout
          </Button>,
        ]}
      >
        {qrCodeData ? <QRCode value={qrCodeData} /> : <p>Loading QR Code...</p>}
        <Input
          placeholder="Enter username manually"
          value={checkoutUser}
          onChange={(e) => setCheckoutUser(e.target.value)}
          style={{ marginTop: 12 }}
        />
      </Modal>
    </div>
  );
};

export default InventoryRequestPage;