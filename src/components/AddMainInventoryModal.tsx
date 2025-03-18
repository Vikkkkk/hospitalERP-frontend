import React, { useState } from 'react';
import { Modal, Input, InputNumber, message, DatePicker, Button, Switch } from 'antd';
import { useAppDispatch } from '../redux/hooks';
import { addInventoryItem } from '../redux/actions/mainInventoryActions';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const AddInventoryModal: React.FC<Props> = ({ visible, onClose }) => {
  const dispatch = useAppDispatch();
  const [itemname, setItemname] = useState('');
  const [category, setCategory] = useState('');
  const [unit, setUnit] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [minimumStockLevel, setMinimumStockLevel] = useState<number>(0);
  const [restockThreshold, setRestockThreshold] = useState<number>(0);
  const [supplier, setSupplier] = useState('');
  const [noExpiry, setNoExpiry] = useState(true); // 🆕 Toggle for expiry
  const [batches, setBatches] = useState([{ quantity: 1, expiryDate: null as string | null }]);

  const handleSubmit = async () => {
    if (!itemname || !category || !unit) {
      message.warning('⚠️ 请填写所有字段');
      return;
    }

    const payload: any = {
      itemname,
      category,
      unit,
      minimumStockLevel,
      restockThreshold,
      supplier: supplier || null,
      departmentId: null, // 一级库
    };

    if (noExpiry) {
      payload.totalQuantity = quantity;
    } else {
      if (batches.length === 0 || batches.some((b) => !b.quantity)) {
        message.warning('⚠️ 请填写有效的批次信息');
        return;
      }
      payload.batches = batches;
    }

    try {
      await dispatch(addInventoryItem(payload)).unwrap();
      message.success('✅ 已添加物品');
      resetForm();
      onClose();
    } catch (err: any) {
      message.error(err.message || '❌ 添加失败');
    }
  };

  const resetForm = () => {
    setItemname('');
    setCategory('');
    setUnit('');
    setQuantity(1);
    setMinimumStockLevel(0);
    setRestockThreshold(0);
    setSupplier('');
    setNoExpiry(true);
    setBatches([{ quantity: 1, expiryDate: null }]);
  };

  const addBatchRow = () => {
    setBatches([...batches, { quantity: 1, expiryDate: null }]);
  };

  const removeBatchRow = (index: number) => {
    const newBatches = [...batches];
    newBatches.splice(index, 1);
    setBatches(newBatches);
  };

  return (
    <Modal
      title="➕ 添加库存物品"
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="添加"
    >
      <Input
        placeholder="物品名称"
        value={itemname}
        onChange={(e) => setItemname(e.target.value)}
        style={{ marginBottom: 10 }}
      />
      <Input
        placeholder="类别"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{ marginBottom: 10 }}
      />
      <Input
        placeholder="单位"
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
        style={{ marginBottom: 10 }}
      />
      <InputNumber
        placeholder="最低库存"
        value={minimumStockLevel === 0 ? undefined : minimumStockLevel}
        min={0}
        onChange={(val) => setMinimumStockLevel(val || 0)}
        style={{ width: '100%', marginBottom: 10 }}
      />
      <InputNumber
        placeholder="补货阈值"
        value={restockThreshold === 0 ? undefined : restockThreshold}
        min={0}
        onChange={(val) => setRestockThreshold(val || 0)}
        style={{ width: '100%', marginBottom: 10 }}
      />
      <Input
        placeholder="供应商 (可选)"
        value={supplier}
        onChange={(e) => setSupplier(e.target.value)}
        style={{ marginBottom: 10 }}
      />

      <div style={{ marginBottom: 10 }}>
        <span style={{ marginRight: 8 }}>此物品不过期:</span>
        <Switch checked={noExpiry} onChange={setNoExpiry} />
      </div>

      {noExpiry ? (
        <InputNumber
          placeholder="数量"
          value={quantity === 0 ? undefined : quantity}
          min={1}
          onChange={(val) => setQuantity(val || 1)}
          style={{ width: '100%' }}
        />
      ) : (
        <div style={{ marginBottom: 10 }}>
          {batches.map((batch, idx) => (
            <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
              <InputNumber
                min={1}
                value={batch.quantity === 1 ? undefined : batch.quantity}
                onChange={(val) => {
                  const newBatches = [...batches];
                  newBatches[idx].quantity = val || 1;
                  setBatches(newBatches);
                }}
                placeholder="数量"
              />
              <DatePicker
                placeholder="到期日期"
                onChange={(date, dateString) => {
                  const expiry =
                    typeof dateString === 'string' ? dateString : dateString[0] || null;
                  const newBatches = [...batches];
                  newBatches[idx].expiryDate = expiry;
                  setBatches(newBatches);
                }}
              />
              <Button danger onClick={() => removeBatchRow(idx)}>
                删除
              </Button>
            </div>
          ))}
          <Button onClick={addBatchRow}>➕ 添加批次</Button>
        </div>
      )}
    </Modal>
  );
};

export default AddInventoryModal;