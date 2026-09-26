import AnnouncementBar from "./components/AnnouncementBar";
import Header from "./components/Header";
import Hero from "./components/Hero";
import StatsStrip from "./components/StatsStrip";
import Estimator from "./components/Estimator";
import ServiceGrid from "./components/ServiceGrid";
import HowItWorks from "./components/HowItWorks";
import BeforeAfterSlider from "./components/BeforeAfterSlider";
import TierComparison from "./components/TierComparison";
import CityMarquee from "./components/CityMarquee";
import SocialProof from "./components/SocialProof";
import Footer from "./components/Footer";
import SnowBoundary from "./components/SnowBoundary";

const SECTIONS = [Hero, StatsStrip, Estimator, ServiceGrid, HowItWorks, BeforeAfterSlider, TierComparison, CityMarquee, SocialProof];

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-50">
        <AnnouncementBar />
        <Header />
      </div>
      <main>
        {SECTIONS.map((Section, i) => (
          <SnowBoundary key={i}>
            <Section />
          </SnowBoundary>
        ))}
      </main>
      <SnowBoundary>
        <Footer />
      </SnowBoundary>
    </div>
  );
}
