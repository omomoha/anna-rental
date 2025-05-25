import React, { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/search");
  }, [router]);
  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>Welcome to AnnA Rental</h1>
      <p>Redirecting to search...</p>
    </div>
  );
} 