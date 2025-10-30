import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Our App</h1>
        {user && (
          <div className="mb-6">
            <p className="text-lg text-gray-600">
              Hello, {user.name || user.email}!
            </p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none focus:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
