import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, Form, message, Switch } from 'antd';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../redux/hooks'; 
import { createUser, fetchUsers } from '../redux/actions/userActions';
import { fetchDepartments } from '../redux/actions/departmentActions';
import { selectDepartments } from '../redux/selectors/departmentSelectors';
import { MODULES } from '../constants';
import { UserInput } from '../redux/types/userTypes';
import { RootState } from '../redux/store';

interface CreateUserModalProps {
  visible: boolean;
  onClose: () => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ visible, onClose }) => {
  const dispatch = useAppDispatch();
  const departments = useSelector(selectDepartments);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isGlobalRole, setIsGlobalRole] = useState(false);

  const roleOptions = [
    { label: 'RootAdmin', value: 'RootAdmin' },
    { label: 'Admin', value: 'Admin' },
    { label: 'DepartmentHead', value: 'DepartmentHead' },
    { label: 'Staff', value: 'Staff' },
  ];

  const moduleOptions = MODULES.map((module) => ({
    label: module.label,
    value: module.key,
  }));

  useEffect(() => {
    if (visible) {
      dispatch(fetchDepartments());
    }
  }, [visible, dispatch]);

  const handleCreateUser = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const permissions: Record<string, { read: boolean; write: boolean }> = {};
      (values.permissions || []).forEach((moduleKey: string) => {
        permissions[moduleKey] = { read: true, write: true };
      });

      const newUser: UserInput = {
        username: values.username,
        password: values.password,
        role: values.role,
        departmentId: values.departmentId ?? null,
        isglobalrole: currentUser?.role === 'RootAdmin' ? isGlobalRole : false,
        permissions,
      };

      await dispatch(createUser(newUser)).unwrap();
      message.success('✅ 用户创建成功');
      dispatch(fetchUsers());
      form.resetFields();
      setIsGlobalRole(false);
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
          <Select<string>
            placeholder="选择角色"
            options={roleOptions}
            value={selectedRole ?? undefined}
            onChange={(value: string) => setSelectedRole(value)}
            style={{ width: '100%' }}
          />
        </Form.Item>

        {selectedRole !== 'RootAdmin' && (
          <Form.Item name="departmentId" label="所属部门" rules={[{ required: true, message: '请选择部门' }]}>
            <Select<number>
              placeholder="选择部门"
              options={departments.map(dept => ({ label: dept.name, value: dept.id }))}
              style={{ width: '100%' }}
            />
          </Form.Item>
        )}

        <Form.Item name="permissions" label="模块访问权限">
          <Select<string>
            mode="multiple"
            placeholder="选择模块 (默认拥有读写权限)"
            options={moduleOptions}
            style={{ width: '100%' }}
          />
        </Form.Item>

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