/**
 * @param {() => Promise<Record<string, boolean>>} fetchFlags
 * @return {{ isEnabled: (name: string, fallback?: boolean) => Promise<boolean>, refresh: () => Promise<Record<string, boolean>> }}
 */
export default function createFeatureFlags(fetchFlags) {
  // Your code here
}
