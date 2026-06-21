import { NeuralNoise } from "@/components/ui/neural-noise";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import KPIBar from "@/components/KPIBar";
import AppGrid from "@/components/AppGrid";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      {/* Fixed WebGL background — sits below all page content via z-index: 0 */}
      <NeuralNoise color={[1.0, 0.42, 0.17]} opacity={0.8} speed={0.0008} />

      {/* z-[1] puts this stacking context above the fixed canvas */}
      <main className="relative z-[1]">
        <Navbar />
        <HeroSection />
        <KPIBar />
        <AppGrid />
        <Footer />
      </main>
    </>
  );
}
