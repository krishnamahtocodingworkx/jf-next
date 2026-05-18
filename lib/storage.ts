// SSR-safe localStorage wrapper used by the user slice + axios interceptor (auth tokens persist across reloads).

const isClient = typeof window !== "undefined";

/** Identical to `window.localStorage` on the client; no-ops during SSR / build. */
export const storage = {
  getItem(key: string): string | null {
    if (!isClient) return null;
    return window.localStorage.getItem(key);
  },
  setItem(key: string, value: string): void {
    if (!isClient) return;
    window.localStorage.setItem(key, value);
  },
  removeItem(key: string): void {
    if (!isClient) return;
    window.localStorage.removeItem(key);
  },
  clear(): void {
    if (!isClient) return;
    window.localStorage.clear();
  },
};
