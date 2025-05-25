import React, { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useRouter } from "next/router";

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

export default function LandlordListings() {
  useAuth("landlord");
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("myListings") || "[]");
    setListings(
      stored.map((l: any) => {
        const status: "Active" | "Paused" = l.status === "Paused" ? "Paused" : "Active";
        return { ...l, status } as Listing;
      })
    );
  }, []);

  const saveListings = (newListings: Listing[]) => {
    setListings(newListings);
    localStorage.setItem("myListings", JSON.stringify(newListings));
  };

  const handleDelete = (idx: number) => {
    const newListings = listings.filter((_, i) => i !== idx);
    saveListings(newListings);
  };

  const handleToggleStatus = (idx: number) => {
    const newListings = listings.map((l, i) =>
      i === idx ? { ...l, status: l.status === "Active" ? "Paused" : "Active" } : l
    );
    saveListings(newListings);
  };

  const handleEdit = (idx: number) => {
    router.push(`/dashboard/landlord/new-listing?edit=${idx}`);
  };

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 24 }}>
      <h2>My Listings</h2>
      <button onClick={() => router.push("/dashboard/landlord/new-listing")}>Create New Listing</button>
      <div style={{ marginTop: 24 }}>
        {listings.length === 0 ? (
          <p>No listings yet.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((listing, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #ccc" }}>
                  <td>
                    {listing.images && listing.images[0] && (
                      <img src={listing.images[0]} alt="listing" width={60} height={60} style={{ objectFit: "cover" }} />
                    )}
                  </td>
                  <td>{listing.title}</td>
                  <td>{listing.status || "Active"}</td>
                  <td>
                    <button onClick={() => handleEdit(idx)} style={{ marginRight: 8 }}>Edit</button>
                    <button onClick={() => handleDelete(idx)} style={{ marginRight: 8 }}>Delete</button>
                    <button onClick={() => handleToggleStatus(idx)}>
                      {listing.status === "Active" ? "Pause" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
} 