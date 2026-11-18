import React, { useEffect } from 'react';
import { Interactive3DHero } from './Interactive3DHero.js';
import { VelocityMarquee } from './VelocityMarquee.js';
import { Interactive3DLaboratory } from './Interactive3DLaboratory.js';
import { ThreeFigureShowcase } from './ThreeFigureShowcase.js';
import { DesktopAppShowcase } from './DesktopAppShowcase.js';
import { ArchitecturalBlueprints } from './ArchitecturalBlueprints.js';
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

      {/* 2. Interactive 3D Architecture Core Hero (Immediate Awwwards-Caliber 3D Viewport) */}
      <Interactive3DHero />

      {/* 3. Engineering Primitives Marquee */}
      <VelocityMarquee />

      {/* 4. Interactive 3D Preset Morphing Laboratory */}
      <Interactive3DLaboratory />

      {/* 5. Sticky Scroll-Driven 3D Primitives Showcase */}
      <ThreeFigureShowcase />

      {/* 6. Native Desktop Suite with Real Studio Screenshots */}
      <DesktopAppShowcase />

      {/* 7. Engineering CAD Schematics & AST Mechanics (Replaces generic AI slop) */}
      <ArchitecturalBlueprints />

      {/* 8. Concrete Release Changelogs & Roadmap */}
      <ChangelogTimeline />

      {/* 9. Binary Downloads (.deb / AppImage) & CLI Hub */}
      <DownloadInstallHub />

      {/* 10. Minimalist Engineering Footer */}
      <LandingFooter />
    </div>
  );
};
