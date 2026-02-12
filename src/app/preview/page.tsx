"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ReportData {
  company: {
    name: string;
    industry: string;
    employeeCount: string;
    revenueBand: string;
  };
  answers: Record<string, string | string[]>;
  selectedWorkloads: string[];
  completedAt: string;
}

interface GeneratedSection {
  text: string;
  model: string;
  costUSD: number;
  durationMs: number;
}

const REPORT_SECTIONS = [
  { id: "executive-summary", title: "1. Executive Summary", freePreview: true },
  { id: "risk-quantification", title: "2. Risk Quantification", freePreview: false },
  { id: "breach-case-studies", title: "3. Industry Breach Case Studies", freePreview: false },
  { id: "tco-comparison", title: "4. Current vs E5: TCO Comparison", freePreview: false },
  { id: "vendor-consolidation", title: "5. Vendor Consolidation Analysis", freePreview: false },
  { id: "framework-gap-analysis", title: "6. Compliance Framework Gap Analysis", freePreview: false },
  { id: "peer-benchmarking", title: "7. Peer Benchmarking", freePreview: false },
  { id: "investment-roadmap", title: "8. Investment Roadmap & Timeline", freePreview: false },
  { id: "roi-projection", title: "9. ROI Projection", freePreview: false },
] as const;

export default function PreviewPage() {
  const router = useRouter();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [sections, setSections] = useState<Record<string, GeneratedSection>>(
    {}
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generationTime, setGenerationTime] = useState<number>(0);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Load report data from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem("e5-report-data");
    if (stored) {
      setReportData(JSON.parse(stored));
    } else {
      router.push("/start");
    }
  }, [router]);

  // Generate report when data is loaded
  useEffect(() => {
    if (!reportData) return;
    if (Object.keys(sections).length > 0) return; // Already generated

    async function generate() {
      setLoading(true);
      setError(null);
      const start = Date.now();

      try {
        const response = await fetch("/api/generate-report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            company: reportData!.company,
            answers: reportData!.answers,
            selectedWorkloads: reportData!.selectedWorkloads,
            sections: [
              "executive-summary",
              "risk-quantification",
              "breach-case-studies",
              "tco-comparison",
              "vendor-consolidation",
              "framework-gap-analysis",
              "peer-benchmarking",
              "investment-roadmap",
              "roi-projection",
            ],
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to generate report");
        }

        const data = await response.json();
        setSections(data.sections);
        setGenerationTime(Date.now() - start);

        // Store generated report for the editor
        sessionStorage.setItem(
          "e5-generated-report",
          JSON.stringify({ sections: data.sections, generatedAt: data.generatedAt })
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to generate report"
        );
      } finally {
        setLoading(false);
      }
    }

    generate();
  }, [reportData, sections]);

  async function handleCheckout() {
    if (!reportData) return;
    setCheckoutLoading(true);
    try {
      const reportId = `report-${Date.now()}`;
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: reportData.company.name,
          reportId,
        }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to create checkout session");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setCheckoutLoading(false);
    }
  }

  if (!reportData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <nav className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold text-slate-900">
            E5 Elevator
          </Link>
          <div className="text-sm text-slate-500">
            Report for{" "}
            <span className="font-medium text-slate-700">
              {reportData.company.name}
            </span>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-slate-900">
            Your E5 Business Case Preview
          </h1>
          <p className="text-slate-500">
            This is a free preview of your personalised report. Unlock the full
            version with all sections, PDF export, and PowerPoint deck for just
            £79.
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-8 text-center">
            <div className="mb-4 inline-flex h-12 w-12 animate-spin items-center justify-center rounded-full border-4 border-blue-200 border-t-blue-600" />
            <h3 className="mb-1 text-lg font-semibold text-blue-900">
              Generating your business case...
            </h3>
            <p className="text-sm text-blue-700">
              Our AI is analysing your company data, building risk models, and
              crafting personalised recommendations. This typically takes 15-30
              seconds.
            </p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-6">
            <h3 className="mb-1 font-semibold text-red-900">
              Generation failed
            </h3>
            <p className="mb-3 text-sm text-red-700">{error}</p>
            <button
              onClick={() => {
                setSections({});
                setError(null);
              }}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* Generated sections */}
        {Object.keys(sections).length > 0 && (
          <>
            {/* Generation stats */}
            <div className="mb-6 flex items-center gap-4 text-xs text-slate-400">
              <span>
                Generated in {(generationTime / 1000).toFixed(1)}s
              </span>
              <span>
                Model: {sections["executive-summary"]?.model || "unknown"}
              </span>
              <span>
                AI cost: ${Object.values(sections).reduce((sum, s) => sum + s.costUSD, 0).toFixed(4)}
              </span>
            </div>

            {/* All report sections */}
            {REPORT_SECTIONS.map((section) => {
              const data = sections[section.id];
              if (!data) return null;
              return (
                <ReportSection
                  key={section.id}
                  title={section.title}
                  content={data.text}
                  visible={section.freePreview}
                />
              );
            })}

            {/* CTA */}
            <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 text-center">
              <h3 className="mb-2 text-xl font-bold text-slate-900">
                Unlock your full business case
              </h3>
              <p className="mb-4 text-slate-600">
                Get all 9 sections, a professional PDF report, and a
                board-ready PowerPoint deck.
              </p>
              <div className="mb-4">
                <span className="text-3xl font-bold text-slate-900">£79</span>
                <span className="text-sm text-slate-500"> one-time</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                  className="rounded-lg bg-blue-600 px-8 py-3 text-base font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {checkoutLoading ? "Redirecting to payment..." : "Unlock Full Report \u2014 \u00a379"}
                </button>
                <Link
                  href="/report/editor"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 underline"
                >
                  Preview the report editor
                </Link>
              </div>
              <p className="mt-3 text-xs text-slate-400">
                30-day free refresh included. Stripe-secured payment.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// --- Report Section Component ---

function ReportSection({
  title,
  content,
  visible,
}: {
  title: string;
  content: string;
  visible: boolean;
}) {
  return (
    <div className="relative mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* Watermark */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.04]">
        <span className="-rotate-30 text-8xl font-bold text-slate-900">
          PREVIEW
        </span>
      </div>

      <div className="border-b border-slate-100 bg-slate-50 px-6 py-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-600">
          {title}
        </h2>
      </div>

      <div className={`px-6 py-5 ${!visible ? "relative" : ""}`}>
        {visible ? (
          <div className="prose prose-slate max-w-none">
            <MarkdownContent text={content} />
          </div>
        ) : (
          <>
            <div className="prose prose-slate max-w-none blur-sm select-none">
              {content.split("\n").slice(0, 8).map((para, i) => (
                <p key={i} className="text-sm leading-relaxed text-slate-700">
                  {para}
                </p>
              ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-white/60">
              <div className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-lg">
                Unlock full report to view
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// --- Markdown-like Content Renderer with Citation Highlighting ---

function MarkdownContent({ text }: { text: string }) {
  const lines = text.split("\n");

  return (
    <>
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return null;

        // Headings
        if (trimmed.startsWith("### ")) {
          return (
            <h4 key={i} className="mt-4 mb-2 text-sm font-bold text-slate-800">
              {trimmed.slice(4)}
            </h4>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h3 key={i} className="mt-5 mb-2 text-base font-bold text-slate-900">
              {trimmed.slice(3)}
            </h3>
          );
        }

        // Bullet points
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          return (
            <li key={i} className="ml-4 text-sm leading-relaxed text-slate-700 list-disc">
              <InlineContent text={trimmed.slice(2)} />
            </li>
          );
        }

        // Numbered list
        if (/^\d+\.\s/.test(trimmed)) {
          const content = trimmed.replace(/^\d+\.\s/, "");
          return (
            <li key={i} className="ml-4 text-sm leading-relaxed text-slate-700 list-decimal">
              <InlineContent text={content} />
            </li>
          );
        }

        // Table rows (pass through as-is for now)
        if (trimmed.startsWith("|")) {
          return (
            <pre key={i} className="text-xs text-slate-600 font-mono whitespace-pre-wrap">
              {trimmed}
            </pre>
          );
        }

        // Regular paragraph
        return (
          <p key={i} className="text-sm leading-relaxed text-slate-700 mb-2">
            <InlineContent text={trimmed} />
          </p>
        );
      })}
    </>
  );
}

// --- Inline Content with Citation + Bold Parsing ---

function InlineContent({ text }: { text: string }) {
  // Parse citations [Source: Name, URL, Date] and bold **text**
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Find next citation or bold
    const citationMatch = remaining.match(/\[Source:\s*([^\]]+)\]/);
    const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);

    const citationIdx = citationMatch ? remaining.indexOf(citationMatch[0]) : -1;
    const boldIdx = boldMatch ? remaining.indexOf(boldMatch[0]) : -1;

    // Neither found - push rest as text
    if (citationIdx === -1 && boldIdx === -1) {
      parts.push(remaining);
      break;
    }

    // Determine which comes first
    const nextIsCitation =
      citationIdx !== -1 && (boldIdx === -1 || citationIdx < boldIdx);

    if (nextIsCitation && citationMatch) {
      // Push text before citation
      if (citationIdx > 0) {
        parts.push(remaining.slice(0, citationIdx));
      }
      // Parse citation: try to extract URL
      const citationContent = citationMatch[1];
      const urlMatch = citationContent.match(/(https?:\/\/[^\s,\]]+)/);
      parts.push(
        <span
          key={key++}
          className="inline-flex items-center gap-1 rounded bg-blue-50 px-1.5 py-0.5 text-xs text-blue-700 border border-blue-100"
          title={citationContent}
        >
          {urlMatch ? (
            <a
              href={urlMatch[1]}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-blue-900"
            >
              {citationContent.split(",")[0].trim()}
            </a>
          ) : (
            citationContent.split(",")[0].trim()
          )}
        </span>
      );
      remaining = remaining.slice(citationIdx + citationMatch[0].length);
    } else if (boldMatch) {
      // Push text before bold
      if (boldIdx > 0) {
        parts.push(remaining.slice(0, boldIdx));
      }
      parts.push(
        <strong key={key++} className="font-semibold text-slate-900">
          {boldMatch[1]}
        </strong>
      );
      remaining = remaining.slice(boldIdx + boldMatch[0].length);
    }
  }

  return <>{parts}</>;
}
