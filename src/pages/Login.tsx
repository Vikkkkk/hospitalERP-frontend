import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from '../services/api';
import { useSearchParams, useNavigate } from 'react-router-dom';

const WECOM_CORP_ID = process.env.WECOM_CORP_ID || "ww8ca561daefff3e83";
const WECOM_AGENT_ID = process.env.WECOM_AGENT_ID || "1000002";
const REDIRECT_URI = encodeURIComponent(process.env.WECOM_REDIRECT_URI || "http://readily-hip-leech.ngrok-free.app/api/wecom-auth/wecom-callback");

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();

  const errorType = searchParams.get('error');
  const token = searchParams.get('token'); // ✅ Extract token from URL

  const errorMessages: Record<string, string> = {
    'unlinked_account': '您的WeCom账号未绑定，请使用普通登录方式并在个人设置中绑定WeCom账号。',
    'missing_code': '缺少授权码，请重新尝试扫描二维码登录。',
    'wecom_auth_failed': 'WeCom 认证失败，请重试或使用普通登录。',
    'internal_error': '服务器错误，请稍后再试。',
  };
  
  const errorMessage = errorType ? errorMessages[errorType] : null;

  // ✅ Automatically log in if token exists in URL
  useEffect(() => {
    if (token) {
      console.log('🔑 WeCom Login: Token found in URL, processing login...');
      
      localStorage.setItem('authToken', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Fetch user details from the backend
      axios.get('/api/auth/me')
        .then(response => {
          login(token, response.data.user);
          toast.success(`欢迎, ${response.data.user.username}`);
          navigate('/dashboard'); // Redirect to dashboard
        })
        .catch(() => {
          toast.error("自动登录失败，请手动登录");
        });
    }
  }, [token, login, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error('请输入用户名和密码');
      return;
    }
    try {
      const response = await axios.post('/api/auth/login', { username, password });
      login(response.data.token, response.data.user);
      toast.success(`欢迎, ${username}`);
    } catch (err) {
      setError("登录失败，请检查用户名或密码");
    }
  };

  const handleWeComLogin = () => {
    const url = `https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=${WECOM_CORP_ID}&agentid=${WECOM_AGENT_ID}&redirect_uri=${REDIRECT_URI}&state=STATE`;
    window.location.href = url;
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Hospital ERP 登录</h1>

        {errorMessage && (
          <div className="text-red-600 bg-red-100 p-3 rounded-md mb-4 text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <label htmlFor="username" className="block text-gray-700">用户名</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="请输入用户名"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700">密码</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="请输入密码"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
          >
            登录
          </button>

          <button
            onClick={handleWeComLogin}
            className="w-full bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition mt-4"
          >
            通过企业微信登录
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
