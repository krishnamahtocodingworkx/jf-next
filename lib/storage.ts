const isClient = typeof window !== "undefined";

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
