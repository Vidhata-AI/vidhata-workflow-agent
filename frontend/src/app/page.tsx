"use client";

import { useState } from "react";
import FileExplorer from "@/components/FileExplorer";
import { mockCode } from "@/lib/mock-data";



export default function Home() {
  const [issue, setIssue] = useState("");
  const [activeFile, setActiveFile] = useState("src/app/page.tsx");
  const [message, setMessage] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [selectedTab, setSelectedTab] = useState("Code");
   // Display the selected file's matching demo content.
  const selectedCode =mockCode[activeFile] ?? "// No preview available for this file.";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submissionStatus === "loading") return;

    if (!issue.trim()) {
      setSubmissionStatus("error");
      setMessage("Enter an issue description before submitting.");
      return;
    }

    setSubmissionStatus("loading");
    setMessage("");

    // This URL is public frontend configuration; never put credentials here.
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

    try {
      const response = await fetch(
        `${apiBaseUrl.replace(/\/$/, "")}/issues`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description: issue }),
        }
      );

      if (!response.ok) {
        setSubmissionStatus("error");
        setMessage(
          response.status === 422
            ? "Description must be between 1 and 2000 characters."
            : "Could not submit the issue. Please try again."
        );
        return;
      }

      setSubmissionStatus("success");
      setMessage("Issue description received. No code has been modified.");
    } catch {
      // Do not expose server details; a network failure is enough to guide the user.
      setSubmissionStatus("error");
      setMessage("Could not reach the backend. Check that it is running.");
    }
  }

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-[#0b0d12] text-[#e5e7eb]">
      {/* Top navigation */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/[0.08] px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 font-bold text-white">
            V
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-wide">
              Vidhata AI
            </h1>
            <p className="text-[10px] text-gray-500">
              Your Autonomous Developer Workflow Agent
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
        {/* Repository explorer: selection is managed by Home. */}
<FileExplorer
  activePath={activeFile}
  onSelectFile={(path) => {
    setActiveFile(path);
    setSelectedTab("Code");
  }}
/>

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
              <p className="text-xs text-indigo-400">WORKSPACE / VIDHATA AI</p>
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
                  {selectedCode.split("\n").map((line, i) => (
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
            Vidhata AI · Frontend development
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
              Describe a bug or unexpected behaviour. Issue descriptions are
              accepted for future analysis; no code is inspected or modified yet.
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
              <div
                role="status"
                aria-live="polite"
                className={`mt-4 rounded-lg border p-3 text-xs leading-5 ${
                  submissionStatus === "error"
                    ? "border-rose-400/20 bg-rose-400/5 text-rose-200"
                    : submissionStatus === "success"
                      ? "border-emerald-400/20 bg-emerald-400/5 text-emerald-200"
                      : "border-amber-400/20 bg-amber-400/5 text-amber-200"
                }`}
              >
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
              maxLength={2000}
              required
              onChange={(e) => {
                setIssue(e.target.value);
                if (submissionStatus !== "idle") {
                  setSubmissionStatus("idle");
                  setMessage("");
                }
              }}
              placeholder="e.g. Login fails when..."
              rows={4}
              className="w-full resize-none rounded-lg border border-white/10 bg-[#090b10] p-3 text-xs leading-5 text-white outline-none placeholder:text-gray-600 focus:border-indigo-500/60"
            />
            <button
              type="submit"
              disabled={submissionStatus === "loading"}
              className="mt-3 w-full rounded-lg bg-indigo-500 px-4 py-2.5 text-xs font-medium text-white transition hover:bg-indigo-400 disabled:cursor-wait disabled:opacity-60"
            >
              {submissionStatus === "loading" ? "Submitting..." : "Submit issue ↗"}
            </button>
            <p className="mt-2 text-center text-[10px] text-gray-600">
              Issue descriptions only · No code is modified
            </p>
          </form>
        </aside>
      </div>
    </main>
  );
}
