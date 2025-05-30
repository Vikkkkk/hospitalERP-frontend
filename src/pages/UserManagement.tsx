import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../redux/hooks';
import {
  fetchUsers,
  fetchDeletedUsers,
  deleteUser,
  restoreUser,
  updateUser,
} from '../redux/actions/userActions';
import { selectUsers, selectUsersLoading } from '../redux/selectors/userSelectors';
import { RootState } from '../redux/store';
import { Table, Button, Space, Tag, Spin, message, Popconfirm, Tabs } from 'antd';
import CreateUserModal from '../components/CreateUserModal';
import EditUserModal from '../components/EditUserModal';
import { MODULES } from '../constants';

const UserManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const users = useSelector(selectUsers);
  const deletedUsers = useSelector((state: RootState) => state.user.deletedUsers || []);
  const loading = useSelector(selectUsersLoading);

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const permissionLabels: Record<string, string> = {
    dashboard: '个人主页',
    procurement: '采购管理',
    departments: '部门管理',
    'user-management': '用户管理',
    'main-inventory': '总库存管理',
    'dept-inventory': '二级库管理',
  };

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchDeletedUsers());
  }, [dispatch]);

  const openEditModal = (user: any) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await dispatch(deleteUser(userId)).unwrap();
      message.success('用户已删除');
      dispatch(fetchUsers());
      dispatch(fetchDeletedUsers());
    } catch (error: any) {
      message.error(error?.message || '删除用户失败');
    }
  };

  const handleEditUser = async (updatedUserData: any) => {
    try {
      await dispatch(updateUser(updatedUserData)).unwrap();
      message.success('用户信息已更新');
      dispatch(fetchUsers());
    } catch (error: any) {
      message.error(error?.message || '更新用户信息失败');
    }
  };

  const handleRestoreUser = async (userId: number) => {
    try {
      await dispatch(restoreUser(userId)).unwrap();
      message.success('用户已恢复');
      dispatch(fetchUsers());
      dispatch(fetchDeletedUsers());
    } catch (error: any) {
      message.error(error?.message || '恢复用户失败');
    }
  };

  const renderPermissions = (permissions: Record<string, { read: boolean; write: boolean }>) => {
    if (!permissions || Object.keys(permissions).length === 0) {
      return <Tag color="red">无权限</Tag>;
    }

    return Object.entries(permissions).map(([key, perms]) => {
      const label = permissionLabels[key] || key;
      const accessLevel = perms.write ? '读写' : '只读';
      const color = perms.write ? 'purple' : 'blue';
      return (
        <Tag color={color} key={key}>
          {label} ({accessLevel})
        </Tag>
      );
    });
  };

  const commonColumns = [
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
      dataIndex: 'departmentName',
      key: 'departmentName',
      render: (departmentName: string | null, record: any) =>
        departmentName ? `${departmentName} (ID: ${record.departmentId})` : '无',
    },
  ];

  const activeColumns = [
    ...commonColumns,
    {
      title: 'WeCom 绑定',
      dataIndex: 'wecom_userid',
      key: 'wecom_userid',
      render: (wecom_userid: string | null) =>
        wecom_userid ? <Tag color="blue">已绑定</Tag> : <Tag color="red">未绑定</Tag>,
    },
    {
      title: '权限',
      dataIndex: 'permissions',
      key: 'permissions',
      render: renderPermissions,
    },
    {
      title: '操作',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" onClick={() => openEditModal(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除此用户？"
            onConfirm={() => handleDeleteUser(record.id)}
            okText="是"
            cancelText="否"
          >
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const deletedColumns = [
    ...commonColumns,
    {
      title: '权限',
      dataIndex: 'permissions',
      key: 'permissions',
      render: renderPermissions,
    },
    {
      title: '操作',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Popconfirm
            title="确定恢复此用户？"
            onConfirm={() => handleRestoreUser(record.id)}
            okText="是"
            cancelText="否"
          >
            <Button type="link" style={{ color: 'green' }}>
              恢复
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-lg font-semibold mb-4">👤 用户管理</h2>
      <Button type="primary" onClick={() => setCreateModalOpen(true)}>
        + 添加用户
      </Button>

      <Tabs
        defaultActiveKey="1"
        items={[
          {
            label: '活跃用户',
            key: '1',
            children: loading ? (
              <div className="flex justify-center p-6">
                <Spin size="large" />
              </div>
            ) : (
              <Table columns={activeColumns} dataSource={users} rowKey="id" className="mt-4" />
            ),
          },
          {
            label: '已删除用户',
            key: '2',
            children: loading ? (
              <div className="flex justify-center p-6">
                <Spin size="large" />
              </div>
            ) : (
              <Table columns={deletedColumns} dataSource={deletedUsers} rowKey="id" className="mt-4" />
            ),
          },
        ]}
      />

      {/* Modals */}
      <CreateUserModal visible={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} />
      {selectedUser && (
        <EditUserModal
          visible={isEditModalOpen}
          user={selectedUser}
          onClose={() => setEditModalOpen(false)}
          onSave={handleEditUser}
        />
      )}
    </div>
  );
};

export default UserManagement;