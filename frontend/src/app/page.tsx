import Hero from "@/components/LandingPage/Hero";
import RoleCards from "@/components/LandingPage/RoleCards";
import Programs from "@/components/LandingPage/Programs";
import TrustIndicators from "@/components/LandingPage/TrustIndicators";
import Footer from "@/components/LandingPage/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from pink-50 to-pink-100">
      <Hero />
      <RoleCards />
      <Programs />
      <TrustIndicators />
      <Footer />
    </div>
  )
}