import React, { useState, useEffect } from 'react';
import { Modal, Button, Select, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { assignDepartmentHead } from '../redux/actions/departmentActions';
import { fetchUsers } from '../redux/actions/fetchUserActions';
import { RootState, AppDispatch } from '../redux/store';

interface AssignDepartmentHeadModalProps {
  departmentId: number;
}

const AssignDepartmentHeadModal: React.FC<AssignDepartmentHeadModalProps> = ({ departmentId }) => {
  const [visible, setVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  // ✅ Corrected Redux state reference
  const { users, loading } = useSelector((state: RootState) => state.fetchUser);

  // ✅ Ensure `users` is not undefined
  const departmentUsers = users?.filter(
    (user) => user.departmentId !== null && user.departmentId === departmentId
  ) || [];

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleAssign = () => {
    if (!selectedUserId) {
      message.error('请选择一个用户作为部门负责人');
      return;
    }

    dispatch(assignDepartmentHead({ departmentId, headId: selectedUserId }));
    setVisible(false);
  };

  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        指定部门负责人
      </Button>
      <Modal 
        title="指定部门负责人" 
        open={visible} 
        onOk={handleAssign} 
        onCancel={() => setVisible(false)}
        confirmLoading={loading}
      >
        <Select 
          placeholder="选择负责人"
          style={{ width: '100%' }}
          onChange={setSelectedUserId}
          value={selectedUserId || undefined}
        >
          {departmentUsers.map((user) => (
            <Select.Option key={user.id} value={user.id}>
              {user.username}
            </Select.Option>
          ))}
        </Select>
      </Modal>
    </>
  );
};

export default AssignDepartmentHeadModal;