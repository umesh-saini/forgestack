import React, { useEffect } from 'react';
import { RealTech3DHero } from './RealTech3DHero.js';
import { VelocityMarquee } from './VelocityMarquee.js';
import { ArchitecturalBlueprints } from './ArchitecturalBlueprints.js';
import { ThreeFigureShowcase } from './ThreeFigureShowcase.js';
import { DesktopAppShowcase } from './DesktopAppShowcase.js';
import { ChangelogTimeline } from './ChangelogTimeline.js';
import { DownloadInstallHub } from './DownloadInstallHub.js';
import { LandingFooter } from './LandingFooter.js';
import { ScrollProgress } from './ScrollProgress.js';

export const LandingPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] overflow-x-clip selection:bg-orange-500/30 selection:text-white">
      {/* 1. Top Scroll Progress Telemetry Bar */}
      <ScrollProgress />

      {/* 2. Real Tech 3D Architecture Motherboard Hero */}
      <RealTech3DHero />

      {/* 3. Engineering Primitives Marquee */}
      <VelocityMarquee />

      {/* 4. Sticky Scroll-Driven 3D Primitives Showcase */}
      <ThreeFigureShowcase />

      {/* 5. Native Desktop Studio Suite with Real Production Screenshots */}
      <DesktopAppShowcase />

      {/* 6. Engineering CAD Schematics & AST Mechanics */}
      <ArchitecturalBlueprints />

      {/* 7. Concrete Release Changelogs & Roadmap */}
      <ChangelogTimeline />

      {/* 8. Binary Downloads (.deb / AppImage) & CLI Hub */}
      <DownloadInstallHub />

      {/* 9. Minimalist Engineering Footer */}
      <LandingFooter />
    </div>
  );
};
