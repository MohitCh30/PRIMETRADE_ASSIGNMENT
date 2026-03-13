import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/v1/auth/register",
        { name, email, password }
      );

      setMessage("Registration successful!");
      setTimeout(() => navigate("/"), 1500);

    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">

      <div className="card p-4 shadow" style={{ width: "350px" }}>
        <h3 className="text-center mb-3">Register</h3>

        {message && <div className="alert alert-info">{message}</div>}

        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              className="form-control"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-success w-100">Register</button>
        </form>

        <p className="text-center mt-3">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>

    </div>
  );
}

export default Register;