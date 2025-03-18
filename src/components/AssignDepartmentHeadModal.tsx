import React, { useState, useEffect } from 'react';
import { Modal, Button, Select, message } from 'antd';
import { useAppDispatch, useAppSelector } from '../redux/hooks'; 
import { assignDepartmentHead } from '../redux/actions/departmentActions';
import { fetchUsers } from '../redux/actions/userActions';
import { selectUsers, selectUsersLoading } from '../redux/selectors/userSelectors'; // ✅ Import your new selectors

interface AssignDepartmentHeadModalProps {
  departmentId: number;
}

const AssignDepartmentHeadModal: React.FC<AssignDepartmentHeadModalProps> = ({ departmentId }) => {
  const [visible, setVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const dispatch = useAppDispatch();

  // ✅ Fetch from selectors
  const users = useAppSelector(selectUsers);
  const loading = useAppSelector(selectUsersLoading);

  // ✅ Filter for this department's users
  const departmentUsers = users.filter(
    (user) => user.departmentId !== null && user.departmentId === departmentId
  );

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