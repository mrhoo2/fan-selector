/**
 * API Route: Extract Schedule from PDF/Image
 * 
 * POST /api/extract-schedule
 * 
 * Accepts a file upload (PDF or image) and uses Gemini Flash 2.5
 * to extract fan specifications from mechanical schedules.
 */

import { NextRequest, NextResponse } from "next/server";
import { 
  extractScheduleFromFile, 
  buildSelectionRequestFromExtraction,
  SUPPORTED_FILE_TYPES,
  MAX_FILE_SIZE,
  type ExtractionResult 
} from "@/lib/schedule-extractor";

export async function POST(request: NextRequest) {
  try {
    // Parse the form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const mimeType = file.type;
    if (!(mimeType in SUPPORTED_FILE_TYPES)) {
      return NextResponse.json(
        { 
          error: `Unsupported file type: ${mimeType}`,
          supported: Object.keys(SUPPORTED_FILE_TYPES),
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { 
          error: `File too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
          fileSize: file.size,
          maxSize: MAX_FILE_SIZE,
        },
        { status: 400 }
      );
    }

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");

    // Extract schedule using Gemini
    console.log(`[extract-schedule] Processing ${file.name} (${mimeType}, ${(file.size / 1024).toFixed(1)}KB)`);
    
    const extractionResult: ExtractionResult = await extractScheduleFromFile(
      base64Data,
      mimeType
    );

    if (!extractionResult.success) {
      console.error("[extract-schedule] Extraction failed:", extractionResult.error);
      return NextResponse.json(
        { 
          success: false,
          error: extractionResult.error || "Failed to extract schedule",
          rawResponse: extractionResult.rawResponse,
        },
        { status: 422 }
      );
    }

    // Build the chat message from extraction
    const chatMessage = buildSelectionRequestFromExtraction(extractionResult);

    console.log(`[extract-schedule] Successfully extracted ${extractionResult.items.length} fans`);

    return NextResponse.json({
      success: true,
      items: extractionResult.items,
      itemCount: extractionResult.items.length,
      confidence: extractionResult.confidence,
      warnings: extractionResult.warnings,
      chatMessage, // Pre-formatted message for the chat
      fileName: file.name,
    });

  } catch (error) {
    console.error("[extract-schedule] Error:", error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

/**
 * GET handler - returns API info
 */
export async function GET() {
  return NextResponse.json({
    endpoint: "/api/extract-schedule",
    method: "POST",
    description: "Extract fan specifications from mechanical schedule PDF/image",
    supportedTypes: Object.keys(SUPPORTED_FILE_TYPES),
    maxFileSize: `${MAX_FILE_SIZE / (1024 * 1024)}MB`,
  });
}
