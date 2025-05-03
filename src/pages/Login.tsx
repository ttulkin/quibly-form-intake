
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quibly</h1>
          <p className="text-gray-600">Your shortcut to startup-ready engineers</p>
        </div>
        
        <div className="max-w-md mx-auto mt-16">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
