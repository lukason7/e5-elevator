"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface GeneratedSection {
  text: string;
  model: string;
  costUSD: number;
  durationMs: number;
}

const SECTION_META = [
  { id: "executive-summary", title: "Executive Summary" },
  { id: "risk-quantification", title: "Risk Quantification" },
  { id: "breach-case-studies", title: "Industry Breach Case Studies" },
  { id: "tco-comparison", title: "Current vs E5: TCO Comparison" },
  { id: "vendor-consolidation", title: "Vendor Consolidation Analysis" },
  { id: "framework-gap-analysis", title: "Compliance Framework Gap Analysis" },
  { id: "peer-benchmarking", title: "Peer Benchmarking" },
  { id: "investment-roadmap", title: "Investment Roadmap & Timeline" },
  { id: "roi-projection", title: "ROI Projection" },
] as const;

export default function ReportEditorPage() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [sections, setSections] = useState<Record<string, GeneratedSection>>(
    {}
  );
  const [editedTexts, setEditedTexts] = useState<Record<string, string>>({});
  const [activeSection, setActiveSection] = useState("executive-summary");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [downloading, setDownloading] = useState<"pdf" | "pptx" | null>(null);

  // Load generated report from sessionStorage
  useEffect(() => {
    const reportStr = sessionStorage.getItem("e5-generated-report");
    const dataStr = sessionStorage.getItem("e5-report-data");

    if (!reportStr || !dataStr) {
      router.push("/preview");
      return;
    }

    const report = JSON.parse(reportStr);
    const data = JSON.parse(dataStr);

    setSections(report.sections || {});
    setCompanyName(data.company?.name || "");

    // Initialize edited texts from generated content
    const initial: Record<string, string> = {};
    for (const [key, section] of Object.entries(report.sections || {})) {
      initial[key] = (section as GeneratedSection).text;
    }
    setEditedTexts(initial);
  }, [router]);

  function handleTextChange(sectionId: string, text: string) {
    setEditedTexts((prev) => ({ ...prev, [sectionId]: text }));
    setSaved(false);
  }

  function handleSave() {
    setSaving(true);
    // Save edits to sessionStorage
    const updatedSections: Record<string, GeneratedSection> = {};
    for (const [key, section] of Object.entries(sections)) {
      updatedSections[key] = {
        ...section,
        text: editedTexts[key] || section.text,
      };
    }
    sessionStorage.setItem(
      "e5-generated-report",
      JSON.stringify({ sections: updatedSections })
    );
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 300);
  }

  function handleResetSection(sectionId: string) {
    const original = sections[sectionId];
    if (original) {
      setEditedTexts((prev) => ({ ...prev, [sectionId]: original.text }));
      setSaved(false);
    }
  }

  async function handleDownload(format: "pdf" | "pptx") {
    setDownloading(format);
    try {
      const dataStr = sessionStorage.getItem("e5-report-data");
      const data = dataStr ? JSON.parse(dataStr) : {};
      const sectionsList = SECTION_META.map((s, idx) => ({
        id: s.id,
        title: `${idx + 1}. ${s.title}`,
        content: editedTexts[s.id] || sections[s.id]?.text || "",
      }));

      const response = await fetch(`/api/download/${format}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: companyName || "Unknown",
          industry: data.company?.industry || "Technology",
          sections: sectionsList,
          generatedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `E5-Business-Case-${companyName.replace(/[^a-zA-Z0-9]/g, "-")}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(`${format} download error:`, err);
    } finally {
      setDownloading(null);
    }
  }

  const currentText = editedTexts[activeSection] || "";
  const originalText = sections[activeSection]?.text || "";
  const isModified = currentText !== originalText;
  const wordCount = currentText.split(/\s+/).filter(Boolean).length;

  if (Object.keys(sections).length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-slate-400">Loading report...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-white">
      {/* Top bar */}
      <nav className="flex items-center justify-between border-b border-slate-100 px-6 py-3">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-lg font-bold text-slate-900">
            E5 Elevator
          </Link>
          <span className="text-sm text-slate-400">|</span>
          <span className="text-sm font-medium text-slate-700">
            {companyName} — Report Editor
          </span>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-xs text-green-600">Saved</span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
          <button
            onClick={() => handleDownload("pdf")}
            disabled={downloading !== null}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {downloading === "pdf" ? "Generating..." : "PDF"}
          </button>
          <button
            onClick={() => handleDownload("pptx")}
            disabled={downloading !== null}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {downloading === "pptx" ? "Generating..." : "PPTX"}
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Section navigation */}
        <aside className="w-64 flex-shrink-0 overflow-y-auto border-r border-slate-100 bg-slate-50">
          <div className="p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Report Sections
            </h3>
            <nav className="space-y-1">
              {SECTION_META.map((section, idx) => {
                const isActive = activeSection === section.id;
                const sectionEdited =
                  editedTexts[section.id] !== sections[section.id]?.text;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded text-xs font-bold ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="flex-1 truncate">{section.title}</span>
                    {sectionEdited && (
                      <span className="h-2 w-2 rounded-full bg-amber-400" title="Modified" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main editor area */}
        <main className="flex flex-1 flex-col overflow-hidden">
          {/* Section header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {SECTION_META.find((s) => s.id === activeSection)?.title}
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span>{wordCount} words</span>
                <span>Model: {sections[activeSection]?.model || "—"}</span>
                {isModified && (
                  <span className="text-amber-600">Modified</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isModified && (
                <button
                  onClick={() => handleResetSection(activeSection)}
                  className="rounded px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100"
                >
                  Reset to AI original
                </button>
              )}
            </div>
          </div>

          {/* Text editor */}
          <div className="flex-1 overflow-y-auto p-6">
            <textarea
              value={currentText}
              onChange={(e) => handleTextChange(activeSection, e.target.value)}
              className="h-full w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-800 font-mono focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="Section content..."
              spellCheck
            />
          </div>

          {/* Editor footer with tips */}
          <div className="border-t border-slate-100 px-6 py-2">
            <p className="text-xs text-slate-400">
              Edit the AI-generated content to match your company&apos;s voice.
              Citations in [Source: ...] format will be highlighted in the final report.
              Use **bold** for emphasis and ## for headings.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
