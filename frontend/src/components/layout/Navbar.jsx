import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getImageUrl = (path) => {
  if (!path) return "/placeholder.svg";
  if (path.startsWith("http")) return path;
  return `${API_URL}/${path}`;
};

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-purple-600">
            Qart
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-700 hover:text-purple-600">
              Feed
            </Link>
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-2"
              >
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                  {user?.avatar ? (
                    <img
                      src={getImageUrl(user.avatar)}
                      alt={user.firstname}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-medium">
                      {user?.firstname?.charAt(0)}
                      {user?.lastname?.charAt(0)}
                    </span>
                  )}
                </div>
                <span className="text-gray-700">{user?.firstname}</span>
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link
                    to={`/profile/${user?._id}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {isMenuOpen && (
              <div className="absolute top-16 right-0 left-0 bg-white shadow-md z-10">
                <Link
                  to="/"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Feed
                </Link>
                <Link
                  to={`/profile/${user?._id}`}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
