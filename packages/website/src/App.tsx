import { Header, Opening } from './sections/Opening.js';
import { StudioTour } from './sections/StudioTour.js';
import { StackRail, Verification } from './sections/Proof.js';
import { AiSetup, Cli, Estimates, Footer, Releases } from './sections/Use.js';
import { useTheme } from './ui.js';

export function App() {
  const { theme, toggle } = useTheme();
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-accent focus:px-3 focus:py-2 focus:text-on-accent"
      >
        Skip to content
      </a>
      <Header theme={theme} onToggleTheme={toggle} />
      <main id="main">
        <Opening theme={theme} />
        <StudioTour theme={theme} />
        <Verification />
        <StackRail />
        <Cli />
        <AiSetup />
        <Estimates />
        <Releases />
      </main>
      <Footer />
    </>
  );
}
