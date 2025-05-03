
import { Link } from "react-router-dom";

interface PageHeaderProps {
  showLoginLink?: boolean;
}

const PageHeader = ({ showLoginLink = false }: PageHeaderProps) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Quibly</h1>
      <p className="text-gray-600">Your shortcut to startup-ready engineers</p>
      {showLoginLink && (
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Already submitted a request?{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-800 underline">
              Log in
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default PageHeader;
