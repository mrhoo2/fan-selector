# Project Brief: Greenheck Fan Selection Integration

## Vision
Partner with Greenheck to build an automated pipeline that extracts fan requirements from construction documents, maps them to CAPS selection inputs, and provides market intelligence on win/loss rates and selection accuracy.

## Context from Greenheck Meeting (Dec 2024)

### Greenheck's Timeline
- **Cloud CAPS**: ~18 months away from launch
- **Current State**: Legacy desktop application, slow processing
- **Goal**: "CAPS is intended to be a rep efficiency tool"

### Build Vision's Value Proposition
1. **Eliminate Re-keying**: Extract schedule data → structured format → CAPS import
2. **Accuracy Intelligence**: Help reps understand when they over/under select
3. **Market Data Capture**: Win rates, specification patterns, competitor analysis
4. **Future State**: Accelerate cash flow (reduce DSO)

### Tyler's Wireframe (CAPS Import Flow)
```
PDF Schedule → Structured Data → Column Mapping → CAPS Import → Batch Edit → Selection
                    ↑
            (Build Vision can automate this)
```

**Key insight**: CAPS already has clipboard import capability (Excel/CSV). Build Vision can:
1. Extract schedule data
2. Map to CAPS-compatible format
3. Optionally: Be "Build Vision compatible" to skip manual mapping step

---

## End-to-End Pipeline

```
Construction Documents → Document Extraction → CAPS Input Mapping → Selection → Analytics
       (PDFs/Specs)         (Build Vision)      (TypeScript Schema)   (CAPS/API)   (Dashboard)
                                  ↓
                         Structured Data
                         • Tag/Unit Number
                         • Model (G, GB, etc.)
                         • Size (103, 143HP, etc.)
                         • Volume (CFM)
                         • Static Pressure
                         • Voltage/Phase
                         • Notes → Accessories
```

---

## Primary Goals

### Phase 1: Schema & Extraction ✅ COMPLETE
- [x] Understand CAPS input parameters from decompiled code
- [x] Document G/GB series validation logic
- [x] Create TypeScript schema matching CAPS inputs
- [x] Build terminology mapping (notes → CAPS options)
- [x] Extract data from sample schedules

### Phase 1.5: Testing Interface 🔄 IN PROGRESS
- [x] Build chat UI (`chat-ui/`) with Claude Sonnet 4.5
- [x] BuildVision design system styling
- [ ] CAPS clipboard button (valid CSV generation)
- [ ] Full CAPS output display (all fields for Greenheck engineers)
- [ ] Per-section AI context structure (mirror trane_lcur_demo pattern)

### Phase 2: Build Vision Integration
- [ ] Map structured schedule data to CAPS clipboard format
- [ ] Handle notes interpretation (e.g., "factory disconnect" → NEMA options)
- [ ] Build "Build Vision compatible" import that skips manual mapping

### Phase 3: Analytics Dashboard
- [ ] Track selection accuracy (spec vs. actual selection)
- [ ] Win/loss rate by product, size, configuration
- [ ] Specification pattern analysis
- [ ] Engineering behavior insights

### Phase 4: Future State (Post-Cloud CAPS)
- [ ] Direct API integration with Cloud CAPS
- [ ] Automated selection generation
- [ ] Cash flow acceleration tools

---

## Key Data Structure Requirements

From Tyler's discussion, the critical data needs:

| Data Point | Purpose |
|------------|---------|
| Project Association | Link schedule data to specific jobs |
| Schedule Raw Data | Original engineer intent |
| CAPS Selections | What rep actually selected |
| Win/Loss Outcome | Did Greenheck win the job? |
| Selection Accuracy | Did selections match spec? |

### Critical Learning Goals
1. **Why do reps over-select?** (fear of missing something)
2. **Where does Greenheck win vs. lose?** (market intelligence)
3. **What specification patterns correlate with wins?**

---

## Technical Approach: TypeScript

### Why TypeScript?
- OS-agnostic (Mac/Windows/Linux)
- Aligns with Greenheck's web-based Cloud CAPS direction
- Same code runs in browser and server
- Great for LLM integration (extraction, mapping)

### Project Structure
```
fan-selector/
├── src/
│   ├── types/           # CAPS input/output types
│   ├── extraction/      # Schedule data extraction
│   ├── mapping/         # Notes → CAPS options
│   ├── validation/      # Selection validation
│   └── analytics/       # Win/loss tracking
├── data/
│   ├── models.json      # G, GB model data
│   ├── terminology.json # Notes → options mapping
│   └── caps-schema.json # CAPS import format
└── tests/
```

---

## Pilot Plan

### Partner: Viron (Wisconsin)
- Sophisticated rep that "gets" analytics
- Engineers and contractors together
- Willing to share data
- Local to Greenheck (easy collaboration)

### Pilot Deliverables
1. Extract schedules from Viron bid documents
2. Generate CAPS-compatible structured data
3. Track selection accuracy vs. specification
4. Build analytics dashboard for Greenheck

---

## Target Fan Models

| Model | Type | Description |
|-------|------|-------------|
| **G** | Direct Drive | Aluminum spun roof-mounted fan |
| **GB** | Belt Drive | Aluminum spun roof-mounted fan |

### Accurex Model Mapping
- `XRED` → `G` (Direct Drive)
- `XREB` → `GB` (Belt Drive)

---

## Source Materials
- **Location**: `/Users/mackenzie-buildvision/Engineer 4.48/Bin/`
- **Decompiled Output**: `/Users/mackenzie-buildvision/Engineer 4.48/Decompiled/`
- **162 DLLs** - 144 successfully decompiled (18,855 .cs files)

---

## Success Criteria

| Metric | Target |
|--------|--------|
| Schedule extraction accuracy | >95% correct field mapping |
| Notes interpretation accuracy | >90% correct option mapping |
| CAPS import compatibility | 100% valid imports |
| Analytics dashboard | Live win/loss tracking |

---

## Key Stakeholders

**Greenheck**:
- Scott Laurila - Business/Strategy
- Tyler Mancl - CAPS Product/Technical

**Build Vision**:
- Ben Lyddane - CEO
- Mike Powers - Sales/Partnerships
- Mackenzie Hoover - Engineering/Design

**Pilot Rep**:
- Viron (Rick Pleckman, Laura Gerkey)
