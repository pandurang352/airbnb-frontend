
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

export default function ListingCard({ listing, showTax }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const price = showTax
    ? Math.round(listing.price * 1.18)
    : listing.price;

  useEffect(() => {
    let active = true;

    setIsWishlisted(false);

    if (!user || !listing?._id) return;

    api("/listings/wishlist")
      .then((wishlist) => {
        if (active) {
          setIsWishlisted(
            wishlist.some((item) => item._id === listing._id)
          );
        }
      })
      .catch((err) => {
        console.error("Could not load wishlist status:", err);
      });

    return () => {
      active = false;
    };
  }, [user, listing?._id]);

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate("/login");
      return;
    }

    if (wishlistLoading) return;

    setWishlistLoading(true);

    try {
      if (isWishlisted) {
        await api(`/listings/wishlist/${listing._id}`, {
          method: "DELETE",
        });

        setIsWishlisted(false);
      } else {
        await api(`/listings/wishlist/${listing._id}`, {
          method: "POST",
        });

        setIsWishlisted(true);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <Link to={`/listings/${listing._id}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100">
        <img
          src={listing.image?.url}
          alt={listing.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
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
          className="absolute right-3 top-3 z-10 rounded-full bg-white/95 p-2.5 shadow-md transition hover:scale-110 disabled:opacity-60"
        >
          {isWishlisted ? (
            <FaHeart className="text-lg text-rose-500" />
          ) : (
            <FaRegHeart className="text-lg text-gray-700" />
          )}
        </button>
      </div>

      <div className="mt-3">
        <h3 className="line-clamp-1 font-semibold">{listing.title}</h3>

        <p className="text-sm text-gray-500">
          📍 {listing.location}
        </p>

        <p className="mt-1 text-sm">
          <span className="font-semibold">
            ₹{price.toLocaleString("en-IN")}
          </span>{" "}
          night

          {showTax && (
            <span className="text-gray-500"> (incl. 18% tax)</span>
          )}
        </p>
      </div>
    </Link>
  );
}
