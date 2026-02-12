// PDF Generation Service for E5 Elevator
// Uses @react-pdf/renderer to create professional board-ready reports

import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";

// ============================================================================
// Types
// ============================================================================

export interface PdfOptions {
  companyName: string;
  industry: string;
  sections: Array<{
    id: string;
    title: string;
    content: string;
  }>;
  generatedAt: string;
}

interface ParsedNode {
  type:
    | "h2"
    | "h3"
    | "paragraph"
    | "bullet"
    | "numbered"
    | "citation"
    | "blank";
  content: string;
  number?: number;
}

// ============================================================================
// Styles
// ============================================================================

const colors = {
  primary: "#1e3a5f", // Dark blue for headers
  secondary: "#475569", // Slate for section headers
  body: "#1f2937", // Near black for body
  muted: "#6b7280", // Gray for metadata
  citation: "#64748b", // Slate gray for citations
  background: "#ffffff",
  lightGray: "#f3f4f6",
};

const styles = StyleSheet.create({
  // Page styles
  page: {
    flexDirection: "column",
    backgroundColor: colors.background,
    paddingTop: 60,
    paddingBottom: 70,
    paddingHorizontal: 50,
    fontFamily: "Helvetica",
  },
  titlePage: {
    flexDirection: "column",
    backgroundColor: colors.background,
    paddingVertical: 80,
    paddingHorizontal: 50,
    fontFamily: "Helvetica",
    justifyContent: "center",
    alignItems: "center",
  },

  // Title page elements
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Helvetica-Bold",
  },
  subtitle: {
    fontSize: 18,
    color: colors.secondary,
    textAlign: "center",
    marginBottom: 40,
  },
  companyName: {
    fontSize: 22,
    color: colors.primary,
    textAlign: "center",
    marginBottom: 60,
    fontFamily: "Helvetica-Bold",
  },
  titleMeta: {
    fontSize: 12,
    color: colors.muted,
    textAlign: "center",
    marginBottom: 8,
  },
  preparedBy: {
    fontSize: 14,
    color: colors.secondary,
    textAlign: "center",
    marginTop: 60,
  },

  // Table of contents
  tocTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 30,
    fontFamily: "Helvetica-Bold",
  },
  tocItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  tocNumber: {
    fontSize: 11,
    color: colors.muted,
    width: 25,
  },
  tocText: {
    fontSize: 11,
    color: colors.body,
    flex: 1,
  },

  // Section styles
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
    marginTop: 30,
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    fontFamily: "Helvetica-Bold",
  },
  h2: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.secondary,
    marginTop: 16,
    marginBottom: 8,
    fontFamily: "Helvetica-Bold",
  },
  h3: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.secondary,
    marginTop: 12,
    marginBottom: 6,
    fontFamily: "Helvetica-Bold",
  },

  // Content styles
  paragraph: {
    fontSize: 10,
    color: colors.body,
    marginBottom: 8,
    lineHeight: 1.5,
  },
  bulletContainer: {
    flexDirection: "row",
    marginBottom: 6,
    paddingLeft: 10,
  },
  bulletPoint: {
    fontSize: 10,
    color: colors.body,
    width: 15,
  },
  bulletText: {
    fontSize: 10,
    color: colors.body,
    flex: 1,
    lineHeight: 1.4,
  },
  numberedContainer: {
    flexDirection: "row",
    marginBottom: 6,
    paddingLeft: 10,
  },
  numberedPoint: {
    fontSize: 10,
    color: colors.body,
    width: 20,
  },
  citation: {
    fontSize: 8,
    color: colors.citation,
    fontStyle: "italic",
    marginTop: 4,
    marginBottom: 10,
    paddingLeft: 10,
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
    borderTopColor: colors.lightGray,
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: colors.muted,
  },
  pageNumber: {
    fontSize: 8,
    color: colors.muted,
  },

  // Bold text wrapper
  boldText: {
    fontFamily: "Helvetica-Bold",
  },
});

// ============================================================================
// Content Parsing
// ============================================================================

function parseContent(content: string): ParsedNode[] {
  const lines = content.split("\n");
  const nodes: ParsedNode[] = [];
  let numberedCounter = 0;

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      nodes.push({ type: "blank", content: "" });
      numberedCounter = 0;
      continue;
    }

    // H2 heading: ## Title
    if (trimmed.startsWith("## ")) {
      nodes.push({ type: "h2", content: trimmed.slice(3) });
      numberedCounter = 0;
      continue;
    }

    // H3 heading: ### Title
    if (trimmed.startsWith("### ")) {
      nodes.push({ type: "h3", content: trimmed.slice(4) });
      numberedCounter = 0;
      continue;
    }

    // Citation: [Source: Name, URL, Date]
    if (trimmed.startsWith("[Source:") || trimmed.startsWith("[source:")) {
      nodes.push({ type: "citation", content: trimmed });
      continue;
    }

    // Bullet point: - item or * item
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      nodes.push({ type: "bullet", content: trimmed.slice(2) });
      numberedCounter = 0;
      continue;
    }

    // Numbered list: 1. item, 2. item, etc.
    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
    if (numberedMatch) {
      numberedCounter++;
      nodes.push({
        type: "numbered",
        content: numberedMatch[2],
        number: numberedCounter,
      });
      continue;
    }

    // Regular paragraph
    nodes.push({ type: "paragraph", content: trimmed });
    numberedCounter = 0;
  }

  return nodes;
}

// ============================================================================
// Text Rendering with Bold Support
// ============================================================================

interface TextSegment {
  text: string;
  bold: boolean;
}

function parseTextWithBold(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  const regex = /\*\*([^*]+)\*\*/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the bold
    if (match.index > lastIndex) {
      segments.push({
        text: text.slice(lastIndex, match.index),
        bold: false,
      });
    }
    // Add the bold text
    segments.push({
      text: match[1],
      bold: true,
    });
    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    segments.push({
      text: text.slice(lastIndex),
      bold: false,
    });
  }

  return segments.length > 0 ? segments : [{ text, bold: false }];
}

function RichText({
  children,
  style,
}: {
  children: string;
  style?: object;
}): React.ReactElement {
  const segments = parseTextWithBold(children);

  if (segments.length === 1 && !segments[0].bold) {
    return React.createElement(Text, { style }, children);
  }

  return React.createElement(
    Text,
    { style },
    segments.map((segment, i) =>
      segment.bold
        ? React.createElement(
            Text,
            { key: i, style: styles.boldText },
            segment.text
          )
        : React.createElement(Text, { key: i }, segment.text)
    )
  );
}

// ============================================================================
// PDF Components
// ============================================================================

function Footer(): React.ReactElement {
  return React.createElement(
    View,
    { style: styles.footer, fixed: true },
    React.createElement(
      Text,
      { style: styles.footerText },
      "E5 Elevator | Confidential"
    ),
    React.createElement(
      Text,
      {
        style: styles.pageNumber,
        render: ({ pageNumber, totalPages }) =>
          `Page ${pageNumber} of ${totalPages}`,
      },
      null
    )
  );
}

function TitlePage({
  companyName,
  generatedAt,
}: {
  companyName: string;
  generatedAt: string;
}): React.ReactElement {
  const formattedDate = new Date(generatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return React.createElement(
    Page,
    { size: "A4", style: styles.titlePage },
    React.createElement(
      View,
      { style: styles.titleContainer },
      React.createElement(
        Text,
        { style: styles.mainTitle },
        "Microsoft 365 E5"
      ),
      React.createElement(Text, { style: styles.mainTitle }, "Business Case"),
      React.createElement(Text, { style: styles.companyName }, companyName),
      React.createElement(Text, { style: styles.titleMeta }, formattedDate),
      React.createElement(
        Text,
        { style: styles.preparedBy },
        "Prepared by E5 Elevator"
      )
    )
  );
}

function TableOfContents({
  sections,
}: {
  sections: PdfOptions["sections"];
}): React.ReactElement {
  return React.createElement(
    Page,
    { size: "A4", style: styles.page },
    React.createElement(Text, { style: styles.tocTitle }, "Table of Contents"),
    React.createElement(
      View,
      null,
      sections.map((section, index) =>
        React.createElement(
          View,
          { key: section.id, style: styles.tocItem },
          React.createElement(
            Text,
            { style: styles.tocNumber },
            `${index + 1}.`
          ),
          React.createElement(Text, { style: styles.tocText }, section.title)
        )
      )
    ),
    React.createElement(Footer, null)
  );
}

function ContentNode({ node }: { node: ParsedNode }): React.ReactElement | null {
  switch (node.type) {
    case "h2":
      return RichText({ children: node.content, style: styles.h2 });

    case "h3":
      return RichText({ children: node.content, style: styles.h3 });

    case "paragraph":
      return RichText({ children: node.content, style: styles.paragraph });

    case "bullet":
      return React.createElement(
        View,
        { style: styles.bulletContainer },
        React.createElement(Text, { style: styles.bulletPoint }, "\u2022"),
        RichText({ children: node.content, style: styles.bulletText })
      );

    case "numbered":
      return React.createElement(
        View,
        { style: styles.numberedContainer },
        React.createElement(
          Text,
          { style: styles.numberedPoint },
          `${node.number}.`
        ),
        RichText({ children: node.content, style: styles.bulletText })
      );

    case "citation":
      return React.createElement(Text, { style: styles.citation }, node.content);

    case "blank":
      return React.createElement(View, { style: { height: 6 } });

    default:
      return null;
  }
}

function SectionPage({
  section,
  index,
}: {
  section: PdfOptions["sections"][0];
  index: number;
}): React.ReactElement {
  const nodes = parseContent(section.content);

  return React.createElement(
    View,
    { key: section.id },
    React.createElement(
      Text,
      { style: styles.sectionTitle },
      `${index + 1}. ${section.title}`
    ),
    nodes.map((node, nodeIndex) =>
      React.createElement(ContentNode, { key: nodeIndex, node })
    )
  );
}

function ReportDocument({
  options,
}: {
  options: PdfOptions;
}): React.ReactElement {
  return React.createElement(
    Document,
    {
      title: `Microsoft 365 E5 Business Case - ${options.companyName}`,
      author: "E5 Elevator",
      subject: "Microsoft 365 E5 Security and Compliance Business Case",
      creator: "E5 Elevator",
    },
    // Title Page
    TitlePage({
      companyName: options.companyName,
      generatedAt: options.generatedAt,
    }),

    // Table of Contents
    TableOfContents({ sections: options.sections }),

    // Content Pages
    React.createElement(
      Page,
      { size: "A4", style: styles.page, wrap: true },
      options.sections.map((section, index) =>
        SectionPage({ section, index })
      ),
      React.createElement(Footer, null)
    )
  );
}

// ============================================================================
// Main Export
// ============================================================================

export async function generateReportPdf(options: PdfOptions): Promise<Buffer> {
  const document = ReportDocument({ options });
  const buffer = await renderToBuffer(document);
  return Buffer.from(buffer);
}
