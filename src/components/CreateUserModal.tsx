import React, { useState } from 'react';
import { Modal, Button, Input, Select, Form, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { createUser } from '../redux/actions/userActions';
import { fetchDepartments } from '../redux/actions/departmentActions';
import { selectDepartments } from '../redux/selectors/departmentSelectors';

interface CreateUserModalProps {
  visible: boolean;
  onClose: () => void;
}

const { Option } = Select;

const CreateUserModal: React.FC<CreateUserModalProps> = ({ visible, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const departments = useSelector(selectDepartments);
  
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // ✅ Fetch departments when the modal opens
  React.useEffect(() => {
    if (visible) {
      dispatch(fetchDepartments());
    }
  }, [visible, dispatch]);

  // ✅ Handle Form Submission
  const handleCreateUser = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await dispatch(createUser(values)).unwrap();
      message.success('用户创建成功');
      form.resetFields();
      onClose();
    } catch (error:any) {
      message.error(error || '创建用户失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="创建用户"
      open={visible}
      onCancel={onClose}
      onOk={handleCreateUser}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
          <Input placeholder="输入用户名" />
        </Form.Item>

        <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
          <Input.Password placeholder="输入密码" />
        </Form.Item>

        <Form.Item name="role" label="角色" rules={[{ required: true, message: '请选择角色' }]}>
          <Select placeholder="选择角色">
            <Option value="RootAdmin">RootAdmin</Option>
            <Option value="Admin">Admin</Option>
            <Option value="DepartmentHead">DepartmentHead</Option>
            <Option value="Staff">Staff</Option>
          </Select>
        </Form.Item>

        <Form.Item name="departmentId" label="所属部门">
          <Select placeholder="选择部门">
            {departments.map((dept) => (
              <Option key={dept.id} value={dept.id}>
                {dept.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateUserModal;