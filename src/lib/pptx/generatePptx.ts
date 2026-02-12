import PptxGenJS from "pptxgenjs";

// Types
export interface PptxSection {
  id: string;
  title: string;
  content: string;
}

export interface PptxOptions {
  companyName: string;
  industry: string;
  sections: PptxSection[];
  generatedAt: string;
}

interface ParsedLine {
  type: "heading" | "subheading" | "bullet" | "numbered" | "text";
  text: string;
  level: number;
}

// Design constants
const COLORS = {
  primary: "1e3a5f", // Dark blue
  white: "FFFFFF",
  lightGray: "F5F5F5",
  textDark: "333333",
  textLight: "666666",
};

const FONTS = {
  title: "Calibri",
  body: "Calibri",
};

const MAX_BULLETS_PER_SLIDE = 8;

/**
 * Parse markdown-like content into structured lines
 */
function parseContent(content: string): ParsedLine[] {
  const lines = content.split("\n");
  const parsed: ParsedLine[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check for headings (## and ###)
    if (trimmed.startsWith("### ")) {
      parsed.push({
        type: "subheading",
        text: stripMarkdown(trimmed.slice(4)),
        level: 3,
      });
    } else if (trimmed.startsWith("## ")) {
      parsed.push({
        type: "heading",
        text: stripMarkdown(trimmed.slice(3)),
        level: 2,
      });
    } else if (trimmed.startsWith("# ")) {
      parsed.push({
        type: "heading",
        text: stripMarkdown(trimmed.slice(2)),
        level: 1,
      });
    }
    // Check for bullets
    else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      // Determine indentation level
      const indent = line.length - line.trimStart().length;
      const level = Math.floor(indent / 2) + 1;
      parsed.push({
        type: "bullet",
        text: stripMarkdown(trimmed.slice(2)),
        level: Math.min(level, 3),
      });
    }
    // Check for numbered lists
    else if (/^\d+\.\s/.test(trimmed)) {
      const text = trimmed.replace(/^\d+\.\s/, "");
      parsed.push({
        type: "numbered",
        text: stripMarkdown(text),
        level: 1,
      });
    }
    // Plain text
    else {
      parsed.push({
        type: "text",
        text: stripMarkdown(trimmed),
        level: 0,
      });
    }
  }

  return parsed;
}

/**
 * Strip markdown formatting and citations, return clean text
 */
function stripMarkdown(text: string): string {
  let result = text;

  // Remove citations [Source: ...]
  result = result.replace(/\[Source:[^\]]*\]/gi, "");
  result = result.replace(/\[Citation:[^\]]*\]/gi, "");
  result = result.replace(/\[\d+\]/g, ""); // Remove [1], [2] style citations

  // Convert **bold** to just the text (pptxgenjs will handle bold separately)
  result = result.replace(/\*\*([^*]+)\*\*/g, "$1");

  // Convert *italic* to just the text
  result = result.replace(/\*([^*]+)\*/g, "$1");

  // Remove any remaining markdown links [text](url)
  result = result.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // Clean up extra whitespace
  result = result.replace(/\s+/g, " ").trim();

  return result;
}

/**
 * Extract citations from content for speaker notes
 */
function extractCitations(content: string): string[] {
  const citations: string[] = [];
  const sourceMatches = content.matchAll(/\[Source:\s*([^\]]+)\]/gi);
  for (const match of sourceMatches) {
    citations.push(match[1].trim());
  }
  return [...new Set(citations)]; // Deduplicate
}

/**
 * Split parsed content into slide chunks
 */
function splitIntoSlideChunks(
  lines: ParsedLine[],
  maxItems: number = MAX_BULLETS_PER_SLIDE
): ParsedLine[][] {
  const chunks: ParsedLine[][] = [];
  let currentChunk: ParsedLine[] = [];
  let itemCount = 0;

  for (const line of lines) {
    // Headings always start a new chunk if we have content
    if (
      (line.type === "heading" || line.type === "subheading") &&
      currentChunk.length > 0
    ) {
      chunks.push(currentChunk);
      currentChunk = [];
      itemCount = 0;
    }

    currentChunk.push(line);

    // Count bullets and numbered items toward the limit
    if (
      line.type === "bullet" ||
      line.type === "numbered" ||
      line.type === "text"
    ) {
      itemCount++;
    }

    // Split if we hit the max items
    if (itemCount >= maxItems) {
      chunks.push(currentChunk);
      currentChunk = [];
      itemCount = 0;
    }
  }

  // Push remaining content
  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  return chunks;
}

/**
 * Add text elements to a slide from parsed lines
 */
function addContentToSlide(
  slide: PptxGenJS.Slide,
  lines: ParsedLine[],
  startY: number = 1.5
): void {
  const textItems: PptxGenJS.TextProps[] = [];

  for (const line of lines) {
    switch (line.type) {
      case "heading":
      case "subheading":
        textItems.push({
          text: line.text,
          options: {
            fontSize: line.type === "heading" ? 20 : 16,
            bold: true,
            color: COLORS.primary,
            bullet: false,
            paraSpaceBefore: textItems.length > 0 ? 12 : 0,
            paraSpaceAfter: 6,
          },
        });
        break;

      case "bullet":
        textItems.push({
          text: line.text,
          options: {
            fontSize: 14,
            color: COLORS.textDark,
            bullet: { type: "bullet", indent: (line.level - 1) * 0.25 },
            indentLevel: line.level - 1,
            paraSpaceBefore: 4,
            paraSpaceAfter: 4,
          },
        });
        break;

      case "numbered":
        textItems.push({
          text: line.text,
          options: {
            fontSize: 14,
            color: COLORS.textDark,
            bullet: { type: "number" },
            paraSpaceBefore: 4,
            paraSpaceAfter: 4,
          },
        });
        break;

      case "text":
        textItems.push({
          text: line.text,
          options: {
            fontSize: 14,
            color: COLORS.textDark,
            bullet: false,
            paraSpaceBefore: 6,
            paraSpaceAfter: 6,
          },
        });
        break;
    }
  }

  if (textItems.length > 0) {
    slide.addText(textItems, {
      x: 0.5,
      y: startY,
      w: 9,
      h: 5,
      fontFace: FONTS.body,
      align: "left",
      valign: "top",
    });
  }
}

/**
 * Generate a board-ready PowerPoint deck from report sections
 */
export async function generateReportPptx(options: PptxOptions): Promise<Buffer> {
  const { companyName, industry, sections, generatedAt } = options;

  const pres = new PptxGenJS();

  // Set presentation properties
  pres.author = "E5 Elevator";
  pres.title = `Microsoft 365 E5 Business Case - ${companyName}`;
  pres.subject = "E5 Security Business Case Analysis";
  pres.company = "E5 Elevator";

  // Define slide masters
  pres.defineSlideMaster({
    title: "TITLE_SLIDE",
    background: { color: COLORS.primary },
  });

  pres.defineSlideMaster({
    title: "CONTENT_SLIDE",
    background: { color: COLORS.white },
  });

  // =========================================
  // SLIDE 1: Title Slide
  // =========================================
  const titleSlide = pres.addSlide({ masterName: "TITLE_SLIDE" });

  // Main title
  titleSlide.addText("Microsoft 365 E5\nBusiness Case", {
    x: 0.5,
    y: 1.5,
    w: 9,
    h: 2,
    fontSize: 36,
    fontFace: FONTS.title,
    color: COLORS.white,
    bold: true,
    align: "center",
  });

  // Subtitle with company name
  titleSlide.addText(`${companyName}\n${industry}`, {
    x: 0.5,
    y: 3.5,
    w: 9,
    h: 1,
    fontSize: 20,
    fontFace: FONTS.body,
    color: COLORS.white,
    align: "center",
  });

  // Date
  const formattedDate = new Date(generatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  titleSlide.addText(formattedDate, {
    x: 0.5,
    y: 4.6,
    w: 9,
    h: 0.5,
    fontSize: 14,
    fontFace: FONTS.body,
    color: COLORS.white,
    align: "center",
  });

  // E5 Elevator branding
  titleSlide.addText("Powered by E5 Elevator", {
    x: 0.5,
    y: 5.2,
    w: 9,
    h: 0.3,
    fontSize: 10,
    fontFace: FONTS.body,
    color: COLORS.white,
    align: "center",
    italic: true,
  });

  // =========================================
  // SLIDE 2: Agenda / Table of Contents
  // =========================================
  const agendaSlide = pres.addSlide({ masterName: "CONTENT_SLIDE" });

  // Header bar
  agendaSlide.addShape("rect", {
    x: 0,
    y: 0,
    w: 10,
    h: 1.2,
    fill: { color: COLORS.primary },
  });

  agendaSlide.addText("Agenda", {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.6,
    fontSize: 28,
    fontFace: FONTS.title,
    color: COLORS.white,
    bold: true,
  });

  // Build agenda items
  const agendaItems: PptxGenJS.TextProps[] = sections.map((section, index) => ({
    text: `${index + 1}. ${section.title}`,
    options: {
      fontSize: 16,
      color: COLORS.textDark,
      bullet: false,
      paraSpaceBefore: 8,
      paraSpaceAfter: 8,
    },
  }));

  agendaSlide.addText(agendaItems, {
    x: 0.75,
    y: 1.5,
    w: 8.5,
    h: 4,
    fontFace: FONTS.body,
    align: "left",
    valign: "top",
  });

  // =========================================
  // CONTENT SLIDES: One or more per section
  // =========================================
  for (const section of sections) {
    const parsedLines = parseContent(section.content);
    const citations = extractCitations(section.content);
    const chunks = splitIntoSlideChunks(parsedLines);

    // Ensure at least one slide per section
    if (chunks.length === 0) {
      chunks.push([]);
    }

    chunks.forEach((chunk, chunkIndex) => {
      const slide = pres.addSlide({ masterName: "CONTENT_SLIDE" });

      // Header bar
      slide.addShape("rect", {
        x: 0,
        y: 0,
        w: 10,
        h: 1.2,
        fill: { color: COLORS.primary },
      });

      // Section title (with continuation indicator if needed)
      const titleText =
        chunks.length > 1
          ? `${section.title} (${chunkIndex + 1}/${chunks.length})`
          : section.title;

      slide.addText(titleText, {
        x: 0.5,
        y: 0.3,
        w: 9,
        h: 0.6,
        fontSize: 24,
        fontFace: FONTS.title,
        color: COLORS.white,
        bold: true,
      });

      // Content
      if (chunk.length > 0) {
        addContentToSlide(slide, chunk, 1.5);
      } else {
        // Empty section placeholder
        slide.addText("Content for this section will be available soon.", {
          x: 0.5,
          y: 2.5,
          w: 9,
          h: 1,
          fontSize: 14,
          fontFace: FONTS.body,
          color: COLORS.textLight,
          align: "center",
          italic: true,
        });
      }

      // Add citations to speaker notes (only on first slide of section)
      if (chunkIndex === 0 && citations.length > 0) {
        slide.addNotes(`Sources:\n${citations.map((c) => `- ${c}`).join("\n")}`);
      }

      // Footer with page number
      slide.addText(`${section.id}`, {
        x: 0.5,
        y: 5.3,
        w: 4,
        h: 0.2,
        fontSize: 8,
        fontFace: FONTS.body,
        color: COLORS.textLight,
      });
    });
  }

  // =========================================
  // FINAL SLIDE: Thank You / Contact
  // =========================================
  const thankYouSlide = pres.addSlide({ masterName: "TITLE_SLIDE" });

  thankYouSlide.addText("Thank You", {
    x: 0.5,
    y: 2,
    w: 9,
    h: 1,
    fontSize: 44,
    fontFace: FONTS.title,
    color: COLORS.white,
    bold: true,
    align: "center",
  });

  thankYouSlide.addText("Report generated by E5 Elevator", {
    x: 0.5,
    y: 3.2,
    w: 9,
    h: 0.5,
    fontSize: 16,
    fontFace: FONTS.body,
    color: COLORS.white,
    align: "center",
  });

  thankYouSlide.addText(formattedDate, {
    x: 0.5,
    y: 3.8,
    w: 9,
    h: 0.5,
    fontSize: 14,
    fontFace: FONTS.body,
    color: COLORS.white,
    align: "center",
  });

  thankYouSlide.addText(
    `Prepared for ${companyName}`,
    {
      x: 0.5,
      y: 4.5,
      w: 9,
      h: 0.3,
      fontSize: 12,
      fontFace: FONTS.body,
      color: COLORS.white,
      align: "center",
      italic: true,
    }
  );

  // Generate the PowerPoint as a Buffer
  const buffer = await pres.write({ outputType: "nodebuffer" });

  return buffer as Buffer;
}
