import React from 'react';
import { Table, Tooltip, Button } from 'antd';
import { MainInventoryItem, DepartmentInventoryItem, InventoryBatch } from '../redux/types/inventoryTypes';

interface BaseItem {
  id: number;
  itemname: string;
  category: string;
  unit: string;
  supplier?: string;
  lastRestocked?: string;
  batches?: InventoryBatch[];
}

// 🔐 Type Guard for InventoryItem
function isInventoryItem(item: BaseItem): item is MainInventoryItem {
  return (
    'restockThreshold' in item &&
    'minimumStockLevel' in item &&
    typeof (item as MainInventoryItem).restockThreshold === 'number'
  );
}

interface Props<T extends BaseItem> {
  data: T[];
  type: 'main' | 'department';
  actions?: (record: T) => React.ReactNode;
  onSelectItems?: (selectedIds: number[]) => void;
  loading?: boolean;
  onRestockClick?: (record: T) => void; // 🆕 Hook for restock button
}

const InventoryTable = <T extends BaseItem>({
  data,
  type,
  actions,
  onSelectItems,
  loading = false,
  onRestockClick, // 🆕 Accept restock click handler
}: Props<T>) => {
  const columns = [
    {
      title: '物品名称',
      dataIndex: 'itemname',
      key: 'itemname',
    },
    {
      title: '类别',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: '当前库存',
      key: 'totalQuantity',
      render: (_: any, record: T) => {
        const totalQuantity = record.batches?.reduce((sum, batch) => sum + batch.quantity, 0) || 0;
        const isLow = type === 'main' && isInventoryItem(record) && totalQuantity < record.restockThreshold;

        return (
          <Tooltip title={isLow ? '库存低于补货阈值' : ''}>
            <span style={{ color: isLow ? 'red' : 'inherit', fontWeight: isLow ? 'bold' : 'normal' }}>
              {totalQuantity}
              {isLow && ' ⚠️'}
            </span>
          </Tooltip>
        );
      },
    },
    ...(type === 'main'
      ? [
          {
            title: '最低库存',
            dataIndex: 'minimumStockLevel',
            key: 'minimumStockLevel',
          },
          {
            title: '补货阈值',
            dataIndex: 'restockThreshold',
            key: 'restockThreshold',
          },
        ]
      : []),
    {
      title: '供应商',
      dataIndex: 'supplier',
      key: 'supplier',
      render: (text: string | undefined) => text || '—',
    },
    {
      title: '上次补货',
      dataIndex: 'lastRestocked',
      key: 'lastRestocked',
      render: (date: string | undefined) => (date ? new Date(date).toLocaleDateString() : '—'),
    },
    {
      title: '操作',
      key: 'actions',
      render: (_: any, record: T) =>
        actions ? (
          actions(record)
        ) : type === 'main' && onRestockClick ? (
          <Button type="link" onClick={() => onRestockClick(record)}>♻️ 补货</Button>
        ) : null,
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      pagination={{ pageSize: 10 }}
      loading={loading}
      rowSelection={
        onSelectItems
          ? {
              onChange: (selectedKeys) => onSelectItems(selectedKeys as number[]),
            }
          : undefined
      }
      expandable={{
        expandedRowRender: (record: T) =>
          record.batches && record.batches.length > 0 ? (
            <Table
              columns={[
                { title: '数量', dataIndex: 'quantity', key: 'quantity' },
                {
                  title: '到期日期',
                  dataIndex: 'expiryDate',
                  key: 'expiryDate',
                  render: (date: string | undefined) =>
                    date ? new Date(date).toLocaleDateString() : '—',
                },
                {
                  title: '供应商',
                  dataIndex: 'supplier',
                  key: 'supplier',
                  render: (text: string | undefined) => text || '—',
                },
              ]}
              dataSource={record.batches.map((batch, idx) => ({ ...batch, key: idx }))}
              pagination={false}
              size="small"
            />
          ) : (
            <p>📭 无批次信息</p>
          ),
        rowExpandable: (record) => !!record.batches && record.batches.length > 0,
      }}
    />
  );
};

export default InventoryTable;