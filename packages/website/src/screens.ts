// Real captures of ForgeStack Studio (1920×961, browser chrome cropped).
import hubDark from '../../../docs/screenshots/studio-hub-dark.png';
import hubLight from '../../../docs/screenshots/studio-hub-light.png';
import stackDark from '../../../docs/screenshots/studio-stack-dark.png';
import stackLight from '../../../docs/screenshots/studio-stack-light.png';
import toolingDark from '../../../docs/screenshots/studio-tooling-dark.png';
import toolingLight from '../../../docs/screenshots/studio-tooling-light.png';
import reviewDark from '../../../docs/screenshots/studio-review-dark.png';
import reviewLight from '../../../docs/screenshots/studio-review-light.png';
import settingsDark from '../../../docs/screenshots/studio-settings-dark.png';
import settingsLight from '../../../docs/screenshots/studio-settings-light.png';

export const SHOT_SIZE = { width: 1920, height: 961 };
export const SHOTS = {
  hubDark,
  hubLight,
  stackDark,
  stackLight,
  toolingDark,
  toolingLight,
  reviewDark,
  reviewLight,
  settingsDark,
  settingsLight,
};

/** Panels of the Studio tour. Captions only state what is visible in the capture. */
export const TOUR = [
  {
    id: 'templates',
    label: 'Templates',
    src: hubDark,
    srcDark: hubDark,
    srcLight: hubLight,
    alt: 'ForgeStack Studio templates list with Enterprise Monorepo selected and its layers in an inspector',
    title: 'Start from a template or from nothing',
    body: 'Nine curated architectures and your saved ones in one list. The inspector shows every layer and how many files it produces before you commit to anything.',
    facts: [
      ['Selected', 'Enterprise Monorepo'],
      ['Layers', 'React 19, Fastify 5, PostgreSQL'],
      ['Output', '110 files'],
    ],
  },
  {
    id: 'stack',
    label: 'Stack',
    src: stackDark,
    srcDark: stackDark,
    srcLight: stackLight,
    alt: 'Studio Stack stage with the database picker open next to the generated file tree and apps/api/src/server.ts in the editor',
    title: 'Change a layer, watch the files change',
    body: 'Each choice recompiles the project in memory. Options that do not fit the architecture stay visible with the reason, instead of silently disappearing.',
    facts: [
      ['Project', 'enterprise-app'],
      ['Data', 'PostgreSQL with Drizzle'],
      ['Preview', '88 files'],
    ],
  },
  {
    id: 'tooling',
    label: 'Tooling',
    src: toolingDark,
    srcDark: toolingDark,
    srcLight: toolingLight,
    alt: 'Studio Tooling stage with runtime, application, quality and AI agent switches, and the file tree showing auth, schema and tRPC files',
    title: 'Tooling and AI rules, switched on per project',
    body: 'Process manager, deployment target, auth, tRPC, linting, Playwright, CI, and the files your AI agents read: Cursor rules, CLAUDE.md, skills and an MCP config.',
    facts: [
      ['Application', 'Auth, tRPC, helpers'],
      ['Spec workflow', 'OpenSpec'],
      ['Preview', '107 files'],
    ],
  },
  {
    id: 'review',
    label: 'Review',
    src: reviewDark,
    srcDark: reviewDark,
    srcLight: reviewLight,
    alt: 'Studio Review stage listing identity, stack and tooling choices with Edit links, next to the generated file tree',
    title: 'Read every choice before anything is written',
    body: 'Choices grouped by stage, each with an Edit link back. Save the setup as a template, then scaffold. This capture is the browser build, which downloads a ZIP; the desktop app writes to disk.',
    facts: [
      ['Architecture', 'Turborepo monorepo'],
      ['After writing', 'git init, pnpm install'],
      ['Output', '88 files'],
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    src: settingsDark,
    srcDark: settingsDark,
    srcLight: settingsLight,
    alt: 'Studio Settings with project defaults, dark, light and system theme previews, and AI agent skill targets',
    title: 'Defaults you set once',
    body: 'Destination folder, package manager, git and install behaviour, the spec workflow, the theme, and which AI tools get the ForgeStack skill.',
    facts: [
      ['Package manager', 'pnpm'],
      ['Theme', 'Dark'],
      ['Spec workflow', 'OpenSpec'],
    ],
  },
] as const;
