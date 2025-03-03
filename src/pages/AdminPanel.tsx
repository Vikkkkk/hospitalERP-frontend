// frontend-erp/src/pages/AdminPanel.tsx

import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import { User } from '../types/User';
import { toast } from 'react-toastify';

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({
    name: '',
    role: '职员',
    departmentId: '',
    password: '',
  });

  // Fetch users when component loads
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data.users);
    } catch (error) {
      toast.error('❌ 无法加载用户列表');
    }
  };

  // Handle form changes for creating a new user
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  // Create a new user
  const handleCreateUser = async () => {
    try {
      await axios.post('/api/users/create', newUser);
      toast.success('✅ 用户创建成功');
      fetchUsers(); // Refresh the user list
    } catch (error) {
      toast.error('❌ 创建用户失败');
    }
  };

  // Update user role
  const handleRoleChange = async (id: number, role: string) => {
    try {
      await axios.patch(`/api/users/${id}/role`, { role });
      toast.success('✅ 用户角色已更新');
      fetchUsers();
    } catch (error) {
      toast.error('❌ 更新角色失败');
    }
  };

  // Reset user password
  const handleResetPassword = async (id: number, newPassword: string) => {
    try {
      await axios.patch(`/api/users/${id}/reset-password`, { newPassword });
      toast.success('🔒 密码已重置');
    } catch (error) {
      toast.error('❌ 重置密码失败');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">👩‍💼 管理员面板</h1>

      {/* Create New User Form */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">➕ 创建新用户</h2>
        <input
          name="name"
          placeholder="用户名"
          value={newUser.name}
          onChange={handleInputChange}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          name="departmentId"
          placeholder="部门ID"
          value={newUser.departmentId}
          onChange={handleInputChange}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          name="password"
          placeholder="密码"
          value={newUser.password}
          onChange={handleInputChange}
          type="password"
          className="border p-2 rounded w-full mb-2"
        />
        <select
          name="role"
          value={newUser.role}
          onChange={handleInputChange}
          className="border p-2 rounded w-full mb-2"
        >
          <option value="职员">职员</option>
          <option value="副部长">副部长</option>
          <option value="部长">部长</option>
          <option value="Admin">管理员</option>
        </select>
        <button
          onClick={handleCreateUser}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          创建用户
        </button>
      </div>

      {/* Users List */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">👥 用户列表</h2>
        {users.map((user) => (
          <div
            key={user.id}
            className="flex justify-between items-center p-2 border-b"
          >
            <div>
              <p>
                <strong>用户名:</strong> {user.username}
              </p>
              <p>
                <strong>角色:</strong> {user.role}
              </p>
              <p>
                <strong>部门:</strong> {user.departmentid}
              </p>
            </div>
            <div className="flex space-x-2">
              {/* Role Update */}
              <select
                value={user.role}
                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                className="border rounded p-1"
              >
                <option value="职员">职员</option>
                <option value="副部长">副部长</option>
                <option value="部长">部长</option>
                <option value="Admin">管理员</option>
              </select>

              {/* Password Reset */}
              <button
                onClick={() => handleResetPassword(user.id, 'newPassword123')}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                重置密码
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
