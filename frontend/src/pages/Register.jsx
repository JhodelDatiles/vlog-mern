import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserPlus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const CpasswordRef = useRef(null);

  useEffect(() => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    
    // Email Validation
    if (formData.email && !formData.email.includes("@")) {
      emailRef.current?.setCustomValidity("Invalid email format.");
    } else {
      emailRef.current?.setCustomValidity("");
    }

    // Password Complexity Validation
    if (formData.password && !passwordRegex.test(formData.password)) {
      passwordRef.current?.setCustomValidity(
        "Password must be 8+ chars with a letter and number.",
      );
    } else {
      passwordRef.current?.setCustomValidity("");
    }

    // Password Match Validation
    if (
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      CpasswordRef.current?.setCustomValidity("Passwords do not match.");
    } else {
      CpasswordRef.current?.setCustomValidity("");
    }
  }, [formData.email, formData.password, formData.confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      navigate("/");
    } catch (error) {
      console.error("ERAWR", error.message);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-140 flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-3xl font-bold text-center justify-center mb-4">
            Welcome to iPaskil
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="form-control mt-3">
              <input
                type="text"
                placeholder="Username"
                className="input input-bordered w-full"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required
                minLength={3}
              />
            </div>

            <div className="form-control mt-3">
              <input
                ref={emailRef}
                type="email"
                placeholder="Email"
                className="input input-bordered w-full"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="form-control mt-3">
              <input
                ref={passwordRef}
                type="password"
                placeholder="Password"
                className="input input-bordered w-full"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                minLength={6}
              />
            </div>

            <div className="form-control mt-3">
              <input
                ref={CpasswordRef}
                type="password"
                placeholder="Confirm password"
                className="input input-bordered w-full"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                required
              />
            </div>

            <div className="form-control mt-3 mt-6">
              <button
                type="submit"
                className="btn btn-primary gap-2 w-full"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Register
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="divider">OR</div>

          <p className="text-center">
            Already have an account?{" "}
            <Link to="/login" className="link link-primary">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
