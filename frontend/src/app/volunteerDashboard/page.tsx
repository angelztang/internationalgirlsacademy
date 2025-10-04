"use client";

import { useRouter } from "next/navigation";
import VolunteerDashboard from "../volunteerDashboard";

export default function VolunteerDashboardRoute() {
  const router = useRouter();

  const mockUser = {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
  };

  const handleLogout = () => {
    // simple logout handler for now — redirect to login
    router.push("/login");
  };

  return <VolunteerDashboard userData={mockUser} onLogout={handleLogout} />;
}
