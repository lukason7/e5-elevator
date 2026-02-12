import Link from "next/link";

const FEATURES = [
  {
    title: "Risk Quantification",
    description: "Your organisation's breach risk quantified in pounds and pence, based on industry data and company profile.",
    icon: "📊",
  },
  {
    title: "Breach Case Studies",
    description: "Real breach examples from your industry with verified costs and how E5 would have mitigated them.",
    icon: "🔓",
  },
  {
    title: "TCO Comparison",
    description: "Side-by-side cost analysis of E5 vs buying individual point solutions from multiple vendors.",
    icon: "💷",
  },
  {
    title: "Vendor Consolidation",
    description: "Map your current security stack to E5 equivalents and show the consolidation savings.",
    icon: "🔄",
  },
  {
    title: "Framework Gaps",
    description: "Gap analysis against Cyber Essentials, NIS2, DORA, ISO 27001, SOC 2, and NIST CSF.",
    icon: "✅",
  },
  {
    title: "ROI Projection",
    description: "Clear return-on-investment projections with Forrester TEI-backed methodology.",
    icon: "📈",
  },
];

const STEPS = [
  {
    number: "1",
    title: "Answer Questions",
    description: "Tell us about your company, current licensing, security tools, and compliance requirements. Takes about 5 minutes.",
  },
  {
    number: "2",
    title: "AI Generates Your Case",
    description: "Our AI analyses your inputs against industry data, breach statistics, and E5 capabilities to build a personalised business case.",
  },
  {
    number: "3",
    title: "Download & Present",
    description: "Review, edit, and download your report as a professional PDF and PowerPoint deck. Ready for the boardroom.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-slate-900">E5</span>
            <span className="text-xl font-light text-blue-600">Elevator</span>
          </div>
          <Link
            href="/start"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-16">
        <div className="max-w-3xl">
          <div className="mb-4 inline-block rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
            For IT & Security Professionals
          </div>
          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-slate-900">
            Build a board-ready{" "}
            <span className="text-blue-600">M365 E5 business case</span>{" "}
            in minutes, not weeks
          </h1>
          <p className="mb-8 text-xl leading-relaxed text-slate-600">
            Stop spending days cobbling together PowerPoints and Googling breach
            statistics. Our AI generates a comprehensive, source-cited business
            case for your E3 to E5 upgrade — personalised to your company,
            industry, and compliance requirements.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/start"
              className="rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              Build Your Business Case
            </Link>
            <span className="text-sm text-slate-500">
              Free preview · Full report £79
            </span>
          </div>
        </div>
      </section>

      {/* Social proof bar */}
      <section className="border-y border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <div className="flex flex-wrap items-center justify-between gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Every claim source-cited</span>
              <span>— no AI hallucinations</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Unbranded output</span>
              <span>— present it as your own</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Edit before download</span>
              <span>— full control over content</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="mb-4 text-center text-3xl font-bold text-slate-900">
          How it works
        </h2>
        <p className="mb-12 text-center text-lg text-slate-500">
          From questionnaire to boardroom-ready report in three steps
        </p>
        <div className="grid gap-8 md:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.number} className="relative rounded-xl border border-slate-200 bg-white p-8">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                {step.number}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                {step.title}
              </h3>
              <p className="text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What you get */}
      <section className="border-y border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="mb-4 text-center text-3xl font-bold text-slate-900">
            What&apos;s in the report
          </h2>
          <p className="mb-12 text-center text-lg text-slate-500">
            Everything you need to convince your board, tailored to your company
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-slate-200 bg-white p-6"
              >
                <div className="mb-3 text-2xl">{feature.icon}</div>
                <h3 className="mb-2 text-base font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="mb-12 text-center text-3xl font-bold text-slate-900">
          Simple pricing
        </h2>
        <div className="mx-auto grid max-w-3xl gap-8 md:grid-cols-2">
          {/* Free tier */}
          <div className="rounded-xl border border-slate-200 p-8">
            <h3 className="mb-1 text-lg font-semibold text-slate-900">
              Preview
            </h3>
            <div className="mb-4 text-3xl font-bold text-slate-900">Free</div>
            <ul className="mb-6 space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-500">✓</span>
                Executive summary
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-500">✓</span>
                Overall risk score
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-500">✓</span>
                Preview of all sections
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-slate-300">✗</span>
                <span className="text-slate-400">Full analysis (watermarked)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-slate-300">✗</span>
                <span className="text-slate-400">PDF &amp; PowerPoint export</span>
              </li>
            </ul>
            <Link
              href="/start"
              className="block rounded-lg border border-slate-200 px-4 py-2.5 text-center text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Try for free
            </Link>
          </div>

          {/* Paid tier */}
          <div className="rounded-xl border-2 border-blue-600 p-8 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                Full Report
              </h3>
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                Most popular
              </span>
            </div>
            <div className="mb-4">
              <span className="text-3xl font-bold text-slate-900">£79</span>
              <span className="text-sm text-slate-500"> per report</span>
            </div>
            <ul className="mb-6 space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-500">✓</span>
                Complete analysis — all sections, full depth
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-500">✓</span>
                Source citations on every claim
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-500">✓</span>
                Edit &amp; customise before download
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-500">✓</span>
                Professional PDF report
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-500">✓</span>
                Unbranded PowerPoint deck
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-500">✓</span>
                30-day free refresh window
              </li>
            </ul>
            <Link
              href="/start"
              className="block rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Build your business case
            </Link>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-slate-400">
          A consultant would charge £500–2,000+ for a similar deliverable.
        </p>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-100 bg-slate-900">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">
            Stop winging it. Start presenting data.
          </h2>
          <p className="mb-8 text-lg text-slate-300">
            Your board doesn&apos;t care about features — they care about risk,
            cost, and ROI. Give them the numbers.
          </p>
          <Link
            href="/start"
            className="inline-block rounded-lg bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-blue-500"
          >
            Build Your Business Case
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-slate-400">
            <div>
              <span className="font-semibold text-slate-600">E5 Elevator</span>
              {" "}· AI-powered M365 E5 business case generation
            </div>
            <div className="flex gap-6">
              <span>Terms</span>
              <span>Privacy</span>
              <span>Contact</span>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-400">
            Reports are generated using AI and should be reviewed for accuracy
            before presentation. All data claims include source citations for
            independent verification. This tool is not affiliated with or
            endorsed by Microsoft Corporation.
          </p>
        </div>
      </footer>
    </div>
  );
}
