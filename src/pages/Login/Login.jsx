import React from 'react';
import LoginForm from '../../components/auth/LoginForm';
import LoginLogo from '../../components/auth/LoginLogo';
import Koundarylogo from '../../components/auth/Koundarylogo';
import LanguageSelector from '../../components/auth/LanguageSelector';


function Login() {
  return (
    <div className="min-h-screen flex flex-col justify-between items-center">
      <div className="flex flex-col items-center justify-center grow">
        <LoginLogo />
        <Koundarylogo />
        <div className="mt-6 w-[340px]">
          <LoginForm />
        </div>
      </div>

      <div className="mb-10">
        <LanguageSelector />
      </div>
    </div>
  );
}
export default Login;