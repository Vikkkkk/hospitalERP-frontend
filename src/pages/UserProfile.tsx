import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../services/api';
import { selectUser } from '../redux/selectors/authSelectors';
import { updateUser, logoutUser } from '../redux/actions/authActions';

const WECOM_CORP_ID = process.env.REACT_APP_WECOM_CORP_ID || "";
const WECOM_AGENT_ID = process.env.REACT_APP_WECOM_AGENT_ID || "";
const BASE_BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://readily-hip-leech.ngrok-free.app/api/wecom-auth";

const UserProfile: React.FC = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isUnbinding, setIsUnbinding] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [wecomUserId, setWecomUserId] = useState<string | null>(null);

  // ✅ Detect WeCom OAuth mode & extract UserID
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

  // ✅ Redirect user to WeCom OAuth for binding
  const handleWeComLink = () => {
    if (!WECOM_CORP_ID || !WECOM_AGENT_ID) {
      toast.error("企业微信配置缺失，请联系管理员");
      return;
    }

    const linkRedirectUri = encodeURIComponent(`${BASE_BACKEND_URL}/wecom-callback?mode=link`);
    const url = `https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=${WECOM_CORP_ID}&agentid=${WECOM_AGENT_ID}&redirect_uri=${linkRedirectUri}&state=STATE`;
    
    window.location.href = url;
  };

  // ✅ Confirm WeCom Account Linking
  const confirmWeComLink = async () => {
    if (!user) return;
    if (!password.trim()) return toast.error("请输入密码");
    if (!wecomUserId) return toast.error("无效的 WeCom 用户ID，请重新扫码");

    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("未找到身份令牌，请重新登录");

      await axios.post('/api/wecom-auth/link-wecom', 
        { password, wecom_userid: wecomUserId }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("WeCom 账号绑定成功");

      const updatedUser = { ...user, wecom_userid: wecomUserId };
      dispatch(updateUser(updatedUser) as any); // ✅ Fix Redux Thunk TypeScript error
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setLoading(false);
      navigate('/profile');
    } catch (error: any) {
      toast.error(error.response?.data?.message || "绑定失败");
      setLoading(false);
    }
  };

  // ✅ Unbind WeCom Account
  const unbindWeComAccount = async () => {
    if (!user || !user.wecom_userid) return;

    try {
      setIsUnbinding(true);
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("身份验证失败，请重新登录");

      await axios.post('/api/wecom-auth/unlink-wecom', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("WeCom 账号解绑成功");

      const updatedUser = { ...user, wecom_userid: undefined }; // ✅ Fix null issue
      dispatch(updateUser(updatedUser) as any); // ✅ Fix Redux Thunk TypeScript error
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

      {/* ✅ WeCom Account Status */}
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

      {/* ✅ Logout Button */}
      <button
        onClick={() => dispatch(logoutUser() as any)} // ✅ Fix Redux Thunk TypeScript error
        className="mt-6 w-full bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600 transition"
      >
        退出登录
      </button>
    </div>
  );
};

export default UserProfile;