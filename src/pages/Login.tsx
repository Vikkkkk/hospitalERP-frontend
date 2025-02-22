import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [role, setRole] = useState<'Admin' | 'Director' | 'DeputyDirector' | 'Staff' | 'WarehouseStaff'>('Staff');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter your name.');
      return;
    }

    const user = {
      id: Math.floor(Math.random() * 1000),
      name,
      role,
    };

    login(user);
    toast.success(`Welcome, ${name} (${role})`);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Hospital ERP Login</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-gray-700">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="Admin">Admin</option>
              <option value="Director">Director</option>
              <option value="DeputyDirector">Deputy Director</option>
              <option value="Staff">Staff</option>
              <option value="WarehouseStaff">Warehouse Staff</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
