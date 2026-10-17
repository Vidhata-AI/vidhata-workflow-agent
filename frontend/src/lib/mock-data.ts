
/**
 * DWA — Mock Repository Data
 *
 * Purpose:
 * Provides demo file-tree entries and code previews for the frontend.
 *
 * Important:
 * This module contains static demo data only. It does not scan actual
 * repositories, modify files, execute commands, or call AI models.
 *
 * Security:
 * - File paths are fixed demo values.
 * - Never treat mock data as proof that a file exists.
 * - Real repository paths must be validated by the backend.
 * - Never expose environment variables, secrets, or credentials.
 *
 * Future integration:
 * Replace these mock values with validated data from the FastAPI API.
 */

/**
 * Describes a file or folder displayed in the repository explorer.
 *
 * name: Visible file or folder name.
 * path: Relative path within the demo repository.
 * type: Determines whether the entry represents a file or folder.
 * indent: Visual nesting level in the file tree.
 */
export type RepositoryFile = {
  name: string;
  path: string;
  type: "file" | "folder";
  indent: number;
};

/**
 * Sample repository structure used by the DWA dashboard.
 *
 * These entries are illustrative and do not represent a real filesystem.
 */
export const mockFiles: RepositoryFile[] = [
  { name: "src", path: "src", type: "folder", indent: 0 },
  { name: "app", path: "src/app", type: "folder", indent: 1 },
  {
    name: "page.tsx",
    path: "src/app/page.tsx",
    type: "file",
    indent: 2,
  },
  {
    name: "layout.tsx",
    path: "src/app/layout.tsx",
    type: "file",
    indent: 2,
  },
  {
    name: "globals.css",
    path: "src/app/globals.css",
    type: "file",
    indent: 2,
  },
  {
    name: "components",
    path: "src/components",
    type: "folder",
    indent: 0,
  },
  { name: "backend", path: "backend", type: "folder", indent: 0 },
  {
    name: "main.py",
    path: "backend/main.py",
    type: "file",
    indent: 1,
  },
  {
    name: "requirements.txt",
    path: "backend/requirements.txt",
    type: "file",
    indent: 0,
  },
];

/**
 * Maps each demo file path to its displayed source-code preview.
 *
 * The preview is plain text. It is not compiled or executed by this module.
 */
export const mockCode: Record<string, string> = {
  "src/app/page.tsx": `/**
 * DWA demo page.
 * The actual dashboard UI is implemented separately.
 */
export default function Home() {
  return <main>Vidhata AI</main>;
}`,

  "src/app/layout.tsx": `/**
 * Example Next.js root layout.
 * Demonstrates the required HTML document structure.
 */
import type { ReactNode } from "react";

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`,

  "src/app/globals.css": `@import "tailwindcss";

/**
 * DWA global styles.
 * Dashboard components use Tailwind CSS utility classes.
 */`,

  "backend/main.py": `"""
Vidhata AI FastAPI backend preview.

This is illustrative source code shown in the frontend.
It is not the actual running backend.
"""

def health_check() -> dict[str, str]:
    """Return a basic health status."""
    return {"status": "ok"}
`,

  "backend/requirements.txt": `# Python dependencies for the future Vidhata AI backend.
fastapi
uvicorn`,
};

/**
 * Safely retrieves a preview for a known demo file.
 *
 * Returns null when the path is not present in the predefined demo data.
 * This is a UI lookup only, not filesystem security validation.
 */
export function getMockCode(path: string): string | null {
  const isKnownFile = mockFiles.some(
    (file) => file.type === "file" && file.path === path
  );

  if (!isKnownFile) {
    return null;
  }

  return mockCode[path] ?? null;
}
