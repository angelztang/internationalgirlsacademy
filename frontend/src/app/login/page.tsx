"use client";

import { useRouter } from "next/navigation";
import LoginPage from "../login";
import { useAuth } from "@/context/AuthContext";

export default function LoginRoute() {
  const router = useRouter();
  const { login } = useAuth();

  const handleBack = () => router.push("/");
  const handleLogin = (userType: "student" | "volunteer" | "admin", userData: any) => {
    // Store user data in AuthContext
    login({
      id: userData.userId,
      name: userData.name,
      email: userData.email,
      userType: userData.userType,
      experiencePoints: userData.profile?.experience_points,
      accessToken: userData.accessToken
    });

    // Navigate based on role
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
