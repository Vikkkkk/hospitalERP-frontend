import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../redux/actions/userActions';
import { selectUsers, selectUsersLoading } from '../redux/selectors/userSelectors';
import { RootState, AppDispatch } from '../redux/store';
import { Table, Button, Space, Tag, Spin, message } from 'antd';
import CreateUserModal from '../components/CreateUserModal';
import EditUserModal from '../components/EditUserModal';

const UserManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector(selectUsers);
  const loading = useSelector(selectUsersLoading);

  // ✅ Modal Control
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const openEditModal = (user: any) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'RootAdmin' ? 'volcano' : role === 'Admin' ? 'geekblue' : 'green'}>
          {role}
        </Tag>
      ),
    },
    {
      title: '部门',
      dataIndex: 'departmentId',
      key: 'departmentId',
      render: (departmentId: number | null) => (departmentId ? `部门 ${departmentId}` : '无'),
    },
    {
      title: 'WeCom 绑定',
      dataIndex: 'wecom_userid',
      key: 'wecom_userid',
      render: (wecom_userid: string | null) =>
        wecom_userid ? <Tag color="blue">已绑定</Tag> : <Tag color="red">未绑定</Tag>,
    },
    {
      title: '操作',
      key: 'actions',
      render: (text: any, record: any) => (
        <Space>
          <Button type="link" onClick={() => openEditModal(record)}>编辑</Button>
          <Button type="link" danger onClick={() => message.warning('删除功能待实现')}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-lg font-semibold mb-4">👤 用户管理</h2>
      <Button type="primary" onClick={() => setCreateModalOpen(true)}>+ 添加用户</Button>

      {loading ? (
        <div className="flex justify-center p-6">
          <Spin size="large" />
        </div>
      ) : (
        <Table columns={columns} dataSource={users} rowKey="id" className="mt-4" />
      )}

      {/* Modals */}
      <CreateUserModal visible={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} />
      {selectedUser && <EditUserModal visible={isEditModalOpen} user={selectedUser} onClose={() => setEditModalOpen(false)} />}
    </div>
  );
};

export default UserManagement;