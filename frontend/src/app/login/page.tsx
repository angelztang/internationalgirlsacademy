"use client";

import { useRouter } from "next/navigation";
import LoginPage from "../login";

export default function LoginRoute() {
  const router = useRouter();

  const handleBack = () => router.push("/");
  const handleLogin = (_userType: "student" | "volunteer" | "organizer", _userData: any) => {
    // TODO: replace with real post-login navigation
    router.push("/");
  };

  const handleSwitchToSignup = () => router.push("/signup");

  return (
    <LoginPage onBack={handleBack} onLogin={handleLogin} onSwitchToSignup={handleSwitchToSignup} />
  );
}
