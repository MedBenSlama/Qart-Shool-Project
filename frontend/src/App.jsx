import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Feed from "./pages/feed/Feed";
import Profile from "./pages/profile/Profile";
import ProfileSettings from "./pages/profile/ProfileSettings";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  const { checkAuth, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" /> : <Login />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/" /> : <Signup />}
      />

      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Feed />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/settings" element={<ProfileSettings />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
