/**
 * Deep merges two JSON objects.
 * - Objects are recursively combined.
 * - Arrays are combined uniquely (preserving order of target, appending unique items from source).
 * - Primitives in source overwrite target.
 */
export function deepMergeJson<T extends Record<string, unknown>>(
  target: T,
  source: Record<string, unknown>
): T {
  const result: Record<string, unknown> = { ...target };

  for (const [key, sourceValue] of Object.entries(source)) {
    const targetValue = result[key];

    if (sourceValue === undefined) {
      continue;
    }

    if (
      isPlainObject(targetValue) &&
      isPlainObject(sourceValue)
    ) {
      result[key] = deepMergeJson(
        targetValue as Record<string, unknown>,
        sourceValue as Record<string, unknown>
      );
    } else if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      // Unique merge for arrays
      const merged = [...targetValue];
      for (const item of sourceValue) {
        if (!merged.some((m) => deepEquals(m, item))) {
          merged.push(item);
        }
      }
      result[key] = merged;
    } else {
      result[key] = sourceValue;
    }
  }

  return result as T;
}

function isPlainObject(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}

function deepEquals(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (typeof a !== 'object' || a === null || b === null) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, i) => deepEquals(item, b[i]));
  }

  const keysA = Object.keys(a as Record<string, unknown>);
  const keysB = Object.keys(b as Record<string, unknown>);
  if (keysA.length !== keysB.length) return false;

  return keysA.every((k) =>
    deepEquals(
      (a as Record<string, unknown>)[k],
      (b as Record<string, unknown>)[k]
    )
  );
}

/**
 * Specifically merges and sorts package.json manifests.
 */
export function mergePackageJson(
  target: Record<string, unknown>,
  source: Record<string, unknown>
): Record<string, unknown> {
  const merged = deepMergeJson(target, source);

  // Sort dependencies and devDependencies alphabetically for cleanliness
  if (merged.dependencies && isPlainObject(merged.dependencies)) {
    merged.dependencies = sortKeys(merged.dependencies);
  }
  if (merged.devDependencies && isPlainObject(merged.devDependencies)) {
    merged.devDependencies = sortKeys(merged.devDependencies);
  }
  if (merged.peerDependencies && isPlainObject(merged.peerDependencies)) {
    merged.peerDependencies = sortKeys(merged.peerDependencies);
  }

  return merged;
}

function sortKeys(obj: Record<string, unknown>): Record<string, unknown> {
  const sorted: Record<string, unknown> = {};
  for (const key of Object.keys(obj).sort()) {
    sorted[key] = obj[key];
  }
  return sorted;
}
