"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  QUESTIONS,
  getQuestionsByStage,
  shouldShowQuestion,
  type Question,
} from "@/data/questions";
import {
  E5_WORKLOADS,
  WORKLOAD_CATEGORIES,
  getWorkloadsByCategory,
} from "@/data/e5-workloads";

interface CompanyData {
  name: string;
  companiesHouseNumber: string;
  industry: string;
  employeeCount: string;
  revenueBand: string;
  country: string;
  annualReportUrl: string;
  source: "lookup" | "manual";
}

const STAGES = [
  { number: 2, label: "Licensing" },
  { number: 3, label: "Security" },
  { number: 4, label: "Priorities" },
  { number: 5, label: "Workloads" },
  { number: 6, label: "Pricing" },
];

export default function QuestionnairePage() {
  const router = useRouter();
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [currentStage, setCurrentStage] = useState(2);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [selectedWorkloads, setSelectedWorkloads] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load company data from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem("e5-company-data");
    if (stored) {
      const data = JSON.parse(stored) as CompanyData;
      setCompanyData(data);
      // Pre-set the industry answer so showIf rules work
      setAnswers((prev) => ({ ...prev, industry: data.industry }));
    } else {
      router.push("/start");
    }
  }, [router]);

  // Get visible questions for current stage
  const visibleQuestions = useMemo(() => {
    if (currentStage === 5) return []; // Stage 5 uses workload selector
    return getQuestionsByStage(currentStage).filter((q) =>
      shouldShowQuestion(q, answers)
    );
  }, [currentStage, answers]);

  function setAnswer(questionId: string, value: string | string[]) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    // Clear error when user answers
    if (errors[questionId]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[questionId];
        return next;
      });
    }
  }

  function toggleMultiSelect(questionId: string, value: string) {
    const current = (answers[questionId] as string[]) || [];
    if (value === "none") {
      // "None" clears other selections
      setAnswer(questionId, ["none"]);
      return;
    }
    const withoutNone = current.filter((v) => v !== "none");
    if (withoutNone.includes(value)) {
      setAnswer(
        questionId,
        withoutNone.filter((v) => v !== value)
      );
    } else {
      setAnswer(questionId, [...withoutNone, value]);
    }
  }

  function toggleWorkload(workloadId: string) {
    setSelectedWorkloads((prev) =>
      prev.includes(workloadId)
        ? prev.filter((id) => id !== workloadId)
        : [...prev, workloadId]
    );
  }

  function validateStage(): boolean {
    if (currentStage === 5) {
      // At least one workload must be selected
      if (selectedWorkloads.length === 0) {
        setErrors({ workloads: "Select at least one E5 workload" });
        return false;
      }
      setErrors({});
      return true;
    }

    const newErrors: Record<string, string> = {};
    for (const q of visibleQuestions) {
      if (q.required) {
        const answer = answers[q.id];
        if (!answer || (Array.isArray(answer) && answer.length === 0)) {
          newErrors[q.id] = "This field is required";
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleNext() {
    if (!validateStage()) return;

    const currentIdx = STAGES.findIndex((s) => s.number === currentStage);
    if (currentIdx < STAGES.length - 1) {
      setCurrentStage(STAGES[currentIdx + 1].number);
      window.scrollTo(0, 0);
    } else {
      // All stages complete — store and navigate
      const reportData = {
        company: companyData,
        answers,
        selectedWorkloads,
        completedAt: new Date().toISOString(),
      };
      sessionStorage.setItem("e5-report-data", JSON.stringify(reportData));
      router.push("/preview");
    }
  }

  function handleBack() {
    const currentIdx = STAGES.findIndex((s) => s.number === currentStage);
    if (currentIdx > 0) {
      setCurrentStage(STAGES[currentIdx - 1].number);
      window.scrollTo(0, 0);
    } else {
      router.push("/start");
    }
  }

  if (!companyData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  const currentStageIdx = STAGES.findIndex((s) => s.number === currentStage);
  const isLastStage = currentStageIdx === STAGES.length - 1;

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-slate-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold text-slate-900">
            E5 Elevator
          </Link>
          <div className="text-sm text-slate-500">
            Building case for{" "}
            <span className="font-medium text-slate-700">
              {companyData.name}
            </span>
          </div>
        </div>
      </nav>

      {/* Progress bar */}
      <div className="border-b border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-2xl px-6 py-4">
          <div className="mb-2 flex items-center justify-between">
            {STAGES.map((stage, idx) => (
              <button
                key={stage.number}
                onClick={() => {
                  // Allow navigating to previous stages
                  if (idx <= currentStageIdx) {
                    setCurrentStage(stage.number);
                  }
                }}
                className={`flex items-center gap-2 text-sm font-medium ${
                  stage.number === currentStage
                    ? "text-blue-600"
                    : idx < currentStageIdx
                      ? "cursor-pointer text-slate-700 hover:text-blue-600"
                      : "text-slate-400"
                }`}
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                    stage.number === currentStage
                      ? "bg-blue-600 text-white"
                      : idx < currentStageIdx
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-200 text-slate-400"
                  }`}
                >
                  {idx < currentStageIdx ? "\u2713" : idx + 1}
                </span>
                <span className="hidden sm:inline">{stage.label}</span>
              </button>
            ))}
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-300"
              style={{
                width: `${((currentStageIdx + 1) / STAGES.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="mx-auto max-w-2xl px-6 py-8">
        {currentStage === 5 ? (
          <WorkloadSelector
            selectedWorkloads={selectedWorkloads}
            toggleWorkload={toggleWorkload}
            error={errors.workloads}
          />
        ) : (
          <div className="space-y-6">
            {visibleQuestions.map((question) => (
              <QuestionField
                key={question.id}
                question={question}
                value={answers[question.id]}
                onChange={(val) => setAnswer(question.id, val)}
                onToggleMulti={(val) => toggleMultiSelect(question.id, val)}
                error={errors[question.id]}
              />
            ))}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="mt-10 flex items-center justify-between border-t border-slate-100 pt-6">
          <button
            onClick={handleBack}
            className="text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            &larr; Back
          </button>
          <button
            onClick={handleNext}
            className="rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            {isLastStage ? "Generate business case" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Question Field Component ---

function QuestionField({
  question,
  value,
  onChange,
  onToggleMulti,
  error,
}: {
  question: Question;
  value: string | string[] | undefined;
  onChange: (val: string | string[]) => void;
  onToggleMulti: (val: string) => void;
  error?: string;
}) {
  const inputClasses =
    "w-full rounded-lg border px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20";
  const borderClass = error
    ? "border-red-300 focus:border-red-500"
    : "border-slate-300 focus:border-blue-500";

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {question.text}
        {question.required && <span className="ml-1 text-red-400">*</span>}
      </label>

      {question.helpText && (
        <p className="mb-2 text-xs text-slate-400">{question.helpText}</p>
      )}

      {question.type === "text" || question.type === "url" ? (
        <input
          type={question.type === "url" ? "url" : "text"}
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder}
          className={`${inputClasses} ${borderClass}`}
        />
      ) : question.type === "number" ? (
        <input
          type="number"
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder}
          className={`${inputClasses} ${borderClass}`}
          min="1"
        />
      ) : question.type === "select" ? (
        <select
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClasses} ${borderClass}`}
        >
          <option value="">Select an option</option>
          {question.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : question.type === "radio" ? (
        <div className="space-y-2">
          {question.options?.map((opt) => (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${
                value === opt.value
                  ? "border-blue-300 bg-blue-50"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              <input
                type="radio"
                name={question.id}
                value={opt.value}
                checked={value === opt.value}
                onChange={(e) => onChange(e.target.value)}
                className="h-4 w-4 text-blue-600"
              />
              <span className="text-sm text-slate-700">{opt.label}</span>
            </label>
          ))}
        </div>
      ) : question.type === "multi-select" ? (
        <div className="space-y-2">
          {question.options?.map((opt) => {
            const selected = Array.isArray(value) && value.includes(opt.value);
            return (
              <label
                key={opt.value}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${
                  selected
                    ? "border-blue-300 bg-blue-50"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => onToggleMulti(opt.value)}
                  className="h-4 w-4 rounded text-blue-600"
                />
                <span className="text-sm text-slate-700">{opt.label}</span>
              </label>
            );
          })}
        </div>
      ) : null}

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

// --- Workload Selector (Stage 5) ---

function WorkloadSelector({
  selectedWorkloads,
  toggleWorkload,
  error,
}: {
  selectedWorkloads: string[];
  toggleWorkload: (id: string) => void;
  error?: string;
}) {
  return (
    <div>
      <h2 className="mb-1 text-2xl font-bold text-slate-900">
        Which E5 capabilities matter to you?
      </h2>
      <p className="mb-6 text-sm text-slate-500">
        Select the E5 workloads your organisation would benefit from. This
        determines which sections appear in your business case.
      </p>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="space-y-8">
        {WORKLOAD_CATEGORIES.map((category) => {
          const workloads = getWorkloadsByCategory(category.id);
          if (workloads.length === 0) return null;

          return (
            <div key={category.id}>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
                <span>{category.icon}</span>
                {category.name}
              </h3>
              <div className="space-y-2">
                {workloads.map((workload) => {
                  const selected = selectedWorkloads.includes(workload.id);
                  return (
                    <button
                      key={workload.id}
                      onClick={() => toggleWorkload(workload.id)}
                      className={`w-full rounded-lg border px-4 py-3 text-left transition-colors ${
                        selected
                          ? "border-blue-300 bg-blue-50"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-slate-900">
                            {workload.name}
                          </div>
                          <div className="mt-0.5 text-xs text-slate-500">
                            {workload.description}
                          </div>
                          <div className="mt-1 text-xs text-blue-600">
                            {workload.businessValue}
                          </div>
                        </div>
                        <div
                          className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border ${
                            selected
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-slate-300"
                          }`}
                        >
                          {selected && (
                            <svg
                              className="h-3 w-3"
                              fill="currentColor"
                              viewBox="0 0 12 12"
                            >
                              <path d="M10.28 2.28a.75.75 0 00-1.06-1.06L4.5 5.94 2.78 4.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l5.25-5.25z" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-sm text-slate-400">
        {selectedWorkloads.length} workload
        {selectedWorkloads.length !== 1 ? "s" : ""} selected
      </div>
    </div>
  );
}
