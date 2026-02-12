import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";

interface PdfOptions {
  companyName: string;
  industry: string;
  sections: Array<{
    id: string;
    title: string;
    content: string;
  }>;
  generatedAt: string;
}

const BLUE = "#1e3a5f";
const SLATE = "#475569";
const LIGHT_BG = "#f8fafc";

const styles = StyleSheet.create({
  page: {
    paddingTop: 60,
    paddingBottom: 60,
    paddingHorizontal: 50,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1e293b",
    lineHeight: 1.5,
  },
  // Title page
  titlePage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  titleMain: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: BLUE,
    textAlign: "center",
    marginBottom: 12,
  },
  titleSub: {
    fontSize: 16,
    color: SLATE,
    textAlign: "center",
    marginBottom: 6,
  },
  titleCompany: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    textAlign: "center",
    marginBottom: 30,
  },
  titleDate: {
    fontSize: 11,
    color: SLATE,
    textAlign: "center",
    marginBottom: 4,
  },
  titleBranding: {
    fontSize: 10,
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 40,
  },
  divider: {
    width: 80,
    height: 2,
    backgroundColor: BLUE,
    marginVertical: 20,
  },
  // TOC
  tocTitle: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: BLUE,
    marginBottom: 24,
  },
  tocItem: {
    fontSize: 12,
    color: "#334155",
    marginBottom: 10,
    paddingLeft: 8,
  },
  // Content sections
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: BLUE,
    marginBottom: 12,
    marginTop: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  heading2: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#1e293b",
    marginTop: 12,
    marginBottom: 6,
  },
  heading3: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#334155",
    marginTop: 10,
    marginBottom: 4,
  },
  paragraph: {
    fontSize: 10,
    color: "#334155",
    marginBottom: 6,
    lineHeight: 1.6,
  },
  bullet: {
    flexDirection: "row",
    marginBottom: 4,
    paddingLeft: 12,
  },
  bulletDot: {
    width: 12,
    fontSize: 10,
    color: BLUE,
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
    color: "#334155",
    lineHeight: 1.5,
  },
  citation: {
    fontSize: 8,
    color: "#6b7280",
    fontFamily: "Helvetica-Oblique",
    marginBottom: 4,
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 30,
    left: 50,
    right: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 8,
  },
  footerText: {
    fontSize: 8,
    color: "#94a3b8",
  },
  // Confidential banner
  confidentialBg: {
    backgroundColor: LIGHT_BG,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginBottom: 16,
  },
  confidentialText: {
    fontSize: 9,
    color: SLATE,
    textAlign: "center",
    fontFamily: "Helvetica-Bold",
  },
});

function Footer() {
  return (
    <View style={styles.footer} fixed>
      <Text style={styles.footerText}>E5 Elevator</Text>
      <Text style={styles.footerText}>Confidential</Text>
      <Text
        style={styles.footerText}
        render={({ pageNumber, totalPages }) =>
          `Page ${pageNumber} of ${totalPages}`
        }
      />
    </View>
  );
}

/** Parse markdown-like text into react-pdf elements */
function renderContent(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Headings
    if (line.startsWith("### ")) {
      elements.push(
        <Text key={i} style={styles.heading3}>
          {stripFormatting(line.slice(4))}
        </Text>
      );
      continue;
    }
    if (line.startsWith("## ")) {
      elements.push(
        <Text key={i} style={styles.heading2}>
          {stripFormatting(line.slice(3))}
        </Text>
      );
      continue;
    }

    // Bullet points
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const content = line.slice(2);
      elements.push(
        <View key={i} style={styles.bullet}>
          <Text style={styles.bulletDot}>{"\u2022"}</Text>
          <Text style={styles.bulletText}>{renderInlineText(content)}</Text>
        </View>
      );
      continue;
    }

    // Numbered list
    if (/^\d+\.\s/.test(line)) {
      const num = line.match(/^(\d+)\./)?.[1] || "";
      const content = line.replace(/^\d+\.\s/, "");
      elements.push(
        <View key={i} style={styles.bullet}>
          <Text style={styles.bulletDot}>{num}.</Text>
          <Text style={styles.bulletText}>{renderInlineText(content)}</Text>
        </View>
      );
      continue;
    }

    // Table rows - render as plain text
    if (line.startsWith("|")) {
      if (line.match(/^\|[-\s|]+\|$/)) continue; // Skip separator rows
      elements.push(
        <Text key={i} style={{ ...styles.paragraph, fontFamily: "Courier", fontSize: 8 }}>
          {line}
        </Text>
      );
      continue;
    }

    // Citation lines
    if (line.match(/^\[Source:/)) {
      elements.push(
        <Text key={i} style={styles.citation}>
          {line}
        </Text>
      );
      continue;
    }

    // Regular paragraph
    elements.push(
      <Text key={i} style={styles.paragraph}>
        {renderInlineText(line)}
      </Text>
    );
  }

  return elements;
}

/** Strip bold markers and citation brackets for headings */
function stripFormatting(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\[Source:[^\]]+\]/g, "");
}

/** Render inline text - strips markdown bold (react-pdf doesn't support nested Text easily) */
function renderInlineText(text: string): string {
  // Strip bold markers and keep the text
  let result = text.replace(/\*\*([^*]+)\*\*/g, "$1");
  // Inline citations stay as-is (will be rendered as italic at paragraph level)
  return result;
}

function ReportDocument({ options }: { options: PdfOptions }) {
  const dateStr = new Date(options.generatedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Document
      title={`E5 Business Case - ${options.companyName}`}
      author="E5 Elevator"
      subject="Microsoft 365 E5 Upgrade Business Case"
    >
      {/* Title Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.titlePage}>
          <Text style={styles.titleMain}>Microsoft 365 E5</Text>
          <Text style={styles.titleMain}>Business Case</Text>
          <View style={styles.divider} />
          <Text style={styles.titleCompany}>{options.companyName}</Text>
          <Text style={styles.titleSub}>{options.industry}</Text>
          <Text style={styles.titleDate}>{dateStr}</Text>
          <Text style={styles.titleBranding}>
            Prepared by E5 Elevator
          </Text>
        </View>
        <Footer />
      </Page>

      {/* Table of Contents */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.tocTitle}>Contents</Text>
        {options.sections.map((section, idx) => (
          <Text key={idx} style={styles.tocItem}>
            {section.title}
          </Text>
        ))}
        <Footer />
      </Page>

      {/* Content Pages */}
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.confidentialBg}>
          <Text style={styles.confidentialText}>
            CONFIDENTIAL — Prepared for {options.companyName}
          </Text>
        </View>
        {options.sections.map((section, idx) => (
          <View key={idx} wrap={false}>
            <Text style={styles.sectionTitle} break={idx > 0}>
              {section.title}
            </Text>
            {renderContent(section.content)}
          </View>
        ))}
        <Footer />
      </Page>
    </Document>
  );
}

export async function generateReportPdf(options: PdfOptions): Promise<Buffer> {
  const buffer = await renderToBuffer(
    <ReportDocument options={options} />
  );
  return Buffer.from(buffer);
}
