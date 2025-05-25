import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface Booking {
  apartment: any;
  checkIn: string;
  checkOut: string;
  guests: number;
  createdAt: string;
}

export default function TenantBookings() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [now, setNow] = useState<string>("");

  useEffect(() => {
    setNow(new Date().toISOString().slice(0, 10));
    const stored = JSON.parse(localStorage.getItem("myBookings") || "[]");
    setBookings(stored);
  }, []);

  const handleCancel = (idx: number) => {
    const newBookings = bookings.filter((_, i) => i !== idx);
    setBookings(newBookings);
    localStorage.setItem("myBookings", JSON.stringify(newBookings));
  };

  const upcoming = bookings.filter(b => b.checkIn >= now);
  const past = bookings.filter(b => b.checkIn < now);

  return (
    <div style={{ maxWidth: 700, margin: "auto", padding: 24 }}>
      <h2>My Bookings</h2>
      <h3>Upcoming</h3>
      {upcoming.length === 0 ? <p>No upcoming bookings.</p> : (
        upcoming.map((b, idx) => (
          <div key={idx} style={{ border: "1px solid #ccc", borderRadius: 8, padding: 16, marginBottom: 16 }}>
            <h4>{b.apartment?.title}</h4>
            <p>Check-in: {b.checkIn}</p>
            <p>Check-out: {b.checkOut}</p>
            <button onClick={() => router.push(`/apartment/${b.apartment ? b.apartment.id ?? '' : ''}`)} style={{ marginRight: 8 }}>View Details</button>
            <button onClick={() => handleCancel(bookings.indexOf(b))}>Cancel</button>
          </div>
        ))
      )}
      <h3>Past</h3>
      {past.length === 0 ? <p>No past bookings.</p> : (
        past.map((b, idx) => (
          <div key={idx} style={{ border: "1px solid #eee", borderRadius: 8, padding: 16, marginBottom: 16, background: "#fafafa" }}>
            <h4>{b.apartment?.title}</h4>
            <p>Check-in: {b.checkIn}</p>
            <p>Check-out: {b.checkOut}</p>
            <button onClick={() => router.push(`/apartment/${b.apartment ? b.apartment.id ?? '' : ''}`)}>View Details</button>
          </div>
        ))
      )}
    </div>
  );
} 