# Active Context: Current Focus & Working Memory

## Current Focus
**Header Redesign & Task 6 Complete** ✅ (Dec 19, 2025)

Successfully implemented PDF/image upload for mechanical schedules, and redesigned header to match bvtakeoffs.vercel.app style.

---

## 🎯 Recently Completed Work

### Header Redesign (Dec 19, 2025 @ 12:16 PM)

**What Was Built:**

Redesigned header to match bvtakeoffs.vercel.app and tranelcur.com style with official logos.

**Changes:**

1. **Greenheck Logo** (left side):
   - Official horizontal PNG from webcontent.greenheck.com
   - File: `/public/greenheck-logo.png` (7KB)
   - Height: 40px

2. **"POWERED BY" + BuildVision Logo** (right side):
   - "POWERED BY" text with classes: `text-xs font-medium text-neutral-400 uppercase tracking-wider`
   - Official BuildVision full-color PNG from bvtakeoffs.vercel.app CDN
   - File: `/public/buildvision-logo.png` (15KB)
   - Logo height: 20px

3. **Layout:**
   - Left: Greenheck logo | "Fan Selector" / "G/GB Series"
   - Right: "POWERED BY" BuildVision logo | Clear button
   - Responsive: Logos hide on smaller screens

**Files Modified:**
- `chat-ui/app/page.tsx` - Header component redesign
- `chat-ui/public/greenheck-logo.png` - Official Greenheck logo
- `chat-ui/public/buildvision-logo.png` - Official BuildVision logo

---

### Task 6: PDF/Image Schedule Upload & AI Parsing (Dec 19, 2025)

**What Was Built:**

Implemented a complete mechanical schedule upload and parsing system using Google Gemini Flash 2.5 vision AI.

**Files Created:**

1. **`chat-ui/lib/schedule-extractor.ts`** - Core Gemini integration:
   - `ExtractedScheduleItem` interface for parsed fan specs
   - `ExtractionResult` interface with confidence and warnings
   - `extractScheduleFromFile()` - Gemini Flash 2.5 vision processing
   - `formatExtractedItemsForChat()` - Converts items to chat message
   - `buildSelectionRequestFromExtraction()` - Full message builder
   - Extraction prompt optimized for mechanical schedule tables

2. **`chat-ui/app/api/extract-schedule/route.ts`** - API endpoint:
   - POST endpoint for file upload (FormData)
   - File type validation (PNG, JPEG, WEBP, PDF)
   - File size validation (max 10MB)
   - Base64 encoding for Gemini
   - Returns extracted items + pre-formatted chat message

3. **`chat-ui/components/schedule-upload-modal.tsx`** - Upload UI:
   - Drag & drop zone with click-to-browse
   - File type badges (PNG, JPEG, WEBP, PDF)
   - Upload states: idle, uploading, processing, success, error
   - Progress indicators with Gemini processing message
   - Success animation before sending to chat

**Files Modified:**

4. **`chat-ui/app/page.tsx`** - Integration:
   - Added `showUploadModal` state
   - Added `handleScheduleExtracted()` callback
   - Upload Schedule button as FIRST item in Quick Actions
   - ScheduleUploadModal component at bottom
   - Extracted data flows to chat as user message

5. **`chat-ui/.env.example`** - Added GEMINI_API_KEY

**Integration Flow:**

```
User clicks "Upload Schedule" in Quick Actions
→ Modal opens with drag & drop zone
→ User selects PDF or image file
→ File sent to /api/extract-schedule
→ Gemini Flash 2.5 analyzes image/PDF
→ Returns ExtractedScheduleItem[] with confidence
→ Items formatted as chat message
→ Modal shows success, auto-closes
→ Chat receives message as if user typed it
→ Claude generates CAPS selections
→ Response includes JSON/CSV export tabs
```

**ExtractedScheduleItem Interface:**

```typescript
interface ExtractedScheduleItem {
  mark: string;           // Equipment tag (EF-1, TEF-1, etc.)
  quantity: number;
  cfm: number;
  staticPressure: number;
  voltage?: number;
  phase?: number;
  frequency?: number;
  motorHp?: number;
  driveType?: string;     // direct, belt, varigreen
  accessories?: string[]; // Parsed from notes
  location?: string;      // Floor, area, zone
  application?: string;   // Kitchen, restroom, etc.
  notes?: string;
}
```

**Supported File Types:**

| Format | MIME Type | Use Case |
|--------|-----------|----------|
| PNG | image/png | Screenshots, scanned pages |
| JPEG | image/jpeg | Photos, scanned documents |
| WEBP | image/webp | Web-optimized images |
| PDF | application/pdf | Construction documents |

---

### Task 5: Enhanced JSON/CSV Export with All Input Fields (Dec 19, 2025)

**What Was Built:**

Updated the selection tool to display ALL input fields needed for creating a selection using the native Windows CAPS tool.

**Files Modified:**

1. **`chat-ui/lib/caps-generator.ts`** - Extended export functions:
   - Switched `generateCapsClipboard()` to use extended format with 56 fields
   - Added `StructuredCapsInput` interface organized by CAPS UI screens
   - Added `toStructuredCapsInput()` to convert flat selections to structured format
   - Added `generateStructuredJsonExport()` for JSON organized by screens
   - Added `generateAllExports()` for complete export data package

2. **`chat-ui/components/message-bubble.tsx`** - Enhanced display:
   - Added `CapsExportSection` component with tabbed interface
   - JSON tab shows structured format organized by CAPS screens
   - CSV tab shows formatted table with category headers
   - Copy buttons for JSON and CSV formats
   - Field count summary badges (56 total fields)

3. **`chat-ui/app/page.tsx`** - Integration:
   - Generates both `capsClipboard` and `structuredJson` exports
   - Attaches selections, structured JSON to message for display

---

## 📁 Key Project Files

### Chat UI (Active Development)
```
chat-ui/
├── app/page.tsx              # Main page with upload + export integration
├── app/api/
│   ├── chat/route.ts         # Claude streaming API
│   └── extract-schedule/route.ts  # Gemini upload processing
├── components/
│   ├── message-bubble.tsx    # Message with JSON/CSV export tabs
│   ├── field-options-modal.tsx   # Field options display modal
│   └── schedule-upload-modal.tsx # PDF/image upload modal
├── lib/
│   ├── caps-generator.ts     # Extended CAPS export (56 fields)
│   ├── caps-field-options.ts # Field definitions with source comments
│   ├── schedule-extractor.ts # Gemini Flash 2.5 integration
│   ├── fan-context.ts        # AI context and field metadata
│   └── utils.ts              # Utility functions
├── ai-context/               # AI training documents
└── .env.local                # API keys (ANTHROPIC + GEMINI)
```

### Environment Variables
```
ANTHROPIC_API_KEY=sk-ant-...  # Required for Claude chat
GEMINI_API_KEY=AIza...        # Required for schedule upload
```

---

## 📝 Notes for Future Work

1. **Multi-page PDF Support**: Currently processes first page only. Future enhancement could extract from multiple pages.

2. **Confidence Thresholds**: Gemini returns confidence scores. Could add warnings for low-confidence extractions.

3. **Schedule Format Training**: Extraction prompt could be enhanced with more schedule format examples.

4. **Batch Processing**: Future feature to upload multiple schedules at once.

---

## Version History

| Date | Update |
|------|--------|
| 2024-12-19 | Header redesign with Greenheck + BuildVision logos (bvtakeoffs style) |
| 2024-12-19 | Task 6: PDF/image upload with Gemini Flash 2.5 parsing |
| 2024-12-19 | Task 5: Enhanced JSON/CSV export with all 56 input fields |
| 2024-12-18 | Task 4: Field options modal with 58 fields and source comments |
| 2024-12-18 | Tasks 1-3: CAPS clipboard, all fields display, AI context structure |
