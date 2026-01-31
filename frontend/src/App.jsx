import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import EditUser from "./pages/EditUserModal"; // New Page
import UserProfile from "./pages/UserProfile"; // 👈 Create this file next
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import AllPosts from "./pages/admin/AllPost";

function App() {
  return (
    <div className="min-h-screen bg-base-200 transition-colors duration-300">
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes (User) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/profile/:username" element={<UserProfile />} />
        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <EditUser />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <UserManagement />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/posts"
          element={
            <AdminRoute>
              <AllPosts />
            </AdminRoute>
          }
        />

        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
