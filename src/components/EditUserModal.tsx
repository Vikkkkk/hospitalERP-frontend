import React, { useState, useEffect } from 'react';
import { Modal, Button, Select, Form, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { updateUser } from '../redux/actions/userActions';
import { fetchDepartments } from '../redux/actions/departmentActions';
import { selectDepartments } from '../redux/selectors/departmentSelectors';
import { User } from '../redux/store/slices/userSlice';

interface EditUserModalProps {
  visible: boolean;
  onClose: () => void;
  user: User | null;
}

const { Option } = Select;

const EditUserModal: React.FC<EditUserModalProps> = ({ visible, onClose, user }) => {
  const dispatch = useDispatch<AppDispatch>();
  const departments = useSelector(selectDepartments);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // ✅ Load departments on modal open
  useEffect(() => {
    if (visible) {
      dispatch(fetchDepartments());
      form.setFieldsValue({
        role: user?.role,
        departmentId: user?.departmentId ?? undefined,
      });
    }
  }, [visible, user, dispatch, form]);

  // ✅ Handle Save Changes
  const handleUpdateUser = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await dispatch(updateUser({ id: user!.id, ...values })).unwrap();
      message.success('用户信息更新成功');
      onClose();
    } catch (error:any) {
      message.error(error || '更新用户信息失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="编辑用户"
      open={visible}
      onCancel={onClose}
      onOk={handleUpdateUser}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="role" label="角色" rules={[{ required: true, message: '请选择角色' }]}>
          <Select placeholder="选择角色">
            <Option value="RootAdmin">RootAdmin</Option>
            <Option value="Admin">Admin</Option>
            <Option value="DepartmentHead">DepartmentHead</Option>
            <Option value="Staff">Staff</Option>
          </Select>
        </Form.Item>

        <Form.Item name="departmentId" label="所属部门">
          <Select placeholder="选择部门" allowClear>
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

export default EditUserModal;