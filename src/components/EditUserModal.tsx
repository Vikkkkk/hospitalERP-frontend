import React, { useState, useEffect } from 'react';
import { Modal, Select, Form, message, Button } from 'antd';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../redux/hooks'; 
import { fetchDepartments } from '../redux/actions/departmentActions';
import { selectDepartments } from '../redux/selectors/departmentSelectors';
import { User } from '../redux/slices/userSlice';
import { MODULES } from '../constants';

interface EditUserModalProps {
  visible: boolean;
  onClose: () => void;
  user: User | null;
  onSave: (updatedUserData: any) => Promise<void>;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ visible, onClose, user, onSave }) => {
  const dispatch = useAppDispatch();
  const departments = useSelector(selectDepartments);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  useEffect(() => {
    if (visible && user?.id) {
      const selectedModules = Object.keys(user.permissions || {});
      form.setFieldsValue({
        role: user.role,
        departmentId: user.departmentId ?? undefined,
        permissions: selectedModules,
      });
      setIsChanged(false);
    }
  }, [visible, user, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const newPermissions: Record<string, { read: boolean; write: boolean }> = {};
      (values.permissions || []).forEach((key: string) => {
        newPermissions[key] = { read: true, write: true };
      });

      const originalModules = Object.keys(user?.permissions || {});
      const modulesChanged = JSON.stringify(originalModules.sort()) !== JSON.stringify(Object.keys(newPermissions).sort());

      if (
        values.role === user?.role &&
        values.departmentId === user?.departmentId &&
        !modulesChanged
      ) {
        message.info("没有检测到更改");
        setLoading(false);
        return;
      }

      await onSave({
        id: user!.id,
        role: values.role,
        departmentId: values.departmentId ?? null,
        permissions: newPermissions,
      });

      message.success("用户信息更新成功");
      onClose();
    } catch (error: any) {
      message.error(error?.message || "更新用户信息失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="编辑用户"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>取消</Button>,
        <Button key="save" type="primary" onClick={handleSave} loading={loading} disabled={!isChanged}>
          保存更改
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onValuesChange={() => setIsChanged(true)}
      >
        <Form.Item name="role" label="角色" rules={[{ required: true, message: "请选择角色" }]}>
          <Select placeholder="选择角色">
            <Select.Option value="RootAdmin">RootAdmin</Select.Option>
            <Select.Option value="Admin">Admin</Select.Option>
            <Select.Option value="DepartmentHead">DepartmentHead</Select.Option>
            <Select.Option value="Staff">Staff</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="departmentId" label="所属部门">
          <Select placeholder="选择部门" allowClear>
            {departments.map((dept) => (
              <Select.Option key={dept.id} value={dept.id}>{dept.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="permissions" label="模块访问权限">
          <Select mode="multiple" placeholder="选择模块 (默认读写)">
            {MODULES.map((module) => (
              <Select.Option key={module.key} value={module.key}>{module.label}</Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditUserModal;