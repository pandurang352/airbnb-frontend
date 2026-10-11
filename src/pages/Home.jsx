import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../api";
import ListingCard from "../components/ListingCard";

export default function Home() {
  const [params] = useSearchParams();
  const search = params.get("search") || "";
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showTax, setShowTax] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError("");
    api(`/listings${search ? `?search=${encodeURIComponent(search)}` : ""}`)
      .then(setListings)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [search]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-lg font-semibold">
          {search ? `Results for "${search}"` : "Explore stays"}
        </h1>
        <label className="flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm">
          <input
            type="checkbox"
            checked={showTax}
            onChange={(e) => setShowTax(e.target.checked)}
            className="accent-rose-500"
          />
          Display total after taxes
        </label>
      </div>

      {loading && <p className="py-20 text-center text-gray-500">Loading...</p>}
      {error && <p className="rounded bg-red-50 p-3 text-red-600">{error}</p>}

      {!loading && !error && listings.length === 0 && (
        <div className="py-20 text-center">
          <h3 className="text-xl font-semibold">No listings found</h3>
          <Link to="/listings/new" className="mt-4 inline-block rounded-lg bg-rose-500 px-5 py-2.5 font-semibold text-white">
            Create Listing
          </Link>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {listings.map((l) => (
          <ListingCard key={l._id} listing={l} showTax={showTax} />
        ))}
      </div>
    </div>
  );
}