import React, { useState } from 'react';
import { Modal, List, InputNumber, message, Button } from 'antd';
import { useAppDispatch } from '../redux/hooks';
import { checkoutInventory } from '../redux/actions/departmentInventoryActions';
import { DepartmentInventoryItem } from '../redux/types/inventoryTypes';

interface CheckoutUsageModalProps {
  visible: boolean;
  onClose: () => void;
  items: DepartmentInventoryItem[];
}

const CheckoutUsageModal: React.FC<CheckoutUsageModalProps> = ({ visible, onClose, items }) => {
  const dispatch = useAppDispatch();
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(false);

  const handleQuantityChange = (id: number, value: number | null) => {
    setQuantities(prev => ({ ...prev, [id]: value || 0 }));
  };

  const handleSubmit = async () => {
    const entries = Object.entries(quantities).filter(([_, qty]) => qty > 0);
    if (entries.length === 0) {
      message.warning('请填写至少一个物品的核销数量');
      return;
    }

    setLoading(true);
    try {
      for (const [idStr, qty] of entries) {
        const itemId = parseInt(idStr, 10);
        await dispatch(checkoutInventory({ itemId, quantity: qty })).unwrap();
      }
      message.success('核销成功');
      setQuantities({});
      onClose();
    } catch (err: any) {
      message.error(err || '核销失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="核销物资"
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="确认核销"
      confirmLoading={loading}
    >
      <List
        bordered
        dataSource={items}
        renderItem={(item) => (
          <List.Item>
            <div style={{ flex: 1 }}>{item.itemname}</div>
            <InputNumber
              min={1}
              placeholder="核销数量"
              value={quantities[item.id] || 0}
              onChange={(val) => handleQuantityChange(item.id, val)}
            />
          </List.Item>
        )}
        style={{ maxHeight: 300, overflowY: 'auto' }}
      />
    </Modal>
  );
};

export default CheckoutUsageModal;