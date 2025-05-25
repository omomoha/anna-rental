import { useAuth } from "../../hooks/useAuth";

export default function TenantDashboard() {
  useAuth("tenant");
  return (
    <div style={{ padding: 24 }}>
      <h2>Tenant Dashboard</h2>
      <p>Welcome, Tenant!</p>
    </div>
  );
} 