import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../components/context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import s from "../styles/login.module.css";

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [pwd, setPwd] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !pwd) {
      setFeedback("All fields are required!");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/auth/user/login",
        {
          username,
          password: pwd,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Login successful");
      login(res.data.access_token, res.data.username);
      setFeedback("Successfully logged in. Redirecting...");
      setTimeout(() => navigate("/logs"), 1500);
    } catch (err) {
      if (err.response?.data?.detail) {
        setFeedback("Error: " + err.response.data.detail);
      } else {
        setFeedback("Network Error: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s.body}>
      <div className={s.container}>
        <h3>Login</h3>
        <form className={s.form} onSubmit={handleLogin}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />

          <label htmlFor="pwd">Password</label>
          <input
            type="password"
            id="pwd"
            placeholder="Password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            required
            autoComplete="current-password"
          />

          {feedback && (
            <p
              style={{
                color:
                  feedback.toLowerCase().includes("success") ||
                  feedback.toLowerCase().includes("logged")
                    ? "green"
                    : "red",
              }}
            >
              {feedback}
            </p>
          )}

          <button type="submit" disabled={loading} className={`${s.submit_btn} ${loading? s.loading : ""}` }>
            {loading ? <span className={s.spinner}></span> : "Submit"}
          </button>
        </form>

        <p className={s.redirect}>
          Don’t have an account? <Link to="/signup">Signup</Link>
        </p>
      </div>
    </div>
  );
}