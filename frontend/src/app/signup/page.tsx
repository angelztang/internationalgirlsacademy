"use client";

import { useRouter, useSearchParams } from "next/navigation";
import SignupPage from "../signup";
import { useAuth } from "@/context/AuthContext";

export default function SignupRoute() {
  const router = useRouter();
  const searchParams = useSearchParams();
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

    // Check if there's a redirect parameter
    const redirectPath = searchParams?.get('redirect');
    if (redirectPath) {
      router.push(redirectPath);
      return;
    }

    // Default navigation based on role
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

  const handleSwitchToLogin = () => {
    // Preserve redirect parameter when switching to login
    const redirectPath = searchParams?.get('redirect');
    if (redirectPath) {
      router.push(`/login?redirect=${encodeURIComponent(redirectPath)}`);
    } else {
      router.push("/login");
    }
  };

  return (
    <SignupPage
      onBack={handleBack}
      onSignupSuccess={handleSignupSuccess}
      onSwitchToLogin={handleSwitchToLogin}
    />
  );
}
