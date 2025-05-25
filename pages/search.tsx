import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

const AMENITIES = ["Wi-Fi", "AC", "TV", "Kitchen", "Parking", "Washer", "Generator"];

interface Listing {
  title: string;
  description: string;
  location: string;
  amenities: string[];
  price: string;
  availability: { from: string; to: string };
  images: string[];
  createdAt: string;
  status?: "Active" | "Paused";
}

export default function Search() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [filtered, setFiltered] = useState<Listing[]>([]);
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("myListings") || "[]");
    setListings(stored.filter((l: Listing) => l.status !== "Paused"));
    setFiltered(stored.filter((l: Listing) => l.status !== "Paused"));
  }, []);

  const handleAmenityChange = (amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    let results = listings;
    if (location) {
      results = results.filter(l => l.location.toLowerCase().includes(location.toLowerCase()));
    }
    if (minPrice) {
      results = results.filter(l => parseFloat(l.price) >= parseFloat(minPrice));
    }
    if (maxPrice) {
      results = results.filter(l => parseFloat(l.price) <= parseFloat(maxPrice));
    }
    if (dateFrom) {
      results = results.filter(l => !l.availability.from || l.availability.from <= dateFrom);
    }
    if (dateTo) {
      results = results.filter(l => !l.availability.to || l.availability.to >= dateTo);
    }
    if (amenities.length > 0) {
      results = results.filter(l => amenities.every(a => l.amenities.includes(a)));
    }
    setFiltered(results);
  };

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 24 }}>
      <h2>Find a place to stay</h2>
      <form onSubmit={handleSearch} style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        <input type="text" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} style={{ flex: 1, minWidth: 180 }} />
        <input type="number" placeholder="Min Price" value={minPrice} onChange={e => setMinPrice(e.target.value)} style={{ width: 120 }} />
        <input type="number" placeholder="Max Price" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} style={{ width: 120 }} />
        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ width: 150 }} />
        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ width: 150 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {AMENITIES.map(a => (
            <label key={a} style={{ fontSize: 12 }}>
              <input type="checkbox" checked={amenities.includes(a)} onChange={() => handleAmenityChange(a)} /> {a}
            </label>
          ))}
        </div>
        <button type="submit" style={{ minWidth: 100 }}>Search</button>
      </form>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
        {filtered.length === 0 ? (
          <p>No apartments found.</p>
        ) : (
          filtered.map((listing, idx) => (
            <div key={idx} style={{ border: "1px solid #ccc", borderRadius: 8, width: 270, padding: 12, background: "#fafafa" }}>
              {listing.images && listing.images[0] && (
                <img src={listing.images[0]} alt="listing" width={246} height={140} style={{ objectFit: "cover", borderRadius: 6 }} />
              )}
              <h3 style={{ margin: "8px 0 4px 0" }}>{listing.title}</h3>
              <p style={{ margin: 0, fontWeight: 600 }}>₦{listing.price} / night</p>
              <p style={{ fontSize: 13, margin: "4px 0 8px 0" }}>{listing.description.slice(0, 60)}...</p>
              <button onClick={() => router.push(`/apartment/${listings.indexOf(listing)}`)} style={{ width: "100%" }}>View Details</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 