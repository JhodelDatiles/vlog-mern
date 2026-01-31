import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogIn, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-140 flex items-center justify-center bg-base-200 p-4">
      {/* Container that switches from Column (mobile) to Row (desktop) */}
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 max-w-4xl w-full justify-center">
        
        {/* --- LOGO SECTION --- */}
        <div className="flex flex-col items-center text-center md:text-left md:items-start animate-in fade-in slide-in-from-left duration-700">
          <img 
            src="../../public/ipaskil_logo.png" 
            alt="iPaskil Logo" 
            className="w-100  object-contain mb-4 drop-shadow-2xl" 
          />
        </div>

        {/* --- FORM SECTION --- */}
        <div className="card w-full max-w-sm bg-base-100 shadow-2xl border border-base-300">
          <div className="card-body p-8">
            <h2 className="card-title text-2xl font-black text-base-content uppercase italic mb-4">
              Login
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-bold text-[10px] uppercase tracking-widest opacity-60">Email Address</span>
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  className="input input-bordered w-full bg-base-200 border-base-300 focus:border-primary focus:outline-none"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-bold text-[10px] uppercase tracking-widest opacity-60">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input input-bordered w-full bg-base-200 border-base-300 focus:border-primary focus:outline-none"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-control mt-6">
                <button
                  type="submit"
                  className="btn btn-primary gap-2 w-full font-bold uppercase tracking-widest"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      Login
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="divider opacity-50 text-[10px] font-bold">OR</div>

            <p className="text-center text-sm font-medium text-base-content/70">
              Don't have an account?{" "}
              <Link to="/register" className="link link-primary font-bold no-underline hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;