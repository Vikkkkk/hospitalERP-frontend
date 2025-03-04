import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react"; // ✅ Correct import
import { useNavigate } from "react-router-dom";

const WECOM_CORP_ID = process.env.WECOM_CORP_ID
const WECOM_AGENT_ID = process.env.WECOM_AGENT_ID
const REDIRECT_URI = encodeURIComponent(process.env.WECOM_REDIRECT_URI || "https://readily-hip-leech.ngrok-free.app/api/wecom-auth/wecom-callback");


const WeComLogin = () => {
  const [qrUrl, setQrUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const url = `https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=${WECOM_CORP_ID}&agentid=${WECOM_AGENT_ID}&redirect_uri=${REDIRECT_URI}&state=secureRandomString`;
    setQrUrl(url);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">WeCom 企业微信登录</h2>
      {qrUrl && <QRCodeCanvas value={qrUrl} size={200} />}
      <p className="mt-4 text-gray-700">请使用企业微信扫描二维码进行登录</p>
    </div>
  );
};

export default WeComLogin;
