import React, { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useRouter } from "next/router";

const AMENITIES = ["Wi-Fi", "AC", "TV", "Kitchen", "Parking", "Washer", "Generator"];

export default function NewListing() {
  useAuth("landlord");
  const router = useRouter();
  const editIdx = typeof router.query.edit === 'string' ? parseInt(router.query.edit) : undefined;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [price, setPrice] = useState("");
  const [availability, setAvailability] = useState({ from: "", to: "" });
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Prefill form if editing
  useEffect(() => {
    if (editIdx !== undefined && !isNaN(editIdx)) {
      const stored = JSON.parse(localStorage.getItem("myListings") || "[]");
      const listing = stored[editIdx];
      if (listing) {
        setTitle(listing.title || "");
        setDescription(listing.description || "");
        setLocation(listing.location || "");
        setAmenities(listing.amenities || []);
        setPrice(listing.price || "");
        setAvailability(listing.availability || { from: "", to: "" });
        setImagePreviews(listing.images || []);
        setIsEditing(true);
      }
    }
  }, [editIdx]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
      setImagePreviews(Array.from(e.target.files).map(img => URL.createObjectURL(img)));
    }
  };

  const handleAmenityChange = (amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const handlePreview = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!title || !description || !location || !price || !availability.from || !availability.to) {
      setError("Please fill all required fields.");
      return;
    }
    if ((images.length + imagePreviews.length) < 3) {
      setError("Please upload at least 3 images.");
      return;
    }
    setPreview(true);
  };

  const handlePublish = () => {
    const newImages = images.length > 0 ? images.map(img => URL.createObjectURL(img)) : imagePreviews;
    const listing = {
      title,
      description,
      location,
      amenities,
      price,
      availability,
      images: newImages,
      createdAt: new Date().toISOString(),
    };
    const listings = JSON.parse(localStorage.getItem("myListings") || "[]");
    if (isEditing && editIdx !== undefined && !isNaN(editIdx)) {
      listings[editIdx] = listing;
    } else {
      listings.push(listing);
    }
    localStorage.setItem("myListings", JSON.stringify(listings));
    setSuccess(isEditing ? "Listing updated!" : "Listing published!");
    setPreview(false);
    setTitle(""); setDescription(""); setLocation(""); setAmenities([]); setPrice(""); setAvailability({ from: "", to: "" }); setImages([]); setImagePreviews([]); setIsEditing(false);
    setTimeout(() => {
      setSuccess("");
      router.push("/dashboard/landlord/listings");
    }, 1000);
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 24 }}>
      <h2>{isEditing ? "Edit Apartment Listing" : "New Apartment Listing"}</h2>
      {!preview ? (
        <form onSubmit={handlePreview}>
          <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required style={{ width: "100%", marginBottom: 8 }} />
          <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required style={{ width: "100%", marginBottom: 8 }} />
          <input type="text" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} required style={{ width: "100%", marginBottom: 8 }} />
          <div style={{ marginBottom: 8 }}>
            <span>Amenities:</span><br />
            {AMENITIES.map(a => (
              <label key={a} style={{ marginRight: 12 }}>
                <input type="checkbox" checked={amenities.includes(a)} onChange={() => handleAmenityChange(a)} /> {a}
              </label>
            ))}
          </div>
          <input type="number" placeholder="Price per night (₦)" value={price} onChange={e => setPrice(e.target.value)} required style={{ width: "100%", marginBottom: 8 }} />
          <div style={{ marginBottom: 8 }}>
            <span>Availability:</span><br />
            <input type="date" value={availability.from} onChange={e => setAvailability({ ...availability, from: e.target.value })} required />
            <span style={{ margin: "0 8px" }}>to</span>
            <input type="date" value={availability.to} onChange={e => setAvailability({ ...availability, to: e.target.value })} required />
          </div>
          <div style={{ marginBottom: 8 }}>
            <span>Upload Images (min 3):</span><br />
            <input type="file" accept="image/*" multiple onChange={handleImageChange} />
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              {imagePreviews.map((src, i) => (
                <img key={i} src={src} alt="preview" width={60} height={60} style={{ objectFit: "cover" }} />
              ))}
              {images.map((img, i) => (
                <img key={i + imagePreviews.length} src={URL.createObjectURL(img)} alt="preview" width={60} height={60} style={{ objectFit: "cover" }} />
              ))}
            </div>
          </div>
          <button type="submit" style={{ width: "100%" }}>{isEditing ? "Preview Update" : "Preview"}</button>
        </form>
      ) : (
        <div style={{ border: "1px solid #ccc", padding: 16, borderRadius: 8 }}>
          <h3>Preview Listing</h3>
          <p><b>Title:</b> {title}</p>
          <p><b>Description:</b> {description}</p>
          <p><b>Location:</b> {location}</p>
          <p><b>Amenities:</b> {amenities.join(", ")}</p>
          <p><b>Price per night:</b> ₦{price}</p>
          <p><b>Availability:</b> {availability.from} to {availability.to}</p>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            {imagePreviews.map((src, i) => (
              <img key={i} src={src} alt="preview" width={80} height={80} style={{ objectFit: "cover" }} />
            ))}
            {images.map((img, i) => (
              <img key={i + imagePreviews.length} src={URL.createObjectURL(img)} alt="preview" width={80} height={80} style={{ objectFit: "cover" }} />
            ))}
          </div>
          <button onClick={handlePublish} style={{ width: "100%", marginBottom: 8 }}>{isEditing ? "Update Listing" : "Publish"}</button>
          <button onClick={() => setPreview(false)} style={{ width: "100%" }}>Back to Edit</button>
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
} 