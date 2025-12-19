/**
 * Schedule Extractor - Gemini Flash 2.5 Integration
 * 
 * Parses mechanical schedules from PDFs/images to extract fan specifications
 * and convert them to CAPS-compatible format.
 */

import { GoogleGenerativeAI, Part } from "@google/generative-ai";

// Initialize Gemini client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }
  return new GoogleGenerativeAI(apiKey);
};

/**
 * Extracted equipment item from mechanical schedule
 */
export interface ExtractedScheduleItem {
  mark: string;           // Equipment tag (EF-1, TEF-1, RF-1, etc.)
  quantity: number;
  cfm: number;
  staticPressure: number;
  voltage?: number;
  phase?: number;
  frequency?: number;
  motorHp?: number;
  driveType?: string;     // direct, belt, varigreen
  accessories?: string[]; // Parsed from notes (damper, disconnect, etc.)
  location?: string;      // Floor, area, zone
  application?: string;   // Kitchen, restroom, garage, etc.
  notes?: string;         // Raw notes from schedule
}

/**
 * Result from schedule extraction
 */
export interface ExtractionResult {
  success: boolean;
  items: ExtractedScheduleItem[];
  rawResponse?: string;
  error?: string;
  confidence?: number;    // 0-1 confidence score
  warnings?: string[];    // Any parsing concerns
}

/**
 * Supported file types for upload
 */
export const SUPPORTED_FILE_TYPES = {
  'image/png': 'PNG',
  'image/jpeg': 'JPEG',
  'image/webp': 'WEBP',
  'application/pdf': 'PDF',
} as const;

export type SupportedMimeType = keyof typeof SUPPORTED_FILE_TYPES;

/**
 * Maximum file size (10MB)
 */
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Extraction prompt for Gemini
 */
const EXTRACTION_PROMPT = `You are an expert at reading mechanical schedules from construction documents.

Analyze this image/document and extract ALL exhaust fan equipment specifications.

For EACH fan found, extract these fields:
- mark: Equipment tag/mark (e.g., EF-1, TEF-1, RF-1, ERU-1)
- quantity: Number of units (default 1 if not shown)
- cfm: Airflow in CFM
- staticPressure: Static pressure in inches WG (may show as "SP" or "TSP")
- voltage: Electrical voltage (120, 208, 230, 277, 460, 575)
- phase: Electrical phase (1 or 3)
- frequency: Hz (usually 60, sometimes 50)
- motorHp: Motor horsepower if shown
- driveType: "direct", "belt", or "varigreen" based on description
- accessories: Array of accessories mentioned (damper, backdraft damper, disconnect, curb, etc.)
- location: Where the fan is located (floor, area, room)
- application: Application type (kitchen, restroom, general exhaust, garage, etc.)
- notes: Any additional notes or specifications

IMPORTANT PARSING RULES:
1. Look for tables with column headers like "MARK", "CFM", "SP", "VOLTAGE", "HP", etc.
2. Equipment marks typically follow patterns: EF-#, TEF-#, RF-#, ERU-#, KEF-#
3. Static pressure may be shown as decimal (0.5, 1.0, 1.5) or fraction (1/2", 1")
4. If drive type isn't explicit, infer from description (DD = direct drive, BD = belt drive)
5. Parse accessories from "REMARKS" or "NOTES" columns

Return a valid JSON object with this exact structure:
{
  "items": [
    {
      "mark": "EF-1",
      "quantity": 1,
      "cfm": 5000,
      "staticPressure": 1.5,
      "voltage": 460,
      "phase": 3,
      "frequency": 60,
      "motorHp": 1.5,
      "driveType": "belt",
      "accessories": ["backdraft damper", "disconnect"],
      "location": "Roof",
      "application": "General Exhaust",
      "notes": "Serve restrooms Level 1-3"
    }
  ],
  "confidence": 0.95,
  "warnings": ["Static pressure not shown for EF-3, assumed 0.5"]
}

If no exhaust fans are found, return:
{
  "items": [],
  "confidence": 0,
  "warnings": ["No exhaust fan specifications found in this document"]
}

ONLY return valid JSON, no other text or explanation.`;

/**
 * Convert file to Gemini-compatible part
 */
function fileToGenerativePart(base64Data: string, mimeType: string): Part {
  return {
    inlineData: {
      data: base64Data,
      mimeType,
    },
  };
}

/**
 * Extract fan specifications from an uploaded file using Gemini Flash 2.5
 * 
 * @param fileData - Base64 encoded file data
 * @param mimeType - MIME type of the file
 * @returns Extraction result with parsed items
 */
export async function extractScheduleFromFile(
  fileData: string,
  mimeType: string
): Promise<ExtractionResult> {
  try {
    // Validate MIME type
    if (!(mimeType in SUPPORTED_FILE_TYPES)) {
      return {
        success: false,
        items: [],
        error: `Unsupported file type: ${mimeType}. Supported types: ${Object.values(SUPPORTED_FILE_TYPES).join(", ")}`,
      };
    }

    const genAI = getGeminiClient();
    
    // Use Gemini 2.5 Flash for fast vision processing
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.1, // Low temperature for consistent extraction
        maxOutputTokens: 4096,
      },
    });

    // Create the image/PDF part
    const filePart = fileToGenerativePart(fileData, mimeType);

    // Generate content with vision
    const result = await model.generateContent([EXTRACTION_PROMPT, filePart]);
    const response = await result.response;
    const text = response.text();

    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return {
        success: false,
        items: [],
        rawResponse: text,
        error: "Failed to parse JSON response from Gemini",
      };
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    // Validate and normalize items
    const items: ExtractedScheduleItem[] = (parsed.items || []).map((item: Record<string, unknown>) => ({
      mark: String(item.mark || "UNKNOWN"),
      quantity: Number(item.quantity) || 1,
      cfm: Number(item.cfm) || 0,
      staticPressure: Number(item.staticPressure) || 0.5,
      voltage: item.voltage ? Number(item.voltage) : undefined,
      phase: item.phase ? Number(item.phase) : undefined,
      frequency: item.frequency ? Number(item.frequency) : undefined,
      motorHp: item.motorHp ? Number(item.motorHp) : undefined,
      driveType: item.driveType ? String(item.driveType).toLowerCase() : undefined,
      accessories: Array.isArray(item.accessories) ? item.accessories.map(String) : undefined,
      location: item.location ? String(item.location) : undefined,
      application: item.application ? String(item.application) : undefined,
      notes: item.notes ? String(item.notes) : undefined,
    }));

    return {
      success: true,
      items,
      rawResponse: text,
      confidence: parsed.confidence || 0.8,
      warnings: parsed.warnings || [],
    };

  } catch (error) {
    console.error("Schedule extraction error:", error);
    return {
      success: false,
      items: [],
      error: error instanceof Error ? error.message : "Unknown extraction error",
    };
  }
}

/**
 * Convert extracted schedule items to a chat message format
 * that can be sent to Claude for CAPS selection generation
 */
export function formatExtractedItemsForChat(items: ExtractedScheduleItem[]): string {
  if (items.length === 0) {
    return "No exhaust fans were found in the uploaded document.";
  }

  const lines: string[] = [
    `I found ${items.length} exhaust fan${items.length > 1 ? "s" : ""} in the mechanical schedule:`,
    "",
  ];

  items.forEach((item, index) => {
    const details: string[] = [];
    
    details.push(`**${item.mark}** (Qty: ${item.quantity})`);
    details.push(`- Airflow: ${item.cfm.toLocaleString()} CFM`);
    details.push(`- Static Pressure: ${item.staticPressure}" WG`);
    
    if (item.voltage && item.phase) {
      details.push(`- Electrical: ${item.voltage}V / ${item.phase}-phase`);
    } else if (item.voltage) {
      details.push(`- Voltage: ${item.voltage}V`);
    }
    
    if (item.motorHp) {
      details.push(`- Motor: ${item.motorHp} HP`);
    }
    
    if (item.driveType) {
      const driveLabel = item.driveType === "direct" ? "Direct Drive (G series)" :
                        item.driveType === "belt" ? "Belt Drive (GB series)" :
                        item.driveType === "varigreen" ? "VariGreen ECM" :
                        item.driveType;
      details.push(`- Drive Type: ${driveLabel}`);
    }
    
    if (item.accessories && item.accessories.length > 0) {
      details.push(`- Accessories: ${item.accessories.join(", ")}`);
    }
    
    if (item.application) {
      details.push(`- Application: ${item.application}`);
    }
    
    if (item.location) {
      details.push(`- Location: ${item.location}`);
    }
    
    if (item.notes) {
      details.push(`- Notes: ${item.notes}`);
    }

    lines.push(details.join("\n"));
    if (index < items.length - 1) {
      lines.push(""); // Add spacing between items
    }
  });

  lines.push("");
  lines.push("Please generate CAPS selections for each of these fans with the appropriate G or GB series model.");

  return lines.join("\n");
}

/**
 * Build a selection request from extracted items
 * This creates a prompt that can be sent to the chat API
 */
export function buildSelectionRequestFromExtraction(result: ExtractionResult): string {
  if (!result.success || result.items.length === 0) {
    return result.error || "No fans could be extracted from the document.";
  }

  let message = formatExtractedItemsForChat(result.items);
  
  // Add warnings if any
  if (result.warnings && result.warnings.length > 0) {
    message += "\n\n⚠️ **Extraction Notes:**\n";
    result.warnings.forEach(warning => {
      message += `- ${warning}\n`;
    });
  }

  return message;
}
