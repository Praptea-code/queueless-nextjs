import { Hero } from "@/components/landing/Hero";
import { FeatureCards } from "@/components/landing/FeatureCards";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <div className="bg-dots">
      <Hero />
      <FeatureCards />
      <Footer />
    </div>
  );
}