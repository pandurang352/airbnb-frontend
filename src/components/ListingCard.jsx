import { Link } from "react-router-dom";

export default function ListingCard({ listing, showTax }) {
  const price = showTax ? Math.round(listing.price * 1.18) : listing.price;
  return (
    <Link to={`/listings/${listing._id}`} className="group block">
      <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100">
        <img
          src={listing.image?.url}
          alt={listing.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="mt-3">
        <h3 className="line-clamp-1 font-semibold">{listing.title}</h3>
        <p className="text-sm text-gray-500">📍 {listing.location}</p>
        <p className="mt-1 text-sm">
          <span className="font-semibold">₹{price.toLocaleString("en-IN")}</span> night
          {showTax && <span className="text-gray-500"> (incl. 18% tax)</span>}
        </p>
      </div>
    </Link>
  );
}