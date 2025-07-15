import LoginForm from '../../components/auth/LoginForm';
import LoginLogo from '../../components/auth/LoginLogo';
import Koundarytext from '../../components/auth/Koundarytext';
import LanguageSelector from '../../components/auth/LanguageSelector';


function Login() {
 return (
    <div className="min-h-screen flex flex-col items-center justify-between">
      <div className="flex flex-col items-center pt-[8vh]">
        <LoginLogo />
        <Koundarytext />
        <div className="mt-6 w-[340px]">
          <LoginForm />
        </div>
      </div>

      {/* 언어 선택 드롭다운을 하단에 배치 */}
      <div className="mb-10">
        <LanguageSelector />
      </div>
    </div>
  );
}

export default Login;