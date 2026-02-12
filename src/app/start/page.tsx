"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { INDUSTRIES } from "@/data/industries";

interface CompanyResult {
  name: string;
  number: string;
  address: string;
  sicCodes: string[];
  incorporatedDate: string | null;
}

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

const EMPLOYEE_RANGES = [
  { value: "1-10", label: "1–10 employees" },
  { value: "11-50", label: "11–50 employees" },
  { value: "51-200", label: "51–200 employees" },
  { value: "201-500", label: "201–500 employees" },
  { value: "501-1000", label: "501–1,000 employees" },
  { value: "1001-5000", label: "1,001–5,000 employees" },
  { value: "5000+", label: "5,000+ employees" },
];

const REVENUE_BANDS = [
  { value: "under-1m", label: "Under £1M" },
  { value: "1m-5m", label: "£1M–£5M" },
  { value: "5m-25m", label: "£5M–£25M" },
  { value: "25m-100m", label: "£25M–£100M" },
  { value: "100m-500m", label: "£100M–£500M" },
  { value: "500m+", label: "£500M+" },
  { value: "unknown", label: "Prefer not to say" },
];

export default function StartPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<CompanyResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<CompanyResult | null>(null);

  const [companyData, setCompanyData] = useState<CompanyData>({
    name: "",
    companiesHouseNumber: "",
    industry: "",
    employeeCount: "",
    revenueBand: "",
    country: "UK",
    annualReportUrl: "",
    source: "manual",
  });

  const searchCompanies = useCallback(async (query: string) => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    setSearching(true);
    setApiError(null);

    try {
      const response = await fetch(`/api/company-lookup?q=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (data.error) {
        setApiError(data.error);
        setResults([]);
      } else {
        setResults(data.results);
      }
    } catch {
      setApiError("Search failed. Please use manual entry.");
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    if (!searchQuery || showManual) return;

    const timer = setTimeout(() => {
      searchCompanies(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, showManual, searchCompanies]);

  function selectCompany(company: CompanyResult) {
    setSelectedCompany(company);
    setResults([]);

    // Try to map SIC code to industry
    const matchedIndustry = INDUSTRIES.find((ind) =>
      ind.sicCodePrefixes.some((prefix) =>
        company.sicCodes.some((sic) => sic.startsWith(prefix))
      )
    );

    setCompanyData({
      name: company.name,
      companiesHouseNumber: company.number,
      industry: matchedIndustry?.id || "",
      employeeCount: "",
      revenueBand: "",
      country: "UK",
      annualReportUrl: "",
      source: "lookup",
    });
  }

  function handleContinue() {
    if (!companyData.name || !companyData.industry || !companyData.employeeCount) {
      return;
    }

    // Store in sessionStorage for the questionnaire page
    sessionStorage.setItem("e5-company-data", JSON.stringify(companyData));
    router.push("/questionnaire");
  }

  const isFormValid = companyData.name && companyData.industry && companyData.employeeCount;

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-slate-900">E5</span>
            <span className="text-xl font-light text-blue-600">Elevator</span>
          </Link>
          <div className="text-sm text-slate-400">Step 1 of 3</div>
        </div>
      </nav>

      <div className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="mb-2 text-3xl font-bold text-slate-900">
          Let&apos;s start with your company
        </h1>
        <p className="mb-8 text-lg text-slate-500">
          We&apos;ll use this to personalise your E5 business case with
          industry-relevant data.
        </p>

        {/* Company search */}
        {!showManual && !selectedCompany && (
          <div className="mb-6">
            <label
              htmlFor="company-search"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Search for your company
            </label>
            <input
              id="company-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter company name..."
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              autoFocus
            />

            {searching && (
              <div className="mt-2 text-sm text-slate-400">Searching...</div>
            )}

            {apiError && (
              <div className="mt-2 text-sm text-amber-600">{apiError}</div>
            )}

            {/* Search results */}
            {results.length > 0 && (
              <div className="mt-2 overflow-hidden rounded-lg border border-slate-200">
                {results.map((company) => (
                  <button
                    key={company.number}
                    onClick={() => selectCompany(company)}
                    className="flex w-full flex-col gap-0.5 border-b border-slate-100 px-4 py-3 text-left transition-colors hover:bg-slate-50 last:border-b-0"
                  >
                    <span className="font-medium text-slate-900">
                      {company.name}
                    </span>
                    <span className="text-sm text-slate-500">
                      {company.address}
                    </span>
                    <span className="text-xs text-slate-400">
                      Company #{company.number}
                      {company.sicCodes.length > 0 &&
                        ` · SIC: ${company.sicCodes.join(", ")}`}
                    </span>
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowManual(true)}
              className="mt-3 text-sm text-blue-600 hover:text-blue-700"
            >
              Can&apos;t find your company? Enter details manually
            </button>
          </div>
        )}

        {/* Selected company badge */}
        {selectedCompany && (
          <div className="mb-6 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3">
            <div>
              <div className="font-medium text-green-900">
                {selectedCompany.name}
              </div>
              <div className="text-sm text-green-700">
                {selectedCompany.address}
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedCompany(null);
                setSearchQuery("");
                setCompanyData({
                  name: "",
                  companiesHouseNumber: "",
                  industry: "",
                  employeeCount: "",
                  revenueBand: "",
                  country: "UK",
                  annualReportUrl: "",
                  source: "manual",
                });
              }}
              className="text-sm text-green-600 hover:text-green-700"
            >
              Change
            </button>
          </div>
        )}

        {/* Company details form */}
        {(showManual || selectedCompany) && (
          <div className="space-y-5">
            {showManual && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Company name *
                </label>
                <input
                  type="text"
                  value={companyData.name}
                  onChange={(e) =>
                    setCompanyData({ ...companyData, name: e.target.value })
                  }
                  placeholder="Enter company name"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Industry *
              </label>
              <select
                value={companyData.industry}
                onChange={(e) =>
                  setCompanyData({ ...companyData, industry: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Select industry</option>
                {INDUSTRIES.map((ind) => (
                  <option key={ind.id} value={ind.id}>
                    {ind.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Number of employees *
              </label>
              <select
                value={companyData.employeeCount}
                onChange={(e) =>
                  setCompanyData({
                    ...companyData,
                    employeeCount: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Select range</option>
                {EMPLOYEE_RANGES.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Annual revenue
              </label>
              <select
                value={companyData.revenueBand}
                onChange={(e) =>
                  setCompanyData({
                    ...companyData,
                    revenueBand: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Select range (optional)</option>
                {REVENUE_BANDS.map((band) => (
                  <option key={band.value} value={band.value}>
                    {band.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Annual report URL
              </label>
              <input
                type="url"
                value={companyData.annualReportUrl}
                onChange={(e) =>
                  setCompanyData({
                    ...companyData,
                    annualReportUrl: e.target.value,
                  })
                }
                placeholder="https://... (optional — for larger companies)"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <p className="mt-1 text-xs text-slate-400">
                If your company publishes an annual report, we can analyse it to
                align E5 capabilities with stated business priorities.
              </p>
            </div>

            {showManual && (
              <button
                onClick={() => {
                  setShowManual(false);
                  setSearchQuery("");
                }}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                ← Back to search
              </button>
            )}

            <button
              onClick={handleContinue}
              disabled={!isFormValid}
              className="w-full rounded-lg bg-blue-600 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
            >
              Continue to questionnaire
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
