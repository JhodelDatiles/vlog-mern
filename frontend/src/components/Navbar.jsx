import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import EditUserModal from "../pages/EditUserModal"; // 1. Import the modal
import {
  Menu,
  LayoutDashboard,
  LogOut,
  User,
  Shield,
  Palette,
  Sun,
  Moon,
  Coffee,
  Trees,
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const themes = ["light", "dark", "forest", "coffee"];
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  
  // 2. Add state to control the modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = themes[(themes.indexOf(theme) + 1) % themes.length];
    setTheme(nextTheme);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "dark": return <Moon className="w-5 h-5" />;
      case "forest": return <Trees className="w-5 h-5" />;
      case "coffee": return <Coffee className="w-5 h-5" />;
      default: return <Sun className="w-5 h-5" />;
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isUserAdmin = user?.role === "admin" || user?.data?.role === "admin";

  return (
    <>
      <div className="navbar bg-base-100 shadow-lg px-4 md:px-8 border-b border-base-200 sticky top-0 z-[100]">
        <div className="navbar-start">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <Menu className="h-5 w-5" />
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[20] p-2 shadow bg-base-100 rounded-box w-52 border border-base-300">
              <li><Link to="/">Home</Link></li>
              {user && (
                <>
                  <li><Link to="/dashboard">My Posts</Link></li>
                  {isUserAdmin && <li><Link to="/admin" className="text-secondary">Admin Panel</Link></li>}
                </>
              )}
            </ul>
          </div>
          <Link to="/" className="btn btn-ghost normal-case text-2xl font-black text-primary tracking-tighter">
            <img src="/ipaskil_logo.png" alt="iPaskil Logo" className="w-20" />
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-3 font-bold">
            <li><Link to="/">Posts</Link></li>
            {user && (
              <>
                <li>
                  <Link to="/dashboard" className="flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4" /> My Posts
                  </Link>
                </li>
                {isUserAdmin && (
                  <li>
                    <Link to="/admin" className="flex items-center gap-2 text-secondary">
                      <Shield className="w-4 h-4" /> Admin
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>
        </div>

        <div className="navbar-end gap-2">
          <button onClick={toggleTheme} className="btn btn-ghost btn-circle hover:bg-primary/10">
            {getThemeIcon()}
          </button>

          {user ? (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar placeholder border-2 border-primary/20">
                <div className="bg-neutral text-neutral-content rounded-full w-10 overflow-hidden">
                  {user.profilePic ? (
                     <img src={user.profilePic} alt="profile" />
                  ) : (
                     <span className="text-xl font-bold">{user?.username?.[0]?.toUpperCase()}</span>
                  )}
                </div>
              </label>
              <ul tabIndex={0} className="mt-3 z-[20] p-2 shadow-2xl menu menu-sm dropdown-content bg-base-100 rounded-box w-56 border border-base-200">
                <li className="menu-title border-b border-base-200 mb-2 pb-2">
                  <span className="text-base-content font-bold">{user.username}</span>
                </li>

                {/* 3. Changed Link to Button to open modal */}
                <li>
                  <button 
                    onClick={() => setIsEditModalOpen(true)} 
                    className="flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-primary" /> Profile Settings
                  </button>
                </li>

                <li>
                  <Link to="/dashboard" className="flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4" /> My Posts
                  </Link>
                </li>
                <li>
                  <button onClick={toggleTheme} className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-2"><Palette className="w-4 h-4" /> Theme</div>
                    <span className="badge badge-outline text-[10px] capitalize">{theme}</span>
                  </button>
                </li>

                {isUserAdmin && (
                  <li className="mt-2 pt-2 border-t border-base-200">
                    <Link to="/admin" className="text-secondary font-bold flex items-center gap-2">
                      <Shield className="w-4 h-4" /> Admin Dashboard
                    </Link>
                  </li>
                )}

                <li className="mt-2 pt-2 border-t border-base-200">
                  <button onClick={handleLogout} className="text-error font-bold">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="gap-2 flex">
              <Link to="/login" className="btn btn-ghost btn-sm font-bold">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm font-bold">Register</Link>
            </div>
          )}
        </div>
      </div>

      {/* 4. Render the modal at the bottom of the component */}
      <EditUserModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
      />
    </>
  );
};

export default Navbar;