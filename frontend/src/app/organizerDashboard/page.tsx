"use client";

import { useRouter } from "next/navigation";
import { OrganizerDashboard } from "../organizerDashboard";

export default function OrganizerDashboardRoute() {
  const router = useRouter();

  const mockUser = {
    name: "Dr. Jennifer Lee",
    email: "jennifer.lee@example.com",
  };

  const handleLogout = () => {
    // simple logout handler for now — redirect to home
    router.push("/");
  };

  return <OrganizerDashboard userData={mockUser} onLogout={handleLogout} />;
}
