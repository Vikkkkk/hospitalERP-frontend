import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../services/api';
import { toast } from 'react-toastify';

// WeCom OAuth Config
const WECOM_CORP_ID = process.env.REACT_APP_WECOM_CORP_ID;
const WECOM_AGENT_ID = process.env.REACT_APP_WECOM_AGENT_ID;
const BASE_BACKEND_URL = "http://readily-hip-leech.ngrok-free.app/api/wecom-auth";

const UserProfile: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isUnbinding, setIsUnbinding] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [wecomUserId, setWecomUserId] = useState<string | null>(null);

  // Detect OAuth mode & capture WeCom UserID
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const mode = urlParams.get('mode');
    const wecomUserId = urlParams.get('wecom_userid');

    if (mode === 'confirm' && wecomUserId) {
      setWecomUserId(wecomUserId);
      setShowPasswordInput(true);
      toast.info("WeCom 认证成功，请输入密码以完成绑定");
    }
  }, [location.search]);

  // Redirect to WeCom for Authentication with `mode=link`
  const handleWeComLink = () => {
    const linkRedirectUri = encodeURIComponent(`${BASE_BACKEND_URL}/wecom-callback?mode=link`);

    console.log("WECOM_CORP_ID:", WECOM_CORP_ID);
    console.log("WECOM_AGENT_ID:", WECOM_AGENT_ID);

    
    const url = `https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=${WECOM_CORP_ID}&agentid=${WECOM_AGENT_ID}&redirect_uri=${linkRedirectUri}&state=STATE`;
    window.location.href = url;
  };

  // Confirm WeCom Linking (Final Step)
  const confirmWeComLink = async () => {
    if (!user) return;
    
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("未找到身份令牌，请重新登录");
      return;
    }

    if (!password.trim()) {
      toast.error("请输入密码");
      return;
    }

    if (!wecomUserId) {
      toast.error("无效的 WeCom 用户ID，请重新扫码");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        '/api/wecom-auth/link-wecom',
        { password, wecom_userid: wecomUserId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("WeCom 账号绑定成功");

      // ✅ Ensure all properties are set correctly
      const updatedUser = {
        ...user,
        id: user.id,
        username: user.username,
        role: user.role,
        departmentid: user.departmentid,
        isglobalrole: user.isglobalrole,
        wecom_userid: wecomUserId, // ✅ Update WeCom ID
      };

      updateUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setLoading(false);
      navigate('/profile'); 
    } catch (error: any) {
      toast.error(error.response?.data?.message || "绑定失败");
      setLoading(false);
    }
  };

  // ✅ Function to Unbind WeCom Account
  const unbindWeComAccount = async () => {
    if (!user || !user.wecom_userid) return;

    setIsUnbinding(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("身份验证失败，请重新登录");
        logout();
        return;
      }

      await axios.post('/api/wecom-auth/unlink-wecom', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("WeCom 账号解绑成功");

      // ✅ Ensure all properties are set correctly
      const updatedUser = {
        ...user,
        id: user.id,
        username: user.username,
        role: user.role,
        departmentid: user.departmentid,
        isglobalrole: user.isglobalrole,
        wecom_userid: null, // ✅ Properly unset WeCom ID
      };

      updateUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      navigate('/profile');
    } catch (error: any) {
      toast.error(error.response?.data?.message || "解绑失败");
    } finally {
      setIsUnbinding(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold">用户资料 (User Profile)</h2>
      <p><strong>用户名:</strong> {user?.username}</p>
      <p><strong>角色:</strong> {user?.role}</p>

      {/* ✅ Display WeCom Account Status */}
      {user?.wecom_userid ? (
        <>
          <p className="text-green-600">✅ WeCom 账号已绑定</p>
          <button
            onClick={unbindWeComAccount}
            disabled={isUnbinding}
            className="mt-4 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
          >
            {isUnbinding ? "解绑中..." : "解绑 WeCom 账号"}
          </button>
        </>
      ) : (
        <>
          <button
            onClick={handleWeComLink}
            className="mt-4 bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition"
          >
            绑定 WeCom 账号
          </button>

          {/* Show Password Input Only If `mode=confirm` Detected */}
          {showPasswordInput && (
            <div className="mt-4">
              <input
                type="password"
                placeholder="输入密码确认"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
              <button
                onClick={confirmWeComLink}
                disabled={loading}
                className="mt-2 w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
              >
                {loading ? "绑定中..." : "确认绑定"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserProfile;
