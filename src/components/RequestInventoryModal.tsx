import React, { useState, useEffect } from 'react';
import { Modal, Input, List, InputNumber, DatePicker, message } from 'antd';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { searchMainInventory, requestInventory, createPurchaseRequest } from '../redux/actions/mainInventoryActions';
import { selectMainInventorySearchResults } from '../redux/selectors/mainInventorySelectors';
import dayjs from 'dayjs';

interface Props {
  visible: boolean;
  onClose: () => void;
  departmentId: number;
}

const RequestInventoryModal: React.FC<Props> = ({ visible, onClose, departmentId }) => {
  const dispatch = useAppDispatch();
  const searchResults = useAppSelector(selectMainInventorySearchResults);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [deadline, setDeadline] = useState<string>(dayjs().add(3, 'day').format('YYYY-MM-DD'));

  // 🔍 Live search when input changes
  useEffect(() => {
    if (searchTerm.trim()) {
      dispatch(searchMainInventory({ searchQuery: searchTerm }));
    }
  }, [searchTerm, dispatch]);

  // 🧹 Reset modal form
  const resetForm = () => {
    setSearchTerm('');
    setSelectedItem('');
    setQuantity(1);
    setDeadline(dayjs().add(3, 'day').format('YYYY-MM-DD'));
  };

  const handleSubmit = async () => {
    if (!selectedItem || quantity <= 0 || !deadline) {
      message.warning('请填写完整信息');
      return;
    }

    const isItemInMain = searchResults.includes(selectedItem);

    try {
      if (isItemInMain) {
        await dispatch(requestInventory({ itemName: selectedItem, quantity })).unwrap();
        message.success('✅ 已申请调拨物资');
      } else {
        await dispatch(createPurchaseRequest({ itemname: selectedItem, quantity, deadlineDate: deadline, departmentId })).unwrap();
        message.success('✅ 已提交采购申请');
      }
      resetForm();
      onClose();
    } catch (error: any) {
      message.error(error || '❌ 提交失败，请重试');
    }
  };

  return (
    <Modal
      title="申请物资"
      open={visible} // 🛠️ Changed from `visible` to `open`
      onCancel={() => {
        resetForm();
        onClose();
      }}
      onOk={handleSubmit}
      okText="提交申请"
    >
      <Input
        placeholder="搜索主库存物品名称"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: 12 }}
      />

      <List
        bordered
        dataSource={searchResults}
        renderItem={(item) => (
          <List.Item
            onClick={() => setSelectedItem(item)}
            style={{
              cursor: 'pointer',
              backgroundColor: selectedItem === item ? '#e6f7ff' : '',
            }}
          >
            {item}
          </List.Item>
        )}
        style={{ marginBottom: 12, maxHeight: 150, overflowY: 'auto' }}
      />

      <InputNumber
        min={1}
        value={quantity}
        onChange={(val) => setQuantity(val || 1)}
        placeholder="数量"
        style={{ width: '100%', marginBottom: 12 }}
      />

      <DatePicker
        value={dayjs(deadline)}
        onChange={(date) => setDeadline(date?.format('YYYY-MM-DD') || '')}
        style={{ width: '100%' }}
      />
    </Modal>
  );
};

export default RequestInventoryModal;