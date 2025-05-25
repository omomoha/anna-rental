import { useAuth } from "../../hooks/useAuth";

export default function LandlordDashboard() {
  useAuth("landlord");
  return (
    <div style={{ padding: 24 }}>
      <h2>Landlord Dashboard</h2>
      <p>Welcome, Landlord!</p>
    </div>
  );
} 