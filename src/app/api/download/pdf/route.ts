import { NextRequest, NextResponse } from "next/server";
import { generateReportPdf } from "@/lib/pdf/generatePdf";

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

    const pdfBuffer = await generateReportPdf({
      companyName,
      industry: industry || "Unknown",
      sections,
      generatedAt: generatedAt || new Date().toISOString(),
    });

    const filename = `E5-Business-Case-${companyName.replace(/[^a-zA-Z0-9]/g, "-")}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(pdfBuffer.length),
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    const message = error instanceof Error ? error.message : "PDF generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
