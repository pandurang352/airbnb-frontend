
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import Reviews from "../components/Reviews";

export default function ListingDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [error, setError] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const load = () =>
    api(`/listings/${id}`)
      .then(setListing)
      .catch((e) => setError(e.message));

  // Load listing and check its saved wishlist status
  useEffect(() => {
    setError("");
    setListing(null);
    setIsWishlisted(false);

    load();

    if (!user) return;

    api("/listings/wishlist")
      .then((wishlist) => {
        setIsWishlisted(
          wishlist.some((item) => item._id === id)
        );
      })
      .catch((e) => {
        console.error("Could not load wishlist status:", e);
      });
  }, [id, user]);

  const onDelete = async () => {
    if (!confirm("Delete this listing?")) return;

    try {
      await api(`/listings/${id}`, { method: "DELETE" });
      navigate("/");
    } catch (e) {
      alert(e.message);
    }
  };

  const toggleWishlist = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (wishlistLoading) return;

    setWishlistLoading(true);

    try {
      if (isWishlisted) {
        await api(`/listings/wishlist/${id}`, {
          method: "DELETE",
        });

        setIsWishlisted(false);
      } else {
        await api(`/listings/wishlist/${id}`, {
          method: "POST",
        });

        setIsWishlisted(true);
      }
    } catch (e) {
      alert(e.message);
    } finally {
      setWishlistLoading(false);
    }
  };

  if (error) {
    return (
      <p className="rounded bg-red-50 p-3 text-red-600">
        {error}
      </p>
    );
  }

  if (!listing) {
    return (
      <p className="py-20 text-center text-gray-500">
        Loading...
      </p>
    );
  }

  const isOwner =
    user && listing.author && user._id === listing.author._id;

  return (
    <div>
      <Link to="/" className="text-sm text-gray-500 hover:underline">
        ← Back to listings
      </Link>

      <h1 className="mt-3 text-2xl font-bold">{listing.title}</h1>

      <p className="mb-4 text-gray-500">
        📍 {listing.location}, {listing.country}
      </p>

      <div className="relative overflow-hidden rounded-2xl bg-gray-100">
        <img
          src={listing.image?.url}
          alt={listing.title}
          className="h-52 w-full object-cover sm:h-80"
        />

        <button
          type="button"
          onClick={toggleWishlist}
          disabled={wishlistLoading}
          aria-label={
            isWishlisted ? "Remove from wishlist" : "Add to wishlist"
          }
          aria-pressed={isWishlisted}
          title={
            isWishlisted ? "Remove from wishlist" : "Add to wishlist"
          }
          className="absolute right-4 top-4 z-10 rounded-full bg-white p-3 shadow-md transition hover:scale-110 disabled:cursor-wait disabled:opacity-60"
        >
          {isWishlisted ? (
            <FaHeart className="text-xl text-rose-500" />
          ) : (
            <FaRegHeart className="text-xl text-gray-700" />
          )}
        </button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Hosted by {listing.author?.username || "Unknown"}
            </h2>

            {isOwner && (
              <div className="flex gap-2">
                <Link
                  to={`/listings/${id}/edit`}
                  className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white"
                >
                  Edit
                </Link>

                <button
                  onClick={onDelete}
                  className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          <p className="mt-4 whitespace-pre-line text-gray-700">
            {listing.description}
          </p>

          <Reviews listing={listing} onChange={load} />
        </div>

        <aside className="h-fit rounded-2xl border p-6 shadow-lg lg:sticky lg:top-24">
          <p className="text-3xl font-bold text-rose-500">
            ₹{listing.price?.toLocaleString("en-IN")}
            <span className="text-base font-normal text-gray-500">
              {" "}/ night
            </span>
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <input type="date" className="rounded-lg border p-2 text-sm" />
            <input type="date" className="rounded-lg border p-2 text-sm" />
          </div>

          <button
            onClick={() =>
              alert("Booking will be integrated with a payment gateway.")
            }
            className="mt-4 w-full rounded-xl bg-rose-500 py-3 font-semibold text-white hover:bg-rose-600"
          >
            Reserve Now
          </button>
        </aside>
      </div>
    </div>
  );
}
