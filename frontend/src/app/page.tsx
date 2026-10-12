
"use client";

import { useState } from "react";

const files = [
  { name: "src", type: "folder", indent: 0 },
  { name: "app", type: "folder", indent: 1 },
  { name: "page.tsx", type: "file", indent: 2 },
  { name: "layout.tsx", type: "file", indent: 2 },
  { name: "globals.css", type: "file", indent: 2 },
  { name: "components", type: "folder", indent: 0 },
  { name: "backend", type: "folder", indent: 0 },
  { name: "main.py", type: "file", indent: 1 },
  { name: "requirements.txt", type: "file", indent: 0 },
];

const initialCode = `def calculate_total(items):
    total = 0

    for item in items:
        total += item["price"]

    return total


def apply_discount(total, discount):
    # TODO: Validate discount range
    return total - (total * discount)`;

export default function Home() {
  const [issue, setIssue] = useState("");
  const [activeFile, setActiveFile] = useState("page.tsx");
  const [message, setMessage] = useState("");
  const [selectedTab, setSelectedTab] = useState("Code");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!issue.trim()) return;
    setMessage(
      "Issue received. AI analysis will be available after backend integration."
    );
  }

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-[#0b0d12] text-[#e5e7eb]">
      {/* Top navigation */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/[0.08] px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 font-bold text-white">
            D
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-wide">
              Developer Workflow Agent
            </h1>
            <p className="text-[10px] text-gray-500">
              AI-powered development workspace
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-xs text-gray-400 sm:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Local workspace
        </div>

        <button className="rounded-lg border border-white/10 px-3 py-2 text-xs hover:bg-white/5">
          Settings
        </button>
      </header>

      {/* Workspace */}
      <div className="flex min-h-0 flex-1">
        {/* File explorer */}
        <aside className="hidden w-60 shrink-0 border-r border-white/[0.08] bg-[#0e1016] md:flex md:flex-col">
          <div className="flex h-12 items-center justify-between px-4">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
              Explorer
            </span>
            <span className="text-xs text-gray-500">⌘</span>
          </div>

          <div className="border-b border-white/[0.06] px-4 pb-4">
            <p className="mb-2 text-xs text-gray-500">PROJECT</p>
            <div className="flex items-center gap-2 rounded-md bg-indigo-500/10 px-2 py-2 text-sm text-indigo-300">
              <span>⌄</span>
              <span> DWA</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-3">
            {files.map((file) => (
              <button
                key={file.name}
                onClick={() => {
                  setActiveFile(file.name);
                  setSelectedTab("Code");
                }}
                className={`flex w-full items-center gap-2 py-2 pr-2 text-left text-xs transition ${
                  activeFile === file.name
                    ? "bg-indigo-500/15 text-indigo-300"
                    : "text-gray-400 hover:bg-white/[0.04] hover:text-gray-200"
                }`}
                style={{ paddingLeft: `${14 + file.indent * 16}px` }}
              >
                <span className={file.type === "folder" ? "text-amber-300" : "text-sky-400"}>
                  {file.type === "folder" ? "▸" : "◈"}
                </span>
                {file.name}
              </button>
            ))}
          </div>

          <div className="border-t border-white/[0.08] p-4">
            <p className="text-xs text-gray-500">Repository status</p>
            <p className="mt-2 text-xs text-emerald-400">
              ● Workspace ready
            </p>
          </div>
        </aside>

        {/* Main editor */}
        <section className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-12 shrink-0 items-center justify-between border-b border-white/[0.08] px-4">
            <div className="flex items-center gap-3 text-xs">
              <span className="text-sky-400">◈</span>
              <span>{activeFile}</span>
              <span className="text-gray-600">×</span>
            </div>

            <div className="flex gap-1">
              {["Code", "Diff", "Tests"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`rounded-md px-3 py-1.5 text-xs ${
                    selectedTab === tab
                      ? "bg-white/10 text-white"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-auto p-5 sm:p-8">
            <div className="mb-7">
              <p className="text-xs text-indigo-400">WORKSPACE / DWA</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                Developer workspace
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Inspect code, investigate issues and review proposed fixes.
              </p>
            </div>

            {selectedTab === "Code" && (
              <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0e1016]">
                <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3">
                  <span className="text-xs text-gray-400">
                    {activeFile}
                  </span>
                  <span className="text-[10px] text-gray-600">
                    PREVIEW · MOCK DATA
                  </span>
                </div>

                <div className="overflow-x-auto p-4 font-mono text-xs leading-7 sm:text-sm">
                  {initialCode.split("\n").map((line, i) => (
                    <div key={i} className="flex min-w-max">
                      <span className="mr-5 inline-block w-5 select-none text-right text-gray-600">
                        {i + 1}
                      </span>
                      <span
                        className={
                          line.trim().startsWith("#")
                            ? "text-gray-500"
                            : line.includes("def ")
                              ? "text-sky-300"
                              : line.includes("return")
                                ? "text-violet-300"
                                : "text-gray-300"
                        }
                      >
                        {line || " "}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === "Diff" && (
              <div className="rounded-xl border border-white/10 bg-[#0e1016] p-5">
                <h3 className="text-sm font-medium">Patch preview</h3>
                <p className="mt-2 text-sm text-gray-500">
                  No patch generated yet. Submit an issue to begin the workflow
                  after backend integration.
                </p>
              </div>
            )}

            {selectedTab === "Tests" && (
              <div className="rounded-xl border border-white/10 bg-[#0e1016] p-5">
                <h3 className="text-sm font-medium">Verification results</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Tests have not been run. Results will appear here after the
                  verification engine is connected.
                </p>
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-md border border-white/10 px-3 py-2 text-xs text-gray-400">
                Git integration · Pending
              </span>
              <span className="rounded-md border border-white/10 px-3 py-2 text-xs text-gray-400">
                AI analysis · Pending
              </span>
              <span className="rounded-md border border-white/10 px-3 py-2 text-xs text-gray-400">
                Test runner · Pending
              </span>
            </div>
          </div>

          <div className="border-t border-white/[0.08] px-4 py-2 text-[10px] text-gray-500">
            DWA Prototype · Frontend development
          </div>
        </section>

        {/* AI chat */}
        <aside className="hidden w-80 shrink-0 flex-col border-l border-white/[0.08] bg-[#0e1016] xl:flex">
          <div className="flex h-12 items-center gap-2 border-b border-white/[0.08] px-4">
            <span className="text-indigo-400">✳</span>
            <span className="text-sm font-medium">AI Assistant</span>
            <span className="ml-auto rounded bg-amber-400/10 px-2 py-1 text-[10px] text-amber-300">
              Preview
            </span>
          </div>

          <div className="flex flex-1 flex-col overflow-y-auto p-4">
            <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/15 text-lg text-indigo-300">
              ✳
            </div>

            <h3 className="text-sm font-medium">What are we fixing today?</h3>
            <p className="mt-2 text-xs leading-6 text-gray-500">
              Describe a bug or unexpected behaviour. The connected agent will
              inspect relevant code and propose a reviewable patch.
            </p>

            <div className="mt-5 rounded-lg border border-white/[0.08] p-3">
              <p className="text-[10px] uppercase tracking-wider text-gray-500">
                Example issue
              </p>
              <p className="mt-2 text-xs leading-5 text-gray-300">
                The discount function accepts negative values. Find the cause
                and suggest a fix.
              </p>
              <button
                onClick={() =>
                  setIssue("The discount function accepts negative values. Find the cause and suggest a fix.")
                }
                className="mt-3 text-xs text-indigo-300 hover:text-indigo-200"
              >
                Use example →
              </button>
            </div>

            {message && (
              <div className="mt-4 rounded-lg border border-amber-400/20 bg-amber-400/5 p-3 text-xs leading-5 text-amber-200">
                {message}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-white/[0.08] p-4">
            <label htmlFor="issue" className="mb-2 block text-xs text-gray-400">
              Describe your issue
            </label>
            <textarea
              id="issue"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              placeholder="e.g. Login fails when..."
              rows={4}
              className="w-full resize-none rounded-lg border border-white/10 bg-[#090b10] p-3 text-xs leading-5 text-white outline-none placeholder:text-gray-600 focus:border-indigo-500/60"
            />
            <button
              type="submit"
              className="mt-3 w-full rounded-lg bg-indigo-500 px-4 py-2.5 text-xs font-medium text-white transition hover:bg-indigo-400"
            >
              Submit issue ↗
            </button>
            <p className="mt-2 text-center text-[10px] text-gray-600">
              Preview only · No code is modified
            </p>
          </form>
        </aside>
      </div>
    </main>
  );
}
