/**
 * Code patcher utility for injecting imports, middleware, providers, and routes
 * into TypeScript source files using structured slot tokens and deterministic insertion.
 */

export const SLOTS = {
  IMPORTS: '/* FORGESTACK_IMPORT_SLOT */',
  PROVIDERS: '/* FORGESTACK_PROVIDER_SLOT */',
  ROUTES: '/* FORGESTACK_ROUTE_SLOT */',
  MIDDLEWARE: '/* FORGESTACK_MIDDLEWARE_SLOT */',
} as const;

export class CodePatcher {
  /**
   * Injects code into a designated slot token.
   * If the slot token is not present, throws an error or appends depending on options.
   */
  public static injectSlot(
    source: string,
    slot: string,
    injection: string,
    options: { preserveSlot?: boolean } = { preserveSlot: true }
  ): string {
    if (!source.includes(slot)) {
      throw new Error(`Target injection slot '${slot}' was not found in source file.`);
    }

    const replacement = options.preserveSlot
      ? `${injection}\n${slot}`
      : injection;

    return source.replace(slot, replacement);
  }

  /**
   * Prepends import statements at the top of a TypeScript/JavaScript file,
   * positioning after any leading comments or 'use client' directives.
   */
  public static addImports(source: string, importStatements: string[]): string {
    const importBlock = importStatements.join('\n');

    if (source.includes(SLOTS.IMPORTS)) {
      return this.injectSlot(source, SLOTS.IMPORTS, importBlock, {
        preserveSlot: true,
      });
    }

    // Check for 'use client' or similar directives
    if (source.startsWith("'use client'") || source.startsWith('"use client"')) {
      const lines = source.split('\n');
      const directive = lines[0];
      const rest = lines.slice(1).join('\n');
      return `${directive}\n\n${importBlock}\n${rest}`;
    }

    return `${importBlock}\n\n${source}`;
  }

  /**
   * Wraps JSX in providers inside App.tsx or main.tsx.
   */
  public static wrapProvider(
    source: string,
    openTag: string,
    closeTag: string
  ): string {
    if (source.includes(SLOTS.PROVIDERS)) {
      const wrapped = `${openTag}\n  ${SLOTS.PROVIDERS}\n${closeTag}`;
      return source.replace(SLOTS.PROVIDERS, wrapped);
    }

    throw new Error(
      `Cannot wrap provider: slot '${SLOTS.PROVIDERS}' was not found in template.`
    );
  }

  /**
   * Registers a backend route module in Express/Fastify app.ts.
   */
  public static registerRoute(
    source: string,
    routeRegistration: string
  ): string {
    return this.injectSlot(source, SLOTS.ROUTES, `  ${routeRegistration}`, {
      preserveSlot: true,
    });
  }

  /**
   * Strips all remaining unresolved FORGESTACK injection comments for clean final output.
   */
  public static cleanSlots(source: string): string {
    return source
      .replace(/\/\*\s*FORGESTACK_[A-Z_]+\s*\*\/\n?/g, '')
      .trimEnd() + '\n';
  }
}
