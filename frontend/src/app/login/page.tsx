"use client";

import { useRouter } from "next/navigation";
import LoginPage from "../login";

export default function LoginRoute() {
  const router = useRouter();

  const handleBack = () => router.push("/");
  const handleLogin = (userType: "student" | "volunteer" | "admin", _userData: any) => {
    // Simple post-login navigation based on role (no auth)
    if (userType === "student") {
      router.push("/StudentDashboard");
      return;
    }

    if (userType === "volunteer") {
      router.push("/volunteerDashboard");
      return;
    }

    // admin (previously organizer) -> organizer dashboard
    router.push("/organizerDashboard");
  };

  const handleSwitchToSignup = () => router.push("/signup");

  return (
    <LoginPage onBack={handleBack} onLogin={handleLogin} onSwitchToSignup={handleSwitchToSignup} />
  );
}
