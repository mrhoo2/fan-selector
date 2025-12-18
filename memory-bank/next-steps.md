# Recommended Next Steps: Greenheck Integration

## Current Status (Updated Dec 18, 2025)

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

## 🎯 Immediate Priority: Enhance Chat UI

### Task 0: Verify Complete Data Set ✅
**Status:** COMPLETE (Dec 18, 2025 @ 3:19 PM)

**What Was Verified:**
Conducted comprehensive field audit comparing:
- TypeScript schema (`caps-selection.ts`) - 62+ fields
- Fan-selector library (`caps-clipboard.ts`) - 10 input, 23 output
- Chat UI (`caps-generator.ts`) - 16 fields
- Actual CAPS export CSV - 23 columns

**Verification Results:**
| Category | Total | Implemented | Gap |
|----------|-------|-------------|-----|
| CAPS Output | 23 | ✅ 23 | 0 |
| CAPS Input (Basic) | 10 | ✅ 10 | 0 |
| CAPS UI - Sizing | 15 | ⚠️ 7 | 8 |
| CAPS UI - Electrical | 25 | ⚠️ 8 | 17 |
| CAPS UI - Configuration | 22 | ⚠️ 5 | 17 |
| **Total** | **62** | **20** | **42** |

**New File Created:**
- `memory-bank/caps-field-verification.md` - Complete field-by-field audit

**Key Finding:** 42 UI fields need to be added to chat interface

---

### Task 1: Make CAPS Clipboard Button Work ✅
**Status:** COMPLETE (Dec 18, 2025 @ 2:35 PM)

**What Was Built:**

1. Created `chat-ui/lib/caps-generator.ts`:
   - `parseAiResponse()` - Extracts fan parameters from AI response
   - `generateCapsClipboard()` - Creates tab-delimited CSV
   - Supports JSON code blocks with `json:caps` marker
   - Fallback parsing for plain text CFM/SP values
   - Handles single or multiple fan selections

2. Updated `chat-ui/lib/fan-context.ts`:
   - Added instructions for AI to output structured JSON
   - Example format with all CAPS fields

3. Updated `chat-ui/app/page.tsx`:
   - Integrated caps-generator parsing after streaming
   - Attaches `capsClipboard` to messages when data found
   - "Copy CAPS Clipboard" button now functional

**Output Format (tab-delimited):**
```
Mark	Quantity	CFM	SP	Voltage	Phase	Frequency	Drive Type	Motor HP	Enclosure	Series	Size	Backdraft Damper	Disconnect	Elevation	Temperature
EF-1	1	5000	1.5	460	3	60	Direct		TEFC	G		Yes	No	0	70
```

---

### Task 2: Display ALL Input Fields (CAPS Export Format) ✅
**Status:** COMPLETE (Dec 18, 2025 @ 3:36 PM)

**What Was Built:**

Extended the chat UI to support ALL 62 CAPS input fields.

1. **Updated `chat-ui/lib/fan-context.ts`:**
   - Added comprehensive JSON output format with nested structure
   - Added 54 CAPS_FIELDS definitions with metadata
   - Added terminology mapping for all field variations
   - Added helper functions for field lookups

2. **Updated `chat-ui/lib/caps-generator.ts`:**
   - Expanded FanSelection interface from 17 to 76 fields
   - Updated normalizeSelection() for nested JSON format
   - Added CAPS_HEADERS_EXTENDED (56 columns)
   - Added generateCapsClipboardExtended() for full export
   - Added generateJsonExport() for JSON output
   - Maintained backward compatibility

**Field Categories Now Supported:**

| Category | Fields |
|----------|--------|
| **Core** | mark, quantity, series, size, model |
| **Performance** | cfm, staticPressure, elevation, temperature |
| **Electrical** | voltage, phase, frequency, motorHp, motorDesign, enclosure, ulListed, efficiencyRating |
| **VariGreen** | variGreenControl, transformerHoa, includeBalanceDial |
| **Elec Accessories** | disconnectSwitch, disconnectRating, disconnectProtection, disconnectType, motorStarter, wiringPigtail |
| **Sizing** | sparkResistance, highWindRated, seismicRated, driveType, applyVfd, damperSpCorrection |
| **Construction** | coatings, hoodHasps, conduitChaseQty, birdscreenMaterial, fasteners |
| **Accessories** | damper, damperActuator, damperMounting, damperBladeAction, unitWarranty |
| **Mounting** | roofCurbs, curbExtension, curbCapAdapter, hingedCurbCap, curbSeal, tieDownPoints |

---

### Task 3: AI Context Structure for Per-Section Generation ✅
**Status:** COMPLETE (Dec 18, 2025 @ 4:00 PM)

**What Was Built:**

Created comprehensive AI context structure mirroring the `trane_lcur_demo/ai-context/` pattern:

```
chat-ui/ai-context/
├── README.md                    # Per-section generation overview
├── EQUIPMENT_SELECTION_GUIDE.md # Quick reference for AI
├── exhaust-fans/               # G/GB series context files
│   ├── performance.md          # CFM, Static Pressure, Elevation, Temp
│   ├── electrical.md           # Voltage, Phase, Frequency, Motor
│   ├── drive-type.md           # Direct vs Belt, VariGreen, Sizing
│   ├── accessories.md          # Damper, Coating, Birdscreen, Mounting
│   └── environment.md          # Application context, Location, Special
```

**Each Section File Contains:**
1. **Section Overview** - What the section controls
2. **Field Definitions** - For each field:
   - Field ID and Name
   - REQUIRED/OPTIONAL and ASK HUMAN/AUTO-GENERATE flags
   - Available Options with descriptions
   - Selection Logic (when to use each option)
   - AI Generation Strategy (specific instructions)
3. **Dependencies** - Related sections/fields
4. **Common Scenarios** - Real-world examples with JSON and reasoning
5. **Human Input Summary** - Tables of when to ask vs auto-generate
6. **Smart Defaults Summary** - JavaScript code for defaults

**Key Design Principles:**
- **Minimize Questions**: Only ask CFM, SP, and context-triggered questions
- **Smart Defaults**: 460V/3ph/60Hz, TEFC, Galvanized, etc.
- **Context-Aware**: Location triggers (CA→seismic, FL→wind, etc.)
- **Application-Specific**: Kitchen (no birdscreen), Lab (spark), Pool (coatings)

**Processing Order Defined:**
1. Performance (CFM, SP) → User MUST provide
2. Drive Type (Direct/Belt/VG) → Infer from CFM or ask
3. Electrical (Voltage, Phase) → Smart defaults unless special
4. Environment (Location, Application) → Context-triggered questions
5. Accessories → Defaults with application overrides

---

### Task 4: Map All Field Options & Visual Display
**Status:** Next Up 🎯

**Goal:** Document EVERY option for each of the 62 input fields and create visual browser display.

**Why This Matters:**
- Current field definitions have incomplete/inaccurate options
- Need actual CAPS dropdown values (e.g., "Title 24/California" not just "true/false")
- Engineers need to verify all options are correctly supported
- Visual display helps debugging and validation

**Known Option Updates Needed:**

| Field | Current Options | Actual CAPS Options |
|-------|-----------------|---------------------|
| Available Sizes | "Optimized", "All" | Optimized, All, Specific (array) |
| Spark Resistance | None, TypeA, TypeB, TypeC | None, Spark B, Spark C |
| Efficiency Code Req | true/false | No, Title 24/California, Washington St Energy Code, ANSI/ASHRAE/IES Standard 90.1 |
| Disconnect Rating | NEMA-1, NEMA-3R, etc. | Need to verify complete list |
| Motor Enclosure | TEFC, TENV, ODP, TEAO, IP55 | Need to verify from CAPS |
| VariGreen Control | None, Remote Dial, etc. | Need complete list |
| Damper Actuator | Gravity, Motorized, Spring Return | Verify against CAPS |
| Birdscreen Material | Galvanized, Aluminum, Stainless, None | Verify |

**Deliverables:**

1. **Complete Options Schema** (`chat-ui/lib/caps-field-options.ts`):
   ```typescript
   export interface FieldOption {
     id: string;
     label: string;
     capsValue: string | number | boolean;
     description?: string;
   }
   
   export interface CapsFieldDefinition {
     id: string;
     name: string;
     category: string;
     type: 'text' | 'number' | 'boolean' | 'select' | 'multiselect';
     options?: FieldOption[];
     default: string | number | boolean;
     required: boolean;
   }
   ```

2. **Visual Component** ("Show Input Field Options" button):
   - Collapsible nested tree structure
   - Grouped by category (Performance, Electrical, Sizing, etc.)
   - Shows field name, type, all options, default value
   - Searchable/filterable

3. **Memory Bank Documentation** (`memory-bank/caps-field-options.md`):
   - Complete reference of all fields and options
   - Verified against actual CAPS software
   - Notes on option IDs if available

**Verification Method:**
1. Open CAPS software on Windows VM
2. Go through each dropdown/field on Sizing, Electrical, Configuration screens
3. Document exact option values and labels
4. Cross-reference with decompiled DLL code if needed

**UI Implementation:**
```tsx
// In chat-ui/app/page.tsx
<Button onClick={() => setShowFieldOptions(true)}>
  Show Input Field Options
</Button>

<Dialog open={showFieldOptions}>
  <FieldOptionsTree fields={CAPS_FIELD_DEFINITIONS} />
</Dialog>
```

---

## 📋 Future Enhancements (After Task 1-4)

### Phase 3: PDF & Image Parsing
Add support for uploading schedule PDFs and images:
- Use Claude Vision API for image analysis
- Use pdf-parse for text extraction
- Auto-extract fan specs from uploaded documents

### Phase 4: BuildVision API Integration
Connect to real BuildVision document extraction:
- Fetch extracted specs from BuildVision API
- Map to CAPS-compatible format
- Track extraction accuracy metrics

---

## Tech Stack Summary

| Component | Technology |
|-----------|------------|
| Chat UI | Next.js 16, React 19 |
| Styling | Tailwind CSS 4, BV Design System |
| AI | Claude Sonnet 4.5 (Anthropic SDK) |
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
│   └── message-bubble.tsx   # Chat message component
├── lib/
│   ├── fan-context.ts       # AI system prompt + CAPS_FIELDS
│   ├── caps-generator.ts    # CAPS clipboard generation
│   ├── caps-field-options.ts # TO BE CREATED (Task 4)
│   └── utils.ts             # Utility functions
├── ai-context/              # ✅ CREATED (Task 3)
│   ├── README.md            # Per-section overview
│   ├── EQUIPMENT_SELECTION_GUIDE.md  # Quick reference
│   └── exhaust-fans/
│       ├── performance.md   # CFM, SP, Elevation, Temp
│       ├── electrical.md    # Voltage, Phase, Motor
│       ├── drive-type.md    # Direct/Belt, Spark, Seismic
│       ├── accessories.md   # Damper, Coating, Mounting
│       └── environment.md   # Application, Location
└── .env.local               # API key (ANTHROPIC_API_KEY)
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

### Reference Implementation
```
/Users/mackenzie-buildvision/Programming/trane_lcur_demo/ai-context/
├── README.md                    # Per-section generation docs
├── precedent/airflow.md         # Example: airflow section fields
└── precedent/electrical.md      # Example: electrical section fields
```
