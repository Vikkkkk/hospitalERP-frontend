import React, { useState } from 'react';
import { Modal, Button, Input } from 'antd';
import { useAppDispatch } from '../redux/hooks';  // ✅ Exact file path
import { createDepartment } from '../redux/actions/departmentActions';

const CreateDepartmentModal: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState('');
  const dispatch = useAppDispatch();

  const handleCreate = () => {
    if (name) {
      dispatch(createDepartment({ name }));
      setVisible(false);
      setName('');
    }
  };

  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        Create Department
      </Button>
      <Modal title="Create Department" visible={visible} onOk={handleCreate} onCancel={() => setVisible(false)}>
        <Input value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} placeholder="Enter Department Name" />
      </Modal>
    </>
  );
};

export default CreateDepartmentModal;