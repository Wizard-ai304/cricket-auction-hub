/**
 * Resolves an image code (filename stored in src/assets) to a URL.
 * Images must be placed in /src/assets/ and imported via Vite's
 * dynamic import glob. The code is the filename without extension.
 */

// Eagerly import all images from src/assets
const imageModules = import.meta.glob('/src/assets/**/*.{png,jpg,jpeg,svg,webp,gif}', {
  eager: true,
  import: 'default',
});

/**
 * Given a code like "mi" or "csk", finds the matching asset file.
 * Matches case-insensitively against the filename (without extension).
 */
export function getImageByCode(code?: string): string | null {
  if (!code || !code.trim()) return null;

  const normalizedCode = code.trim().toLowerCase();

  for (const [path, url] of Object.entries(imageModules)) {
    // Extract filename without extension from path like "/src/assets/mi.png"
    const filename = path.split('/').pop()?.replace(/\.[^.]+$/, '')?.toLowerCase();
    if (filename === normalizedCode) {
      return url as string;
    }
  }

  return null;
}
