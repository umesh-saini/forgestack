import React, { useEffect } from 'react';
import { HeroKinetic } from './HeroKinetic.js';
import { VelocityMarquee } from './VelocityMarquee.js';
import { InteractiveStackSimulator } from './InteractiveStackSimulator.js';
import { DesktopAppShowcase } from './DesktopAppShowcase.js';
import { FeatureSpotlight } from './FeatureSpotlight.js';
import { CompetitorMatrix } from './CompetitorMatrix.js';
import { ChangelogTimeline } from './ChangelogTimeline.js';
import { DownloadInstallHub } from './DownloadInstallHub.js';
import { LandingFooter } from './LandingFooter.js';

export const LandingPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] overflow-x-hidden animate-in fade-in duration-200">
      {/* 1. Kinetic Hero */}
      <HeroKinetic />

      {/* 2. Velocity Tech Marquee */}
      <VelocityMarquee />

      {/* 3. Live 4-in-1 Stack Simulator Playground */}
      <InteractiveStackSimulator />

      {/* 4. Desktop Application Studio Showcase */}
      <DesktopAppShowcase />

      {/* 5. Architectural Feature Spotlights */}
      <FeatureSpotlight />

      {/* 6. Competitor Comparison Matrix */}
      <CompetitorMatrix />

      {/* 7. Changelogs & Roadmap Timeline */}
      <ChangelogTimeline />

      {/* 8. Binary Download & CLI Hub */}
      <DownloadInstallHub />

      {/* 9. Clean Footer */}
      <LandingFooter />
    </div>
  );
};
