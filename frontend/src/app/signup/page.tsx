"use client";

import { useRouter } from "next/navigation";
import SignupPage from "../signup";

export default function SignupRoute() {
  const router = useRouter();

  const handleBack = () => router.push("/");

  const handleSignupSuccess = (userType: "student" | "volunteer" | "admin", _userData: any) => {
    // Navigate to appropriate dashboard after successful signup
    if (userType === "student") {
      router.push("/StudentDashboard");
      return;
    }

    if (userType === "volunteer") {
      router.push("/volunteerDashboard");
      return;
    }

    // admin
    router.push("/organizerDashboard");
  };

  const handleSwitchToLogin = () => router.push("/login");

  return (
    <SignupPage
      onBack={handleBack}
      onSignupSuccess={handleSignupSuccess}
      onSwitchToLogin={handleSwitchToLogin}
    />
  );
}
