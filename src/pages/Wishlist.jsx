
import { useEffect, useState } from "react";
import { api } from "../api";
import ListingCard from "../components/ListingCard";

export default function Wishlist() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true)
  
const removeFromWishlist = async (listingId) => {
  try {
    await api(`/listings/wishlist/${listingId}`, {
      method: "DELETE",
    });

    setListings((prevListings) =>
      prevListings.filter((listing) => listing._id !== listingId)
    );
  } catch (err) {
    console.error(err);
  }
};
;


useEffect(() => {
  api("/listings/wishlist")
    .then((data) => setListings(data))
    .catch((err) => console.error(err))
    .finally(() => setLoading(false));
}, []);


if (loading) {
  return <p>Loading wishlist...</p>;
}

return (
  <div>
    <h1 className="mb-6 text-2xl font-bold">My Wishlist ❤️</h1>

    {listings.length === 0 ? (
      <p>You haven't added any listings to your wishlist yet.</p>
    ) : (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {listings.map((listing) => (
          <ListingCard
            key={listing._id}
            listing={listing}
            showTax={false}
          />
        ))}
      </div>
    )}
  </div>
);

}
