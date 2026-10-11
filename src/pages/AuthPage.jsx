import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const inputCls = "w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-rose-500";

export default function AuthPage({ mode }) {
  const isLogin = mode === "login";
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (isLogin) await login({ username: form.username, password: form.password });
      else await signup(form);
      navigate(location.state?.from || "/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto mt-6 max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
      <div className="bg-neutral-800 py-4 text-center text-xl font-semibold text-white">
        {isLogin ? "Login to StayEasy" : "Join StayEasy"}
      </div>
      <form onSubmit={onSubmit} className="space-y-4 p-6">
        {error && <p className="rounded bg-red-50 p-3 text-sm text-red-600">{error}</p>}

        <input name="username" placeholder="Username" value={form.username} onChange={onChange} required className={inputCls} />
        {!isLogin && (
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={onChange} required className={inputCls} />
        )}
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={onChange} required className={inputCls} />

        <button disabled={busy} className="w-full rounded-lg bg-rose-500 py-2.5 font-semibold text-white disabled:opacity-60">
          {busy ? "Please wait..." : isLogin ? "Login" : "Create Account"}
        </button>

        <p className="text-center text-sm text-gray-500">
          {isLogin ? "No account? " : "Already registered? "}
          <Link to={isLogin ? "/signup" : "/login"} className="text-rose-500 underline">
            {isLogin ? "Sign up" : "Login"}
          </Link>
        </p>
      </form>
    </div>
  );
}