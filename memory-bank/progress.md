# Progress Log: Greenheck CAPS Integration

## Current Status: Phase 1.5 Complete ✅ + Tasks 1-3 Complete ✅

### Session: December 18, 2025 (Afternoon - 4:00 PM ET)

**Completed:** Task 3 - AI Context Structure for Per-Section Generation

#### What Was Built:
Created comprehensive per-section AI context structure mirroring the `trane_lcur_demo/ai-context/` pattern:

**Files Created:**
```
chat-ui/ai-context/
├── README.md                    # Per-section generation overview
├── EQUIPMENT_SELECTION_GUIDE.md # Quick reference for AI
├── exhaust-fans/
│   ├── performance.md          # CFM, SP, Elevation, Temperature
│   ├── electrical.md           # Voltage, Phase, Motor settings
│   ├── drive-type.md           # Direct/Belt/VG, Spark, Seismic
│   ├── accessories.md          # Damper, Coating, Mounting
│   └── environment.md          # Application context, Location
```

#### Each Section File Contains:
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

#### Key Design Principles:
- **Minimize Questions**: Only ask CFM, SP, and context-triggered questions
- **Smart Defaults**: 460V/3ph/60Hz, TEFC, Galvanized, etc.
- **Context-Aware**: Location triggers (CA→seismic, FL→wind, etc.)
- **Application-Specific**: Kitchen (no birdscreen), Lab (spark), Pool (coatings)

#### Processing Order Defined:
1. Performance (CFM, SP) → User MUST provide
2. Drive Type (Direct/Belt/VG) → Infer from CFM or ask
3. Electrical (Voltage, Phase) → Smart defaults unless special
4. Environment (Location, Application) → Context-triggered questions
5. Accessories → Defaults with application overrides

---

### Session: December 18, 2025 (Afternoon - 3:36 PM ET)

**Completed:** Task 2 - Display ALL Input Fields

#### What Was Built:
Extended the chat UI to support ALL 62 CAPS input fields (previously only 16).

**Files Updated:**

1. **`chat-ui/lib/fan-context.ts`** - Complete rewrite:
   - Added comprehensive JSON output format with nested structure (performance, sizing, electrical, configuration, selection)
   - Added 54 field definitions with complete metadata (id, name, category, type, options, default, required, askHuman)
   - Added terminology mapping for all field variations
   - Added helper functions: `getAskHumanFields()`, `getFieldDefault()`, `getFieldsByCategory()`

2. **`chat-ui/lib/caps-generator.ts`** - Extended field support:
   - Expanded `FanSelection` interface from 17 to 76 fields
   - Updated `normalizeSelection()` to handle nested JSON format (performance, sizing, electrical, configuration)
   - Added `CAPS_HEADERS_EXTENDED` with all 56 columns
   - Added `generateCapsClipboardExtended()` for full export
   - Added `generateJsonExport()` for JSON output
   - Maintained backward compatibility with basic format

#### Field Categories Now Supported:
| Category | Fields |
|----------|--------|
| Core | mark, quantity, series, size, model |
| Performance | cfm, staticPressure, elevation, temperature |
| Electrical | voltage, phase, frequency, motorHp, motorDesign, enclosure, ulListed, efficiencyRating |
| VariGreen | variGreenControl, transformerHoa, includeBalanceDial |
| Electrical Accessories | disconnectSwitch, disconnectRating, disconnectProtection, disconnectType, motorStarter, wiringPigtail, motorMfgLocation, specialMotor |
| Sizing | availableSizes, sparkResistance, highWindRated, seismicRated, efficiencyCodeReq, caTitle20Req, driveType, applyVfd, speedController, performanceBaffle, damperSpCorrection |
| Construction | coatings, hoodHasps, conduitChaseQty, birdscreenMaterial, fasteners |
| Accessories | damper, damperActuator, damperMounting, damperBladeAction, unitWarranty, specialNameplate |
| Mounting | roofCurbs, curbExtension, curbCapAdapter, hingedCurbCap, curbSeal, tieDownPoints |

---

### Session: December 18, 2025 (Afternoon - 3:19 PM ET)

**Completed:** CAPS Data Set Verification (Task 0)

#### What Was Verified:
Conducted comprehensive audit of all CAPS fields comparing:
- TypeScript schema (`caps-selection.ts`) - 62+ fields defined
- Fan-selector library (`caps-clipboard.ts`) - 10 input, 23 output columns
- Chat UI (`caps-generator.ts`) - 16 fields in header
- Actual CAPS export (`Jobs/BuildVision-Test - Equipment Schedule.csv`) - 23 columns

#### Verification Results:
| Category | Total Fields | Implemented | Gap |
|----------|-------------|-------------|-----|
| **CAPS Output** (23 columns) | 23 | ✅ 23 | 0 |
| **CAPS Input (Basic)** | 10 | ✅ 10 | 0 |
| **CAPS UI - Sizing Screen** | 15 | ⚠️ 7 | 8 |
| **CAPS UI - Electrical Screen** | 25 | ⚠️ 8 | 17 |
| **CAPS UI - Configuration Screen** | 22 | ⚠️ 5 | 17 |
| **Total UI Fields** | **62** | **20** | **42** |

#### New File Created:
- `memory-bank/caps-field-verification.md` - Complete field-by-field audit

#### Key Findings:
1. **Output format complete** - All 23 CAPS export columns documented
2. **Basic input complete** - 10 clipboard import fields working
3. **42 UI fields not yet implemented** in chat interface
4. **Critical missing fields:**
   - Application requirements (Spark Resistance, Seismic, High Wind)
   - VFD/speed control options
   - Disconnect switch details
   - Damper configuration options
   - Mounting accessories

---

### Session: December 18, 2025 (Afternoon - 2:35 PM ET)

**Completed:** CAPS Clipboard Button functionality

#### New Files Created:
- `chat-ui/lib/caps-generator.ts` - Parses AI responses to extract fan parameters and generate CAPS CSV

#### Files Updated:
- `chat-ui/lib/fan-context.ts` - Added structured JSON output instructions for AI
- `chat-ui/app/page.tsx` - Integrated caps-generator to attach clipboard data to messages

#### How It Works:
1. AI is instructed to include `json:caps` code blocks with fan selection parameters
2. After streaming completes, `parseAiResponse()` extracts parameters from the response
3. If valid fan data is found, generates tab-delimited CAPS CSV
4. Attaches `capsClipboard` to the message for display and copy functionality
5. "Copy CAPS Clipboard" button becomes enabled when clipboard data exists

### Previous Session: December 18, 2025 (Morning)

**Completed:** TypeScript schema and integration library for Build Vision → CAPS

### Previous Session: December 18, 2025 (Morning)

**Completed:** TypeScript schema and integration library for Build Vision → CAPS

---

## Phase 1.5: Chat UI Framework ✅

**Build Date:** December 18, 2025 @ 2:15 PM ET

### What Was Built

Created `chat-ui/` - a Next.js 16 application for testing fan selections conversationally.

**Tech Stack:**
- Next.js 16 (App Router)
- React 19 with streaming
- Tailwind CSS v4 with `@tailwindcss/postcss`
- Claude Sonnet 4.5 via @anthropic-ai/sdk
- BuildVision design system (BV Blue #4A3AFF, Inter font)

**Files Created:**
```
chat-ui/
├── app/
│   ├── api/chat/route.ts    # Claude streaming API endpoint
│   ├── layout.tsx           # Root layout with Inter font
│   ├── page.tsx             # Main chat interface
│   └── globals.css          # BV design tokens via @theme
├── components/
│   ├── ui/button.tsx        # BV-styled button variants
│   ├── ui/card.tsx          # Card components
│   ├── ui/textarea.tsx      # Input textarea
│   ├── ui/badge.tsx         # Status badges
│   └── message-bubble.tsx   # Chat message rendering
├── lib/
│   ├── fan-context.ts       # AI system prompt with G/GB knowledge
│   └── utils.ts             # cn() utility
├── .env.local               # ANTHROPIC_API_KEY
├── package.json
├── tailwind.config.ts
└── README.md
```

**Test Status:**
```
bun dev: ✅ Server running on localhost:3000
GET /: ✅ 200 in 1114ms
POST /api/chat: ✅ 200 in 9.2s (streaming)
```

### Next Tasks for Chat UI

1. **CAPS Clipboard Button** - Generate valid tab-delimited CSV
2. **Full CAPS Output Display** - Show ALL input fields for Greenheck engineers
3. **Per-Section AI Context** - Mirror trane_lcur_demo pattern

**Reference:** `~/Programming/trane_lcur_demo/ai-context/`

---

## Build Status: ✅ Success

**Build Date:** December 18, 2025 @ 1:47 PM ET

```
npm install: ✅ 3 packages added, 0 vulnerabilities
npm run build: ✅ TypeScript compiled successfully
Example test: ✅ All 3 examples passed
```

**Compiled Output:**
- `dist/index.js` - Main entry point
- `dist/types/caps-selection.js` - CAPS schema
- `dist/data/buildvision-spec-mapping.js` - Spec mappings
- `dist/extraction/schedule-parser.js` - Parser
- `dist/export/caps-clipboard.js` - CSV export

**Test Results:**
```
Parse Statistics:
  Total items: 3
  Successful: 3 (100%)
  Failed: 0
  Incomplete: 0
  Specs mapped: 19
  Specs unmapped: 0
```

**Sample Output Generated:**
```
Mark    Quantity    CFM    SP      Voltage  Phase  Motor HP  Drive Type  Enclosure
EF-1    1           2500   0.5     460      3      1         Direct      TENV
EF-2    2           1200   0.375   115      1      1/2       VG Only     TENV
TEF-1   4           300    0.25    115      1      1/4       VG Only     TENV
```

---

## What's Been Accomplished

### 1. CAPS Data Analysis ✅
- Analyzed actual CAPS job export (CSV format)
- Captured 23 export columns from real G series VariGreen selections
- Understood .gfcj file format (base64 + gzip compressed JSON)
- Documented all 60+ CAPS UI fields across 3 screens (Sizing, Electrical, Configuration)

### 2. TypeScript Project Created ✅

**Location:** `/Users/mackenzie-buildvision/Engineer 4.48/fan-selector/`
**GitHub:** https://github.com/mrhoo2/fan-selector

**Project Structure:**
```
fan-selector/
├── package.json              # Project config
├── tsconfig.json             # TypeScript config
├── dist/                     # Compiled JavaScript output
├── examples/
│   └── example-usage.ts      # Working example with Build Vision JSON
├── src/
│   ├── index.ts              # Main exports
│   ├── data/
│   │   ├── buildvision-spec-mapping.ts  # BV spec type → CAPS mapping
│   │   └── terminology-dictionary.json  # Engineer notes → CAPS options
│   ├── export/
│   │   └── caps-clipboard.ts            # CSV export for CAPS import
│   ├── extraction/
│   │   └── schedule-parser.ts           # Parse BV JSON to CAPS input
│   └── types/
│       ├── caps-selection.ts            # Complete CAPS schema (450+ lines)
│       └── terminology.ts               # Dictionary types
```

### 3. Key Components Built

#### CAPS Selection Schema (`caps-selection.ts`)
- Complete TypeScript interfaces for all CAPS input fields
- Covers all 3 CAPS screens: Sizing, Electrical, Configuration
- Includes defaults matching actual CAPS values
- Output types matching CAPS CSV export format

#### Build Vision Spec Type Mapping (`buildvision-spec-mapping.ts`)
- Maps Build Vision SpecType IDs to CAPS field paths
- Includes transformation functions for each spec type
- Based on actual SpecTypes_FINAL_SEED.json from Build Vision backend

**Mapped Spec Types:**
| Build Vision Spec | CAPS Field |
|-------------------|------------|
| `7cafa240-...` (Voltage) | `electrical.motor.voltage` |
| `ea199f25-...` (Phase) | `electrical.motor.phase` |
| `cb135d4b-...` (Motor Horsepower) | `electrical.motor.motorSizeHp` |
| `b64d61da-...` (External Static Pressure) | `performance.staticPressure` |
| `4d04da7e-...` (Fan CFM) | `performance.cfm` |
| `aa16d27e-...` (Drive Type) | `sizing.advanced.driveType` |
| `029ffea1-...` (Backdraft Damper) | `configuration.damper` |
| `0850f620-...` (Disconnect Switch) | `electrical.electricalAccessories.disconnectSwitch` |

#### Schedule Parser (`schedule-parser.ts`)
- Accepts Build Vision extraction JSON as input
- Merges project defaults with item-specific specs
- Outputs CAPS-compatible selection inputs
- Tracks mapped/unmapped specs for analytics

#### CAPS Export (`caps-clipboard.ts`)
- Generates tab-delimited CSV for CAPS clipboard import
- Matches actual CAPS export column format
- Includes JSON export option

### 4. Terminology Dictionary (`terminology-dictionary.json`)
- Maps engineer specification notes to CAPS options
- Categories: electrical, disconnect, damper, construction, mounting, controls
- Includes common variations and alternate spellings (60+ mappings)

---

## Usage Example

```typescript
import { ScheduleParser, SPEC_TYPE_IDS, generateCapsInputCsv } from 'greenheck-caps-integration';

// Build Vision extraction data (from document AI)
const extraction = {
  projectId: 'proj-123',
  equipment: [
    {
      mark: 'EF-1',
      quantity: 1,
      specs: [
        { specTypeId: SPEC_TYPE_IDS.FAN_CFM, value: 2500 },
        { specTypeId: SPEC_TYPE_IDS.EXTERNAL_STATIC_PRESSURE, value: 0.5 },
        { specTypeId: SPEC_TYPE_IDS.VOLTAGE, value: 460 },
        { specTypeId: SPEC_TYPE_IDS.PHASE, value: 3 },
        { specTypeId: SPEC_TYPE_IDS.BACKDRAFT_DAMPER, value: true },
      ],
    },
  ],
};

// Parse and convert to CAPS format
const parser = new ScheduleParser();
const result = parser.parseExtraction(extraction);

// Generate CSV for CAPS clipboard import
const csv = generateCapsInputCsv(result.items.map(i => i.capsInput));
```

---

## Next Steps

### Immediate (Ready for Testing)
1. **Test with real Build Vision data** - Need actual extraction JSON
2. **Test CAPS clipboard import** - Paste generated CSV into CAPS on Windows

### Phase 2: Integration
1. Add more Build Vision spec type mappings as needed
2. Connect to Build Vision backend API
3. Add unit tests

### Phase 3: Analytics
1. Track selection win/loss rates
2. Compare Build Vision extractions to actual selections
3. Generate accuracy reports

---

## Technical Notes

### CAPS Model Naming Pattern
- G Series (Direct Drive): `G-{size}-VG` (e.g., G-098-VG, G-140-VG)
- GB Series (Belt Drive): `GB-{size}`
- Size codes: 060, 070, 082, 098, 103, 103HP, 120, 123, 133, 140, 143, 143HP, 163, 163HP, 183, 200, 203

### CAPS CSV Format
- Header: "Greenheck\nFan\n" followed by columns
- Columns: Mark, Quantity, Model, Drive Type, Volume (CFM), External SP, etc.
- Tab-delimited for clipboard import compatibility

### Build Vision Integration
- Input: JSON with `equipment[]` array containing `specs[]`
- Each spec has `specTypeId` (UUID), `value`, optional `specTypeName`, `unit`, `confidence`
- Parser handles project defaults that apply to all equipment
