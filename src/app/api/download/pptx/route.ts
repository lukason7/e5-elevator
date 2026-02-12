import { NextRequest, NextResponse } from "next/server";
import { generateReportPptx } from "@/lib/pptx/generatePptx";

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyName, industry, sections, generatedAt } = body;

    if (!companyName || !sections || !Array.isArray(sections)) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const pptxBuffer = await generateReportPptx({
      companyName,
      industry: industry || "Unknown",
      sections,
      generatedAt: generatedAt || new Date().toISOString(),
    });

    const filename = `E5-Business-Case-${companyName.replace(/[^a-zA-Z0-9]/g, "-")}.pptx`;

    return new NextResponse(new Uint8Array(pptxBuffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(pptxBuffer.length),
      },
    });
  } catch (error) {
    console.error("PPTX generation error:", error);
    const message = error instanceof Error ? error.message : "PPTX generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
