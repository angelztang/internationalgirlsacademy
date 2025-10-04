"use client";

import { useRouter } from "next/navigation";
import SignupPage from "../signup";
import { useAuth } from "@/context/AuthContext";

export default function SignupRoute() {
  const router = useRouter();
  const { signup } = useAuth();

  const handleBack = () => router.push("/");

  const handleSignupSuccess = (userType: "student" | "volunteer" | "admin", userData: any) => {
    // Store user data in AuthContext
    signup({
      id: userData.userId,
      name: userData.name,
      email: userData.email,
      userType: userData.userType,
      experiencePoints: userData.profile?.experience_points,
      accessToken: userData.accessToken
    });

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
