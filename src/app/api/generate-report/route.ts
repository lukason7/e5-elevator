import { NextRequest, NextResponse } from "next/server";
import { generateText } from "@/lib/ai/models";
import {
  buildExecutiveSummaryPrompt,
  buildRiskQuantificationPrompt,
  buildVendorConsolidationPrompt,
  buildBreachCaseStudiesPrompt,
  buildTCOComparisonPrompt,
  buildFrameworkGapAnalysisPrompt,
  buildPeerBenchmarkingPrompt,
  buildInvestmentRoadmapPrompt,
  buildROIProjectionPrompt,
  type ReportContext,
} from "@/lib/ai/prompts";
import { getIndustryById } from "@/data/industries";
import { getWorkloadById } from "@/data/e5-workloads";
import { getFrameworksForIndustry } from "@/data/frameworks";

export const maxDuration = 60; // Allow up to 60s for AI generation

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { company, answers, selectedWorkloads, sections } = body;

    if (!company || !answers || !selectedWorkloads) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Build report context
    const industry = getIndustryById(company.industry);
    if (!industry) {
      return NextResponse.json(
        { error: "Unknown industry" },
        { status: 400 }
      );
    }

    const workloads = selectedWorkloads
      .map((id: string) => getWorkloadById(id))
      .filter(Boolean);

    const frameworks = getFrameworksForIndustry(company.industry);

    const ctx: ReportContext = {
      companyName: company.name,
      industry,
      employeeCount: company.employeeCount,
      revenueBand: company.revenueBand || "not disclosed",
      currentLicense: answers["current-license"] || "E3",
      licensedUsers: answers["licensed-users"] || "unknown",
      perUserCost: answers["per-user-cost"] || "",
      addonLicenses: (answers["addon-licenses"] as string[]) || [],
      securityTools: (answers["current-security-tools"] as string[]) || [],
      securityVendors: (answers["security-vendor-names"] as string) || "",
      selectedWorkloads: workloads,
      relevantFrameworks: frameworks,
      evaluationDrivers: (answers["evaluation-drivers"] as string[]) || [],
      presentationAudience:
        (answers["presentation-audience"] as string[]) || [],
      securityIncident: (answers["security-incident"] as string) || "unknown",
      cyberInsurance: (answers["cyber-insurance"] as string) || "unknown",
      complianceFrameworks:
        (answers["compliance-frameworks"] as string[]) || [],
      e5QuotedPrice: (answers["e5-quoted-price"] as string) || "",
      agreementType: (answers["agreement-type"] as string) || "",
      contractTerm: (answers["contract-term"] as string) || "",
    };

    // Determine which sections to generate
    const requestedSections = sections || ["executive-summary"];

    // Generate each section in parallel
    const sectionPromises: Record<
      string,
      Promise<{ text: string; model: string; costUSD: number; durationMs: number }>
    > = {};

    for (const section of requestedSections) {
      switch (section) {
        case "executive-summary": {
          const { systemPrompt, prompt } = buildExecutiveSummaryPrompt(ctx);
          sectionPromises[section] = generateText({
            systemPrompt,
            prompt,
            maxTokens: 2048,
            temperature: 0.7,
          });
          break;
        }
        case "risk-quantification": {
          const { systemPrompt, prompt } = buildRiskQuantificationPrompt(ctx);
          sectionPromises[section] = generateText({
            systemPrompt,
            prompt,
            maxTokens: 3072,
            temperature: 0.6,
          });
          break;
        }
        case "vendor-consolidation": {
          const { systemPrompt, prompt } = buildVendorConsolidationPrompt(ctx);
          sectionPromises[section] = generateText({
            systemPrompt,
            prompt,
            maxTokens: 2048,
            temperature: 0.6,
          });
          break;
        }
        case "breach-case-studies": {
          const { systemPrompt, prompt } = buildBreachCaseStudiesPrompt(ctx);
          sectionPromises[section] = generateText({
            systemPrompt,
            prompt,
            maxTokens: 3072,
            temperature: 0.5,
          });
          break;
        }
        case "tco-comparison": {
          const { systemPrompt, prompt } = buildTCOComparisonPrompt(ctx);
          sectionPromises[section] = generateText({
            systemPrompt,
            prompt,
            maxTokens: 2048,
            temperature: 0.4,
          });
          break;
        }
        case "framework-gap-analysis": {
          const { systemPrompt, prompt } = buildFrameworkGapAnalysisPrompt(ctx);
          sectionPromises[section] = generateText({
            systemPrompt,
            prompt,
            maxTokens: 3072,
            temperature: 0.5,
          });
          break;
        }
        case "peer-benchmarking": {
          const { systemPrompt, prompt } = buildPeerBenchmarkingPrompt(ctx);
          sectionPromises[section] = generateText({
            systemPrompt,
            prompt,
            maxTokens: 1536,
            temperature: 0.6,
          });
          break;
        }
        case "investment-roadmap": {
          const { systemPrompt, prompt } = buildInvestmentRoadmapPrompt(ctx);
          sectionPromises[section] = generateText({
            systemPrompt,
            prompt,
            maxTokens: 2048,
            temperature: 0.6,
          });
          break;
        }
        case "roi-projection": {
          const { systemPrompt, prompt } = buildROIProjectionPrompt(ctx);
          sectionPromises[section] = generateText({
            systemPrompt,
            prompt,
            maxTokens: 2048,
            temperature: 0.4,
          });
          break;
        }
        default:
          // Section not yet implemented
          sectionPromises[section] = Promise.resolve({
            text: `[Section "${section}" will be available in the next update.]`,
            model: "placeholder",
            costUSD: 0,
            durationMs: 0,
          });
      }
    }

    // Await all sections
    const results: Record<
      string,
      { text: string; model: string; costUSD: number; durationMs: number }
    > = {};
    let totalCostUSD = 0;

    const entries = Object.entries(sectionPromises);
    const resolved = await Promise.all(entries.map(([, p]) => p));

    for (let i = 0; i < entries.length; i++) {
      const key = entries[i][0];
      results[key] = resolved[i];
      totalCostUSD += resolved[i].costUSD;
    }

    return NextResponse.json({
      sections: results,
      totalCostUSD,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Report generation error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
