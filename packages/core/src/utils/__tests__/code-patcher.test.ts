import { describe, expect, it } from 'vitest';
import { CodePatcher, SLOTS } from '../code-patcher.js';

describe('CodePatcher Utility', () => {
  it('should inject imports cleanly into file with or without import slot', () => {
    const templateWithSlot = `/* FORGESTACK_IMPORT_SLOT */

export const App = () => <div>Hello</div>;
`;
    const patched = CodePatcher.addImports(templateWithSlot, [
      "import React from 'react';",
      "import { Toaster } from 'sonner';",
    ]);

    expect(patched).toContain("import React from 'react';");
    expect(patched).toContain("import { Toaster } from 'sonner';");
    expect(patched).toContain('export const App');
  });

  it('should wrap JSX providers nested inside App component', () => {
    const template = `import React from 'react';

export const App = () => (
  /* FORGESTACK_PROVIDER_SLOT */
  <main>App Content</main>
);
`;

    const withQuery = CodePatcher.wrapProvider(
      template,
      '<QueryClientProvider client={queryClient}>',
      '</QueryClientProvider>'
    );

    const withToast = CodePatcher.wrapProvider(
      withQuery,
      '<ToastProvider>',
      '</ToastProvider>'
    );

    const cleaned = CodePatcher.cleanSlots(withToast);

    expect(cleaned).toContain('<QueryClientProvider client={queryClient}>');
    expect(cleaned).toContain('<ToastProvider>');
    expect(cleaned).toContain('<main>App Content</main>');
    expect(cleaned).toContain('</ToastProvider>');
    expect(cleaned).toContain('</QueryClientProvider>');
    expect(cleaned).not.toContain('FORGESTACK_PROVIDER_SLOT');
  });

  it('should register backend routes into route slot', () => {
    const backendTemplate = `import express from 'express';
export const app = express();

/* FORGESTACK_ROUTE_SLOT */
`;

    const patched = CodePatcher.registerRoute(
      backendTemplate,
      "app.use('/api/auth', authRoutes);"
    );
    const patched2 = CodePatcher.registerRoute(
      patched,
      "app.use('/api/health', healthRoutes);"
    );

    const cleaned = CodePatcher.cleanSlots(patched2);

    expect(cleaned).toContain("app.use('/api/auth', authRoutes);");
    expect(cleaned).toContain("app.use('/api/health', healthRoutes);");
    expect(cleaned).not.toContain('FORGESTACK_ROUTE_SLOT');
  });

  it('should throw error when target slot is missing', () => {
    const brokenTemplate = 'const x = 1;';
    expect(() => {
      CodePatcher.injectSlot(brokenTemplate, SLOTS.PROVIDERS, '<Provider />');
    }).toThrowError(/Target injection slot/);
  });
});
