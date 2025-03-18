import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, Form, message, Switch } from 'antd';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../redux/hooks'; 
import { createUser, fetchUsers } from '../redux/actions/userActions';
import { fetchDepartments } from '../redux/actions/departmentActions';
import { selectDepartments } from '../redux/selectors/departmentSelectors';
import { MODULES } from '../constants';
import { UserInput } from '../redux/types/userTypes';
import { RootState } from '../redux/store'; // For current user access

interface CreateUserModalProps {
  visible: boolean;
  onClose: () => void;
}

const { Option } = Select;

const CreateUserModal: React.FC<CreateUserModalProps> = ({ visible, onClose }) => {
  const dispatch = useAppDispatch();
  const departments = useSelector(selectDepartments);
  const currentUser = useSelector((state: RootState) => state.auth.user); // ✅ Get current user

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isGlobalRole, setIsGlobalRole] = useState(false); // ✅ Global role toggle

  // ✅ Fetch departments on modal open
  useEffect(() => {
    if (visible) {
      dispatch(fetchDepartments());
    }
  }, [visible, dispatch]);

  // ✅ Submit handler
  const handleCreateUser = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const newUser: UserInput = {
        username: values.username,
        password: values.password,
        role: values.role,
        departmentId: values.departmentId ?? null,
        canAccess: values.canAccess ?? [],
        isglobalrole: currentUser?.role === 'RootAdmin' ? isGlobalRole : false, // ✅ Controlled by RootAdmin only
      };

      await dispatch(createUser(newUser)).unwrap();
      message.success('✅ 用户创建成功');
      dispatch(fetchUsers());
      form.resetFields();
      setIsGlobalRole(false); // Reset toggle
      onClose();
    } catch (error: any) {
      message.error(error || '❌ 创建用户失败');
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
            onChange={(value) => setSelectedRole(value)}
          >
            <Option value="RootAdmin">RootAdmin</Option>
            <Option value="Admin">Admin</Option>
            <Option value="DepartmentHead">DepartmentHead</Option>
            <Option value="Staff">Staff</Option>
          </Select>
        </Form.Item>

        {/* 🔹 Only show department selector for non-RootAdmin */}
        {selectedRole !== 'RootAdmin' && (
          <Form.Item name="departmentId" label="所属部门" rules={[{ required: true, message: '请选择部门' }]}>
            <Select placeholder="选择部门">
              {departments.map((dept) => (
                <Option key={dept.id} value={dept.id}>
                  {dept.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {/* 🔹 Module access permissions */}
        <Form.Item name="canAccess" label="模块访问权限">
          <Select mode="multiple" placeholder="选择允许访问的模块">
            {MODULES.map((module) => (
              <Option key={module.key} value={module.key}>
                {module.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* 🔹 RootAdmin Global Role Toggle */}
        {currentUser?.role === 'RootAdmin' && (
          <Form.Item label="是否为全局角色">
            <Switch checked={isGlobalRole} onChange={setIsGlobalRole} />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default CreateUserModal;