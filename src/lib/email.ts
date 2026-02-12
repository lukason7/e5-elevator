import { Resend } from "resend";

let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("RESEND_API_KEY not set");
    _resend = new Resend(key);
  }
  return _resend;
}

const FROM_EMAIL = "E5 Elevator <reports@e5elevator.com>";

interface SendReportEmailOptions {
  to: string;
  companyName: string;
  reportId: string;
  // Download links will be signed URLs or direct links
  pdfUrl?: string;
  pptxUrl?: string;
}

export async function sendReportEmail(options: SendReportEmailOptions) {
  const { to, companyName, reportId } = options;

  const { data, error } = await getResend().emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Your E5 Business Case Report - ${companyName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #1e3a5f; font-size: 24px; margin: 0;">E5 Elevator</h1>
        </div>

        <div style="background: #f8fafc; border-radius: 12px; padding: 32px; margin-bottom: 24px;">
          <h2 style="color: #0f172a; font-size: 20px; margin: 0 0 8px 0;">
            Your report is ready
          </h2>
          <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">
            Your full Microsoft 365 E5 Business Case for <strong>${companyName}</strong> has been generated and is ready to download.
          </p>

          <div style="background: white; border-radius: 8px; padding: 20px; border: 1px solid #e2e8f0;">
            <p style="color: #334155; font-size: 14px; margin: 0 0 16px 0; font-weight: 600;">
              Your report includes:
            </p>
            <ul style="color: #475569; font-size: 14px; line-height: 2; margin: 0; padding-left: 20px;">
              <li>9-section executive business case</li>
              <li>Risk quantification with real breach data</li>
              <li>TCO comparison and ROI projection</li>
              <li>Compliance framework gap analysis</li>
              <li>Board-ready PDF report</li>
              <li>PowerPoint presentation deck</li>
            </ul>
          </div>
        </div>

        <div style="text-align: center; margin-bottom: 32px;">
          <a href="https://e5elevator.com/report/download?id=${reportId}"
             style="display: inline-block; background: #1e3a5f; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 600;">
            Download Your Report
          </a>
        </div>

        <div style="background: #eff6ff; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <p style="color: #1e40af; font-size: 13px; margin: 0; line-height: 1.5;">
            <strong>30-day refresh:</strong> You can regenerate this report for free within 30 days if your requirements change.
          </p>
        </div>

        <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">
            E5 Elevator | AI-powered M365 E5 business cases
          </p>
          <p style="color: #94a3b8; font-size: 12px; margin: 4px 0 0 0;">
            Report ID: ${reportId}
          </p>
        </div>
      </div>
    `,
  });

  if (error) {
    console.error("Resend email error:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }

  return data;
}
