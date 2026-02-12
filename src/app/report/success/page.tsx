"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <nav className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold text-slate-900">
            E5 Elevator
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-2xl px-6 py-16">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          {/* Success checkmark */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-10 w-10 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="mb-2 text-2xl font-bold text-slate-900">
            Payment successful!
          </h1>
          <p className="mb-6 text-slate-600">
            Your full report is being prepared...
          </p>

          <div className="mb-8 rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
            <p>
              You&apos;ll receive an email with download links shortly. This
              typically takes 1-2 minutes.
            </p>
          </div>

          {/* Download button (disabled for now) */}
          <button
            disabled
            className="mb-4 w-full rounded-lg bg-slate-300 px-6 py-3 font-semibold text-slate-500 cursor-not-allowed"
          >
            Preparing your report...
          </button>

          <Link
            href="/report/editor"
            className="inline-block text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
          >
            Go to Report Editor
          </Link>

          {sessionId && (
            <p className="mt-6 text-xs text-slate-400">
              Session ID: {sessionId.slice(0, 20)}...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <div className="text-slate-400">Loading...</div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
