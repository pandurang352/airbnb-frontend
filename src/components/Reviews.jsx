import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Reviews({ listing, onChange }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!rating) return setError("Please select a rating");
    try {
      await api(`/listings/${listing._id}/reviews`, {
        method: "POST",
        body: { review: { rating, comment } },
      });
      setRating(0);
      setComment("");
      onChange();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (reviewId) => {
    if (!confirm("Delete this review?")) return;
    try {
      await api(`/listings/${listing._id}/reviews/${reviewId}`, { method: "DELETE" });
      onChange();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <section className="mt-10">
      <h2 className="mb-4 text-xl font-semibold">Guest reviews ({listing.reviews.length})</h2>

      {user ? (
        <form onSubmit={submit} className="mb-8 space-y-3 rounded-2xl bg-gray-50 p-5">
          <div className="flex gap-1 text-3xl">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                type="button"
                key={n}
                onClick={() => setRating(n)}
                className={n <= rating ? "text-rose-500" : "text-gray-300"}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            rows={3}
            placeholder="Share your experience..."
            className="w-full rounded-lg border p-3 outline-none focus:border-rose-500"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="rounded-lg bg-rose-500 px-5 py-2 font-semibold text-white">Submit review</button>
        </form>
      ) : (
        <p className="mb-6 text-sm text-gray-500">
          <Link to="/login" className="text-rose-500 underline">Log in</Link> to leave a review.
        </p>
      )}

      {listing.reviews.length === 0 && <p className="text-gray-500">No reviews yet.</p>}

      <div className="space-y-4">
        {listing.reviews.map((r) => (
          <div key={r._id} className="rounded-2xl border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{r.author?.username || "Guest"}</p>
                <p className="text-xs text-gray-400">
                  {r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-IN") : ""}
                </p>
              </div>
              <p className="text-rose-500">{"★".repeat(r.rating)}<span className="text-gray-300">{"★".repeat(5 - r.rating)}</span></p>
            </div>
            <p className="mt-2 text-gray-700">{r.comment}</p>
            {user && r.author && user._id === r.author._id && (
              <button onClick={() => remove(r._id)} className="mt-2 text-sm text-red-500 hover:underline">Delete</button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}