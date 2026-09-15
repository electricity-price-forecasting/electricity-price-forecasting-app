import "./Homepage.scss";
import { HeroSection } from "./HeroSection";
import { DashboardSection } from "./DashboardSection";
import { WorkflowSection } from "./WorkflowSection";
import { MarketSection } from "./DashboardSection/MarketSection";

export const Homepage = () => {
  return (
    <div className="homepage">
      <HeroSection />

      <main className="homepage__main">
        <section className="homepage__main__logo-box">
          <h4 className="homepage__main__logo-box__title">We are</h4>
          <div className="homepage__main__logo-box__logo-container"></div>
        </section>

        <DashboardSection />

        <WorkflowSection />

        <MarketSection />
      </main>
    </div>
  );
};
