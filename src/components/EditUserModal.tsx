import React, { useState, useEffect } from 'react';
import { Modal, Select, Form, message, Button } from 'antd';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../redux/hooks'; 
import { fetchDepartments } from '../redux/actions/departmentActions';
import { selectDepartments } from '../redux/selectors/departmentSelectors';
import { User } from '../redux/slices/userSlice';
import { MODULES } from '../constants'; // ✅ Import centralized module list

interface EditUserModalProps {
  visible: boolean;
  onClose: () => void;
  user: User | null;
  onSave: (updatedUserData: any) => Promise<void>;
}

const { Option } = Select;

const EditUserModal: React.FC<EditUserModalProps> = ({ visible, onClose, user, onSave }) => {
  const dispatch = useAppDispatch();
  const departments = useSelector(selectDepartments);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isChanged, setIsChanged] = useState(false); // ✅ Track changes

  // ✅ Fetch Departments on Mount
  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  // ✅ Reset form when modal opens
  useEffect(() => {
    if (visible && user?.id) {
      form.setFieldsValue({
        role: user.role,
        departmentId: user.departmentId ?? undefined,
        canAccess: user.canAccess ?? [],
      });
      setIsChanged(false); // Reset change tracking
    }
  }, [visible, user, form]);

  // ✅ Handle Save Changes
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // ✅ Avoid unnecessary API calls if no changes
      if (
        values.role === user?.role &&
        values.departmentId === user?.departmentId &&
        JSON.stringify(values.canAccess) === JSON.stringify(user?.canAccess)
      ) {
        message.info("没有检测到更改"); // No changes detected
        setLoading(false);
        return;
      }

      await onSave({
        id: user!.id,
        role: values.role,
        departmentId: values.departmentId ?? null,
        canAccess: values.canAccess ?? [],
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
        <Button key="cancel" onClick={onClose}>
          取消
        </Button>,
        <Button key="save" type="primary" onClick={handleSave} loading={loading} disabled={!isChanged}>
          保存更改
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onValuesChange={() => setIsChanged(true)} // ✅ Detect changes
      >
        {/* Role Selection */}
        <Form.Item name="role" label="角色" rules={[{ required: true, message: "请选择角色" }]}>
          <Select placeholder="选择角色">
            <Option value="RootAdmin">RootAdmin</Option>
            <Option value="Admin">Admin</Option>
            <Option value="DepartmentHead">DepartmentHead</Option>
            <Option value="Staff">Staff</Option>
          </Select>
        </Form.Item>

        {/* Department Selection */}
        <Form.Item name="departmentId" label="所属部门">
          <Select placeholder="选择部门" allowClear>
            {departments.map((dept) => (
              <Option key={dept.id} value={dept.id}>
                {dept.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Permissions (Module Access) */}
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

export default EditUserModal;