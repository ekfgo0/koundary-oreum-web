import LoginForm from '../../components/auth/LoginForm';
import LoginLogo from '../../components/auth/LoginLogo';
import Koundarytext from '../../components/auth/Koundarytext';



function Login() {
  return (
    <div className="min-h-screen flex justify-center">
      <div className="flex flex-col items-center pt-[8vh]">
        <LoginLogo />
        <Koundarytext />
        <div className="mt-6 w-[340px]">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

export default Login;