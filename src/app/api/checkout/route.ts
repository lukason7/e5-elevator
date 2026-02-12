import { NextRequest, NextResponse } from "next/server";
import { getStripe, REPORT_PRICE_PENCE } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyName, reportId } = body;

    if (!companyName || !reportId) {
      return NextResponse.json(
        { error: "Missing required fields: companyName and reportId" },
        { status: 400 }
      );
    }

    const origin = request.headers.get("origin") || "http://localhost:3000";

    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: `E5 Business Case Report - ${companyName}`,
              description:
                "Full 9-section business case report with PDF export and PowerPoint deck",
            },
            unit_amount: REPORT_PRICE_PENCE,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/report/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/preview`,
      metadata: {
        reportId,
        companyName,
      },
      payment_intent_data: {
        metadata: {
          reportId,
          companyName,
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout session creation error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create checkout session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
