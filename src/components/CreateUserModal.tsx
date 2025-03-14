import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, Form, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { createUser, fetchUsers } from '../redux/actions/userActions'; // ✅ Fetch users after creation
import { fetchDepartments } from '../redux/actions/departmentActions';
import { selectDepartments } from '../redux/selectors/departmentSelectors';
import { MODULES } from '../constants'; // ✅ Import centralized module list

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
  const [selectedRole, setSelectedRole] = useState<string | null>(null); // ✅ Role tracking

  // ✅ Fetch departments when modal opens
  useEffect(() => {
    if (visible) {
      dispatch(fetchDepartments());
    }
  }, [visible, dispatch]);

  // ✅ Handle Form Submission
  const handleCreateUser = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      const newUser = {
        username: values.username,
        password: values.password, // ✅ Only included for creation
        role: values.role,
        departmentId: values.departmentId ?? null,
        canAccess: values.canAccess ?? [], // ✅ Ensure module permissions are included
      };
  
      await dispatch(createUser(newUser)).unwrap();
      message.success('用户创建成功');
      dispatch(fetchUsers()); // ✅ Refresh the user list
      form.resetFields();
      onClose();
    } catch (error: any) {
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
          <Select
            placeholder="选择角色"
            onChange={(value) => setSelectedRole(value)} // ✅ Track selected role
          >
            <Option value="RootAdmin">RootAdmin</Option>
            <Option value="Admin">Admin</Option>
            <Option value="DepartmentHead">DepartmentHead</Option>
            <Option value="Staff">Staff</Option>
          </Select>
        </Form.Item>

        {/* 🔹 Only show `departmentId` if the user is not RootAdmin */}
        {selectedRole !== 'RootAdmin' && (
          <Form.Item name="departmentId" label="所属部门">
            <Select placeholder="选择部门">
              {departments.map((dept) => (
                <Option key={dept.id} value={dept.id}>
                  {dept.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {/* 🔹 Permissions (Module-Based Access) */}
        <Form.Item name="canAccess" label="模块访问权限">
          <Select mode="multiple" placeholder="选择允许访问的模块">
            {MODULES.map((module) => (
              <Option key={module.key} value={module.key}>
                {module.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

      </Form>
    </Modal>
  );
};

export default CreateUserModal;