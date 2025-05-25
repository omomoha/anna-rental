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

export default function ApartmentDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [listing, setListing] = useState<Listing | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (id !== undefined) {
      const stored = JSON.parse(localStorage.getItem("myListings") || "[]");
      const idx = parseInt(id as string);
      if (!isNaN(idx) && stored[idx]) {
        setListing(stored[idx]);
      }
    }
  }, [id]);

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!checkIn || !checkOut) {
      setError("Please select check-in and check-out dates.");
      return;
    }
    if (checkIn > checkOut) {
      setError("Check-out date must be after check-in date.");
      return;
    }
    const booking = {
      apartment: listing,
      checkIn,
      checkOut,
      guests,
      createdAt: new Date().toISOString(),
    };
    const bookings = JSON.parse(localStorage.getItem("myBookings") || "[]");
    bookings.push(booking);
    localStorage.setItem("myBookings", JSON.stringify(bookings));
    setSuccess("Booking confirmed!");
    setShowBooking(false);
    setCheckIn(""); setCheckOut(""); setGuests(1);
    setTimeout(() => setSuccess(""), 2000);
  };

  if (!listing) return <div style={{ padding: 24 }}>Loading...</div>;

  return (
    <div style={{ maxWidth: 700, margin: "auto", padding: 24 }}>
      <h2>{listing.title}</h2>
      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        {listing.images && listing.images.map((src, i) => (
          <img key={i} src={src} alt="apartment" width={120} height={90} style={{ objectFit: "cover", borderRadius: 6 }} />
        ))}
      </div>
      <p><b>Description:</b> {listing.description}</p>
      <p><b>Location:</b> {listing.location}</p>
      <p><b>Amenities:</b> {listing.amenities.join(", ")}</p>
      <p><b>Price per night:</b> ₦{listing.price}</p>
      <p><b>Availability:</b> {listing.availability.from} to {listing.availability.to}</p>
      {!showBooking ? (
        <button onClick={() => setShowBooking(true)} style={{ width: 200, margin: "16px 0" }}>Book Now</button>
      ) : (
        <form onSubmit={handleBook} style={{ border: "1px solid #ccc", padding: 16, borderRadius: 8, marginTop: 16, maxWidth: 400 }}>
          <h3>Book Apartment</h3>
          <label>Check-in Date:<br />
            <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} required style={{ width: "100%", marginBottom: 8 }} />
          </label>
          <label>Check-out Date:<br />
            <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} required style={{ width: "100%", marginBottom: 8 }} />
          </label>
          <label>Guests:<br />
            <input type="number" min={1} value={guests} onChange={e => setGuests(Number(e.target.value))} required style={{ width: "100%", marginBottom: 8 }} />
          </label>
          <button type="submit" style={{ width: "100%" }}>Confirm Booking</button>
          <button type="button" onClick={() => setShowBooking(false)} style={{ width: "100%", marginTop: 8 }}>Cancel</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      )}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
} 