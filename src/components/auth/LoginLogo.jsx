import React from "react";
import LoginLogoImg from "../common/Teamlogo.png";  // ← 확장자 주의!

const LoginLogo = () => {
  return (
    <img
  src={LoginLogoImg}
  alt="Logo"
  className="w-[150px] h-[150px] mb-6 rounded-none"
/>
  );
};

export default LoginLogo;