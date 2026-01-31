import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { authAPI } from "../utils/api";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // This function runs on every refresh to see who is logged in
  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await authAPI.getCurrentUser();
        // This response.data must include the latest profilePic and username
        setUser(response.data);
      } catch (error) {
        console.error("❌ Auth check failed:", error);
        localStorage.removeItem("token");
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      await checkAuth(); 
      toast.success("Registration successful!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      throw error;
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      localStorage.setItem("token", response.data.token);
      await checkAuth();
      toast.success("Login successful!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      throw error;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      localStorage.removeItem("token");
      await authAPI.logout();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isAdmin = useMemo(() => user?.role === "admin", [user]);

  const value = {
    user,
    setUser, // Allows external components to update the global user state
    loading,
    login,
    register,
    logout,
    checkAuth,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;