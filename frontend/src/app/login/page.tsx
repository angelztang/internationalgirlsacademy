"use client";

export const dynamic = 'force-dynamic'

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoginPage from "../login";
import { useAuth } from "@/context/AuthContext";

function LoginRouteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
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

    // admin (previously organizer) -> organizer dashboard
    router.push("/organizerDashboard");
  };

  const handleSwitchToSignup = () => {
    // Preserve redirect parameter when switching to signup
    const redirectPath = searchParams?.get('redirect');
    if (redirectPath) {
      router.push(`/signup?redirect=${encodeURIComponent(redirectPath)}`);
    } else {
      router.push("/signup");
    }
  };

  return (
    <LoginPage onBack={handleBack} onLogin={handleLogin} onSwitchToSignup={handleSwitchToSignup} />
  );
}

export default function LoginRoute() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginRouteContent />
    </Suspense>
  );
}