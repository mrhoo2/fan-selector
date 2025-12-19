# Recommended Next Steps: Greenheck Integration

## Current Status (Updated Dec 19, 2025)

### ✅ Phase 1: COMPLETE - TypeScript Library
- TypeScript library built and tested at `fan-selector/`
- GitHub repo: https://github.com/mrhoo2/fan-selector
- 11 files, ~3000 lines of TypeScript
- All examples passing (3/3)

### ✅ Phase 2: COMPLETE - Chat UI Framework
- Browser-based chat interface at `chat-ui/`
- Claude Sonnet 4.5 integration with streaming
- BuildVision design system styling
- Running at http://localhost:3000

---

## ✅ Completed Tasks

### Task 0: Verify Complete Data Set ✅
**Status:** COMPLETE (Dec 18, 2025 @ 3:19 PM)

Conducted comprehensive field audit - 42 UI fields identified for implementation.

### Task 1: Make CAPS Clipboard Button Work ✅
**Status:** COMPLETE (Dec 18, 2025 @ 2:35 PM)

Created `caps-generator.ts` with parsing and CSV generation.

### Task 2: Display ALL Input Fields (CAPS Export Format) ✅
**Status:** COMPLETE (Dec 18, 2025 @ 3:36 PM)

Extended chat UI to support ALL 62 CAPS input fields.

### Task 3: AI Context Structure for Per-Section Generation ✅
**Status:** COMPLETE (Dec 18, 2025 @ 4:00 PM)

Created comprehensive AI context structure in `chat-ui/ai-context/`.

### Task 4: Map All Field Options & Visual Display ✅
**Status:** COMPLETE (Dec 18, 2025)

Created field options modal (`chat-ui/lib/caps-field-options.ts`) with 58 fields across 3 screens.

### Task 5: Enhanced JSON/CSV Export with All Input Fields ✅
**Status:** COMPLETE (Dec 19, 2025 @ 11:42 AM)

**What Was Built:**

Updated the selection tool to display ALL input fields needed for CAPS selection:

1. **Updated `chat-ui/lib/caps-generator.ts`:**
   - Switched default `generateCapsClipboard()` to use extended format with 56 fields
   - Added `StructuredCapsInput` interface organized by CAPS UI screens
   - Added `toStructuredCapsInput()` function to convert flat selections
   - Added `generateStructuredJsonExport()` for JSON organized by screens
   - Added `generateAllExports()` for complete export data package

2. **Updated `chat-ui/components/message-bubble.tsx`:**
   - Added tabbed interface for JSON and CSV preview
   - JSON tab shows structured format organized by CAPS screens
   - CSV tab shows formatted table with category headers
   - Copy buttons for each format
   - Field count summary (56 total: 15 sizing, 18 electrical, 15 configuration)

3. **Updated `chat-ui/app/page.tsx`:**
   - Now generates both `capsClipboard` and `structuredJson` exports
   - Attaches both to message for display

**Export Formats:**

| Format | Description |
|--------|-------------|
| **Structured JSON** | Organized by CAPS UI screens (sizing.basicInputs, electrical.motor, etc.) |
| **CSV (Tab-delimited)** | 56 columns with headers matching CAPS import format |

**Field Categories in Export:**

| Category | Fields | Example Fields |
|----------|--------|----------------|
| Core | 5 | Mark, Quantity, Series, Size, Model |
| Performance | 4 | CFM, SP, Elevation, Temperature |
| Electrical | 8 | Voltage, Phase, Frequency, Motor HP, Enclosure |
| VariGreen | 3 | VG Control, Transformer HOA, Balance Dial |
| Disconnect | 8 | Disconnect Rating, Protection, Type, etc. |
| Sizing | 11 | Spark, High Wind, Seismic, Drive Type, VFD |
| Construction | 5 | Coatings, Hood Hasps, Birdscreen, Fasteners |
| Accessories | 6 | Damper, Actuator, Mounting, Warranty |
| Mounting | 6 | Roof Curbs, Extension, Seal, Tie Down |
| **Total** | **56** | |

---

### Task 6: Mechanical Schedule Upload & AI Parsing ✅
**Status:** COMPLETE (Dec 19, 2025 @ 12:03 PM)

**What Was Built:**

Implemented PDF/image upload for mechanical schedules using Google Gemini Flash 2.5 vision AI to extract fan specifications and generate CAPS selections.

**Files Created:**
- `chat-ui/lib/schedule-extractor.ts` - Gemini integration with extraction logic
- `chat-ui/app/api/extract-schedule/route.ts` - File upload API endpoint
- `chat-ui/components/schedule-upload-modal.tsx` - Drag & drop upload UI

**Files Modified:**
- `chat-ui/app/page.tsx` - Added Upload Schedule button (first in Quick Actions)
- `chat-ui/.env.example` - Added GEMINI_API_KEY

**Integration Flow:**
```
User clicks "Upload Schedule" → Modal opens with drag & drop
→ File uploaded to /api/extract-schedule
→ Gemini Flash 2.5 extracts fan specs from image/PDF
→ Items formatted as chat message
→ Claude generates CAPS selections with JSON/CSV export tabs
```

**Supported Formats:** PNG, JPEG, WEBP, PDF (max 10MB)

**Success Criteria:** ✅ All met
- [x] Upload PDF or image file
- [x] Gemini extracts fan specs accurately
- [x] Data maps to structured CAPS JSON format
- [x] Selection displays with JSON/CSV export tabs
- [x] Works for common schedule formats

---

## 🎯 Next Priority: Future Enhancements

---

## 📋 Future Enhancements (After Task 6)

### Phase 4: BuildVision API Integration
Connect to real BuildVision document extraction:
- Fetch extracted specs from BuildVision API
- Map to CAPS-compatible format
- Track extraction accuracy metrics

### Phase 5: CAPS Windows App Integration
Direct integration with CAPS software:
- Automate clipboard paste into CAPS
- Validate selections against CAPS results
- Compare AI selections vs engineer selections

---

## Tech Stack Summary

| Component | Technology |
|-----------|------------|
| Chat UI | Next.js 16, React 19 |
| Styling | Tailwind CSS 4, BV Design System |
| AI (Chat) | Claude Sonnet 4.5 (Anthropic SDK) |
| AI (Vision) | Gemini Flash 2.5 (Google Generative AI) |
| Package Manager | Bun |
| Deployment | Vercel |
| Type Safety | TypeScript (strict mode) |

---

## File Locations

### Chat UI
```
/Users/mackenzie-buildvision/Engineer 4.48/chat-ui/
├── app/
│   ├── api/chat/route.ts    # Claude streaming API
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Main chat interface
│   └── globals.css          # BV design tokens
├── components/
│   ├── ui/                  # Button, Card, Badge, Textarea
│   ├── message-bubble.tsx   # Chat message with export tabs
│   └── field-options-modal.tsx  # CAPS field options display
├── lib/
│   ├── fan-context.ts       # AI system prompt + CAPS_FIELDS
│   ├── caps-generator.ts    # CAPS clipboard + JSON generation
│   ├── caps-field-options.ts # Field definitions (58 fields)
│   └── utils.ts             # Utility functions
├── ai-context/              # AI context files
│   ├── README.md            # Per-section overview
│   ├── EQUIPMENT_SELECTION_GUIDE.md  # Quick reference
│   └── exhaust-fans/        # G/GB context (5 files)
└── .env.local               # API keys
```

### Fan Selector Library
```
/Users/mackenzie-buildvision/Engineer 4.48/fan-selector/
├── src/
│   ├── types/caps-selection.ts
│   ├── data/buildvision-spec-mapping.ts
│   ├── data/terminology-dictionary.json
│   ├── extraction/schedule-parser.ts
│   └── export/caps-clipboard.ts
└── examples/example-usage.ts
```
