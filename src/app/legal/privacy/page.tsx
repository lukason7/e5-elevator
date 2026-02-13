export const metadata = {
  title: "Privacy Policy | E5 Elevator",
};

export default function PrivacyPage() {
  return (
    <article className="prose prose-slate max-w-none">
      <h1>Privacy Policy</h1>
      <p className="text-sm text-slate-500">Last updated: February 2026</p>

      <h2>1. Who We Are</h2>
      <p>
        E5 Elevator is operated as a sole trader business registered in the United Kingdom.
        We are the data controller for the personal data collected through this service.
      </p>

      <h2>2. What Data We Collect</h2>
      <h3>Data you provide:</h3>
      <ul>
        <li><strong>Company information:</strong> Company name, registration number, industry, and size (via Companies House public API)</li>
        <li><strong>Questionnaire responses:</strong> Current licensing, security posture, compliance requirements, and budget information</li>
        <li><strong>Payment information:</strong> Processed by Stripe &mdash; we do not store card details</li>
        <li><strong>Email address:</strong> If provided for report delivery</li>
      </ul>
      <h3>Data collected automatically:</h3>
      <ul>
        <li><strong>Analytics:</strong> Page views and feature usage via PostHog (anonymised)</li>
        <li><strong>Technical data:</strong> Browser type, device type for compatibility</li>
      </ul>

      <h2>3. How We Use Your Data</h2>
      <ul>
        <li>To generate your personalised business case report</li>
        <li>To process payments via Stripe</li>
        <li>To deliver reports via email (if requested)</li>
        <li>To improve the Service through anonymised analytics</li>
      </ul>

      <h2>4. Third-Party Services</h2>
      <table>
        <thead>
          <tr>
            <th>Service</th>
            <th>Purpose</th>
            <th>Data shared</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Companies House API</td>
            <td>Company lookup</td>
            <td>Company number (public data)</td>
          </tr>
          <tr>
            <td>Google Gemini / OpenAI / Anthropic</td>
            <td>AI report generation</td>
            <td>Anonymised questionnaire data</td>
          </tr>
          <tr>
            <td>Stripe</td>
            <td>Payment processing</td>
            <td>Payment details (PCI-compliant)</td>
          </tr>
          <tr>
            <td>Resend</td>
            <td>Transactional emails</td>
            <td>Email address, report ID</td>
          </tr>
          <tr>
            <td>Vercel</td>
            <td>Hosting</td>
            <td>Standard web request data</td>
          </tr>
          <tr>
            <td>PostHog</td>
            <td>Analytics</td>
            <td>Anonymised usage data</td>
          </tr>
        </tbody>
      </table>

      <h2>5. Data Retention</h2>
      <ul>
        <li><strong>Report data:</strong> Stored for 90 days to enable the 30-day refresh feature, then deleted</li>
        <li><strong>Payment records:</strong> Retained as required by UK tax law (6 years)</li>
        <li><strong>Analytics:</strong> Anonymised, retained indefinitely</li>
      </ul>

      <h2>6. Your Rights (UK GDPR)</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Access your personal data</li>
        <li>Rectify inaccurate data</li>
        <li>Request deletion of your data</li>
        <li>Object to processing</li>
        <li>Data portability</li>
        <li>Lodge a complaint with the ICO (ico.org.uk)</li>
      </ul>

      <h2>7. Cookies</h2>
      <p>
        We use essential cookies for site functionality and analytics cookies (PostHog)
        for improving the service. You can opt out of analytics cookies via your browser settings.
      </p>

      <h2>8. Contact</h2>
      <p>
        For data protection queries, contact: support@e5elevator.com
      </p>
    </article>
  );
}
