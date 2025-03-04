import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { storeToken } from "../services/AuthService";

const WeComCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const error = urlParams.get("error");

    if (error === "unlinked_account") {
      alert("您的WeCom账号未绑定，请使用普通登录方式并在个人设置中绑定WeCom账号。");
      navigate("/login");
    } else if (error) {
        console.log(error);
      alert("WeCom 登录失败，请重试或使用普通登录。");
      navigate("/login?error=wecom_failed");
    } else if (token) {
      storeToken(token); // Store JWT in local storage
      navigate("/dashboard"); // Redirect to dashboard
    }
  }, [navigate]);

  return <div className="text-center mt-10 text-lg">正在处理登录...</div>;
};

export default WeComCallback;
