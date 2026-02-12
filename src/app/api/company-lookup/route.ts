import { NextRequest, NextResponse } from "next/server";

interface CompaniesHouseResult {
  company_name: string;
  company_number: string;
  company_status: string;
  registered_office_address?: {
    address_line_1?: string;
    address_line_2?: string;
    locality?: string;
    postal_code?: string;
    region?: string;
  };
  sic_codes?: string[];
  date_of_creation?: string;
}

interface CompaniesHouseResponse {
  items: CompaniesHouseResult[];
  total_results: number;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [], error: null });
  }

  const apiKey = process.env.COMPANIES_HOUSE_API_KEY;

  if (!apiKey) {
    // Return mock data in development if no API key
    return NextResponse.json({
      results: [],
      error: "Companies House API key not configured. Please use manual entry.",
    });
  }

  try {
    const url = `https://api.company-information.service.gov.uk/search/companies?q=${encodeURIComponent(query)}&items_per_page=5`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${Buffer.from(apiKey + ":").toString("base64")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Companies House API returned ${response.status}`);
    }

    const data: CompaniesHouseResponse = await response.json();

    const results = data.items
      .filter((item) => item.company_status === "active")
      .map((item) => ({
        name: item.company_name,
        number: item.company_number,
        address: formatAddress(item.registered_office_address),
        sicCodes: item.sic_codes || [],
        incorporatedDate: item.date_of_creation || null,
      }));

    return NextResponse.json({ results, error: null });
  } catch (error) {
    console.error("Companies House lookup error:", error);
    return NextResponse.json({
      results: [],
      error: "Failed to search Companies House. Please use manual entry.",
    });
  }
}

function formatAddress(
  address?: CompaniesHouseResult["registered_office_address"]
): string {
  if (!address) return "";
  const parts = [
    address.address_line_1,
    address.address_line_2,
    address.locality,
    address.region,
    address.postal_code,
  ].filter(Boolean);
  return parts.join(", ");
}
