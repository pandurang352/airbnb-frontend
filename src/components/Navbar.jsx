import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const onSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (q) navigate(`/?search=${encodeURIComponent(q)}`);
    else navigate("/");
  };

  const onLogout = async () => {
    await logout();
    setOpen(false);
    navigate("/");
  };

  const linkCls = "rounded-full px-4 py-2 text-sm font-medium hover:bg-gray-100";

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4">
        <Link to="/" className="text-xl font-bold text-rose-500">🏠 StayEasy</Link>

        <form onSubmit={onSearch} className="hidden max-w-md flex-1 sm:block">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search destinations"
            className="w-full rounded-full border border-gray-300 px-5 py-2.5 text-sm shadow-sm outline-none focus:border-rose-500"
          />
        </form>

        <div className="hidden items-center gap-2 sm:flex">
          {user ? (
            <>
              <Link to="/listings/new" className={linkCls}>Add Listing</Link>
              <span className="text-sm text-gray-500">Hi, {user.username}</span>
              <button onClick={onLogout} className={linkCls}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className={linkCls}>Login</Link>
              <Link to="/signup" className={`${linkCls} border border-gray-300`}>Sign up</Link>
            </>
          )}
        </div>

        <button className="rounded p-2 text-xl sm:hidden" onClick={() => setOpen(!open)}>☰</button>
      </div>

      {open && (
        <div className="space-y-1 border-t bg-white px-4 py-3 sm:hidden" onClick={() => setOpen(false)}>
          <form onSubmit={onSearch} onClick={(e) => e.stopPropagation()} className="mb-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search destinations"
              className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm"
            />
          </form>
          {user ? (
            <>
              <Link to="/listings/new" className="block py-2">Add Listing</Link>
              <button onClick={onLogout} className="block py-2">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block py-2">Login</Link>
              <Link to="/signup" className="block py-2">Sign up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}