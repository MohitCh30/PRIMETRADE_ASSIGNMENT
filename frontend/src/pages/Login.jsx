import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/auth/login",
        { email, password }
      );

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-8 font-['Inter'] text-white flex items-center justify-center">
      <div className="w-full max-w-md mx-auto rounded-lg border border-zinc-800 bg-[#111111] p-8">
        <h1 className="text-2xl font-semibold text-white">Sign In</h1>
        <p className="mt-1 text-sm text-zinc-400">PrimeTrade Task Manager</p>

        {error && <div className="mt-4 text-sm text-red-400">{error}</div>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm text-zinc-300">Email</label>
            <input
              type="email"
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white font-['JetBrains_Mono'] focus:border-transparent focus:ring-2 focus:ring-amber-500"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              data-testid="email-input"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-zinc-300">Password</label>
            <input
              type="password"
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white font-['JetBrains_Mono'] focus:border-transparent focus:ring-2 focus:ring-amber-500"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              data-testid="password-input"
            />
          </div>

          <button
            className="w-full rounded-md bg-amber-500 px-4 py-2 font-semibold text-black hover:bg-amber-400"
            data-testid="login-button"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-sm text-zinc-400">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-amber-400 underline decoration-transparent transition-all duration-200 hover:decoration-amber-500"
            data-testid="register-link"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
