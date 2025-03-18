import React, { useState } from 'react';
import { Modal, InputNumber, List, DatePicker, message } from 'antd';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { requestInventory, restockInventory } from '../redux/actions/mainInventoryActions';
import { selectDepartmentInventoryItems } from '../redux/selectors/departmentInventorySelectors';
import { selectMainInventoryItems } from '../redux/selectors/mainInventorySelectors';
import { selectCurrentUser } from '../redux/selectors/authSelectors';
import { MainInventoryItem, DepartmentInventoryItem } from '../redux/types/inventoryTypes';

interface Props {
  visible: boolean;
  onClose: () => void;
  selectedItems: number[];
  type: 'main' | 'department';
}

const RestockModal: React.FC<Props> = ({ visible, onClose, selectedItems, type }) => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const departmentInventory = useAppSelector(selectDepartmentInventoryItems);
  const mainInventory = useAppSelector(selectMainInventoryItems);

  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [expiryDates, setExpiryDates] = useState<Record<number, string>>({});

  // 🔍 Select correct inventory dataset
  const inventoryData: (MainInventoryItem | DepartmentInventoryItem)[] =
    type === 'main' ? mainInventory : departmentInventory;

  const itemsToRestock = inventoryData.filter(item => selectedItems.includes(item.id));

  const handleQuantityChange = (id: number, value: number | null) => {
    setQuantities((prev) => ({ ...prev, [id]: value || 0 }));
  };

  const handleExpiryChange = (id: number, dateString: string | string[]) => {
    if (typeof dateString === 'string') {
      setExpiryDates((prev) => ({ ...prev, [id]: dateString }));
    }
  };

  const handleSubmit = async () => {
    const entries = Object.entries(quantities).filter(([_, qty]) => qty > 0);

    if (entries.length === 0) {
      message.warning('⚠️ 请填写至少一个物品的补货数量');
      return;
    }

    try {
      for (const [idStr, qty] of entries) {
        const itemId = parseInt(idStr, 10);
        const item = itemsToRestock.find(i => i.id === itemId);
        if (!item) continue;

        if (type === 'department') {
          if (!currentUser?.departmentId) {
            message.error('❌ 无法获取部门信息');
            continue;
          }
          await dispatch(requestInventory({
            itemName: item.itemname,
            quantity: qty,
          })).unwrap();
        } else {
          await dispatch(restockInventory({
            id: item.id,
            batches: [{
              quantity: qty,
              expiryDate: expiryDates[item.id] || undefined,
              supplier: item.supplier || undefined,
            }],
          })).unwrap();
        }
      }

      message.success('✅ 补货申请已提交');
      setQuantities({});
      setExpiryDates({});
      onClose();
    } catch (err) {
      message.error('❌ 补货失败');
    }
  };

  return (
    <Modal
      title="📥 提交补货申请"
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="提交"
      okButtonProps={{ disabled: itemsToRestock.length === 0 }}
    >
      <List
        bordered
        dataSource={itemsToRestock}
        renderItem={(item) => (
          <List.Item style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>{item.itemname}</div>
            <InputNumber
              min={1}
              placeholder="补货数量"
              value={quantities[item.id] || 0}
              onChange={(value) => handleQuantityChange(item.id, value)}
              style={{ width: '100%', marginTop: 8 }}
            />
            {type === 'main' && (
              <DatePicker
                placeholder="到期日期 (可选)"
                onChange={(date, dateString) => handleExpiryChange(item.id, dateString)}
                style={{ width: '100%', marginTop: 8 }}
              />
            )}
          </List.Item>
        )}
        style={{ maxHeight: 300, overflowY: 'auto' }}
      />
    </Modal>
  );
};

export default RestockModal;