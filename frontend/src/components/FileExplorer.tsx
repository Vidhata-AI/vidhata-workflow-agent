
"use client";

import type { RepositoryFile } from "@/lib/mock-data";
import { mockFiles } from "@/lib/mock-data";

/**
 * FileExplorer
 *
 * Purpose:
 * Displays the demo repository tree and reports the selected file
 * to its parent component.
 *
 * Security:
 * This component renders static mock data only. It does not access
 * the filesystem, execute shell commands, or modify repository files.
 */

type FileExplorerProps = {
  activePath: string;
  onSelectFile: (path: string) => void;
};

export default function FileExplorer({
  activePath,
  onSelectFile,
}: FileExplorerProps) {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-white/[0.08] bg-[#0e1016] md:flex md:flex-col">
      {/* Explorer header */}
      <div className="flex h-12 items-center justify-between px-4">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
          Explorer
        </span>
        <span className="text-xs text-gray-500">⌘</span>
      </div>

      {/* Current demo project */}
      <div className="border-b border-white/[0.06] px-4 pb-4">
        <p className="mb-2 text-xs text-gray-500">PROJECT</p>

        <div className="flex items-center gap-2 rounded-md bg-indigo-500/10 px-2 py-2 text-sm text-indigo-300">
          <span aria-hidden="true">⌄</span>
          <span>Vidhata AI</span>
        </div>
      </div>

      {/* File entries */}
      <nav
        aria-label="Repository files"
        className="flex-1 overflow-y-auto py-3"
      >
        {mockFiles.map((file: RepositoryFile) => {
          const isActive =
            file.type === "file" && file.path === activePath;

          return (
            <button
              key={file.path}
              type="button"
              disabled={file.type === "folder"}
              aria-current={isActive ? "page" : undefined}
              onClick={() => {
                if (file.type === "file") {
                  onSelectFile(file.path);
                }
              }}
              className={`flex w-full items-center gap-2 py-2 pr-2 text-left text-xs transition ${
                isActive
                  ? "bg-indigo-500/15 text-indigo-300"
                  : file.type === "folder"
                    ? "cursor-default text-gray-400"
                    : "text-gray-400 hover:bg-white/[0.04] hover:text-gray-200"
              }`}
              style={{
                paddingLeft: `${14 + file.indent * 16}px`,
              }}
            >
              <span
                aria-hidden="true"
                className={
                  file.type === "folder"
                    ? "text-amber-300"
                    : "text-sky-400"
                }
              >
                {file.type === "folder" ? "▸" : "◈"}
              </span>

              <span>{file.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Mock status, not a real Git status check */}
      <div className="border-t border-white/[0.08] p-4">
        <p className="text-xs text-gray-500">Repository status</p>
        <p className="mt-2 text-xs text-emerald-400">
          ● Demo workspace ready
        </p>
      </div>
    </aside>
  );
}
