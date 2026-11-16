/** Prefixes a /public path with the deployment base path (e.g. "/candies" on GitHub Pages). */
export const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");
export const asset = (path: string) => (/^(https?:|data:)/.test(path) ? path : `${BASE_PATH}${path}`);
