# CAPS Field Verification Report

**Generated:** December 18, 2025  
**Purpose:** Verify complete data set coverage for Greenheck CAPS integration

---

## Summary

| Category | Total Fields | Implemented | Gap |
|----------|-------------|-------------|-----|
| **CAPS Output** (23 columns) | 23 | ✅ 23 | 0 |
| **CAPS Input (Basic)** | 10 | ✅ 10 | 0 |
| **CAPS UI - Sizing Screen** | 15 | ⚠️ 7 | 8 |
| **CAPS UI - Electrical Screen** | 25 | ⚠️ 8 | 17 |
| **CAPS UI - Configuration Screen** | 22 | ⚠️ 5 | 17 |
| **Total UI Fields** | **62** | **20** | **42** |

---

## 1. CAPS Output Fields (CSV Export) ✅ COMPLETE

These are the columns in actual CAPS export files. All 23 are documented.

| # | Column Name | Type | In Schema | In Export |
|---|------------|------|-----------|-----------|
| 1 | Mark | string | ✅ | ✅ |
| 2 | Quantity | number | ✅ | ✅ |
| 3 | Model | string | ✅ | ✅ |
| 4 | Drive Type | Direct/Belt | ✅ | ✅ |
| 5 | Volume (CFM) | number | ✅ | ✅ |
| 6 | External SP (in. wg) | number | ✅ | ✅ |
| 7 | Total External SP (in. wg) | number | ✅ | ✅ |
| 8 | Fan Speed (RPM) | number | ✅ | ✅ |
| 9 | Outlet Velocity (ft/min) | number | ✅ | ✅ |
| 10 | Inlet dBA | number | ✅ | ✅ |
| 11 | Inlet Sones | number | ✅ | ✅ |
| 12 | Outlet dBA | number | ✅ | ✅ |
| 13 | Outlet Sones | number | ✅ | ✅ |
| 14 | FEI | number/null | ✅ | ✅ |
| 15 | Operating Power (hp) | number | ✅ | ✅ |
| 16 | Motor Size (hp) | string | ✅ | ✅ |
| 17 | FEP Input Power (kW) | number | ✅ | ✅ |
| 18 | Enclosure | string | ✅ | ✅ |
| 19 | Voltage | number | ✅ | ✅ |
| 20 | Cycle | 50/60 Cycle | ✅ | ✅ |
| 21 | Phase | 1/3 | ✅ | ✅ |
| 22 | Total Weight (lb) | number | ✅ | ✅ |
| 23 | EC Motor | string/null | ✅ | ✅ |

**Source:** `Jobs/BuildVision-Test - Equipment Schedule.csv`

---

## 2. CAPS Input Fields (Basic Clipboard) ✅ COMPLETE

Minimum fields needed for CAPS clipboard import:

| # | Field | Type | In fan-selector | In chat-ui |
|---|-------|------|-----------------|------------|
| 1 | Mark | string | ✅ | ✅ |
| 2 | Quantity | number | ✅ | ✅ |
| 3 | CFM | number | ✅ | ✅ |
| 4 | SP | number | ✅ | ✅ |
| 5 | Voltage | number | ✅ | ✅ |
| 6 | Phase | number | ✅ | ✅ |
| 7 | Motor HP | string | ✅ | ✅ |
| 8 | Drive Type | string | ✅ | ✅ |
| 9 | Enclosure | string | ✅ | ✅ |
| 10 | Notes | string | ✅ | ❌ |

---

## 3. CAPS UI - Sizing Screen (⚠️ GAPS)

### 3.1 Basic Inputs
| Field | Type | Default | In Schema | In Chat UI |
|-------|------|---------|-----------|------------|
| Available Sizes | Optimized/All/array | Optimized | ✅ | ❌ |

### 3.2 Application Inputs
| Field | Type | Default | In Schema | In Chat UI |
|-------|------|---------|-----------|------------|
| Spark Resistance | None/TypeA/TypeB/TypeC | None | ✅ | ❌ |
| High Wind Rated | boolean | false | ✅ | ❌ |
| Seismic Rated | boolean | false | ✅ | ❌ |
| Efficiency Code Req | boolean | false | ✅ | ❌ |
| CA Title 20 Req | boolean | false | ✅ | ❌ |

### 3.3 Advanced Inputs
| Field | Type | Default | In Schema | In Chat UI |
|-------|------|---------|-----------|------------|
| Drive Type | Direct/Belt/VG Only/Any | VG Only | ✅ | ✅ |
| Apply VFD | boolean | false | ✅ | ❌ |
| Speed Controller | boolean | false | ✅ | ❌ |
| Performance Baffle | boolean | false | ✅ | ❌ |

### 3.4 SP Corrections
| Field | Type | Default | In Schema | In Chat UI |
|-------|------|---------|-----------|------------|
| Damper | None/Backdraft/Motorized | None | ✅ | ⚠️ (simplified) |

**Sizing Screen Gap: 8 fields not in Chat UI**

---

## 4. CAPS UI - Electrical/Motor Screen (⚠️ GAPS)

### 4.1 Motor Configuration
| Field | Type | Default | In Schema | In Chat UI |
|-------|------|---------|-----------|------------|
| Include Motor/Drive | boolean | true | ✅ | ❌ |
| Motor Size HP | string | 1/4 | ✅ | ✅ |
| Phase | 1/3 | 1 | ✅ | ✅ |
| Voltage | 115-575 | 115 | ✅ | ✅ |
| Motor Design | NEMA/IEC | NEMA | ✅ | ❌ |
| Enclosure | TENV/TEFC/ODP/TEAO/IP55 | TENV | ✅ | ✅ |
| UL Listed | string | 705 | ✅ | ❌ |
| Efficiency Rating | Standard/High/Premium | High | ✅ | ❌ |

### 4.2 Control Options (VariGreen)
| Field | Type | Default | In Schema | In Chat UI |
|-------|------|---------|-----------|------------|
| VariGreen Control | None/Remote Dial/BA/0-10V/4-20mA | Remote Dial | ✅ | ❌ |
| Transformer HOA | None/Transformer/Remote | Transformer | ✅ | ❌ |
| Include Balance Dial | boolean | true | ✅ | ❌ |

### 4.3 Electrical Accessories
| Field | Type | Default | In Schema | In Chat UI |
|-------|------|---------|-----------|------------|
| Disconnect Switch | boolean | false | ✅ | ✅ |
| Motor Starter | boolean | false | ✅ | ❌ |
| Wiring Pigtail | boolean | false | ✅ | ❌ |

### 4.4 Disconnect Switch Options
| Field | Type | Default | In Schema | In Chat UI |
|-------|------|---------|-----------|------------|
| Enclosure Rating | NEMA-1/3R/4/4X | NEMA-1 | ✅ | ❌ |
| Protection | None/Fused/Circuit Breaker | None | ✅ | ❌ |
| Type | Toggle/Rotary | Toggle | ✅ | ❌ |
| Junction Box Mtg | Mounted/Loose | Mounted | ✅ | ❌ |
| Switch Wiring | None/Prewired | None | ✅ | ❌ |
| Auxiliary Contact | boolean | false | ✅ | ❌ |
| Aux Contact Qty | number | 0 | ✅ | ❌ |

### 4.5 Motor Advanced
| Field | Type | Default | In Schema | In Chat UI |
|-------|------|---------|-----------|------------|
| Motor Mfg Location | No Preference/USA/NA | No Preference | ✅ | ❌ |
| Special Motor | boolean | false | ✅ | ❌ |

**Electrical Screen Gap: 17 fields not in Chat UI**

---

## 5. CAPS UI - Configuration Screen (⚠️ GAPS)

### 5.1 Construction Options
| Field | Type | Default | In Schema | In Chat UI |
|-------|------|---------|-----------|------------|
| Coatings | boolean/string | false | ✅ | ❌ |
| Hood Hasps | boolean | false | ✅ | ❌ |
| Conduit Chase Qty | number | 1 | ✅ | ❌ |
| Birdscreen Material | Galv/Alum/SS/None | Galvanized | ✅ | ❌ |
| Fasteners | Standard/Stainless | Standard | ✅ | ❌ |

### 5.2 General Accessories
| Field | Type | Default | In Schema | In Chat UI |
|-------|------|---------|-----------|------------|
| Damper | boolean | false | ✅ | ✅ |
| Unit Warranty | 1/3/5 Yr | 1 Yr | ✅ | ❌ |
| Special Nameplate | boolean | false | ✅ | ❌ |

### 5.3 Damper Options
| Field | Type | Default | In Schema | In Chat UI |
|-------|------|---------|-----------|------------|
| Model | string | - | ✅ | ❌ |
| Damper Mounting | Loose/Factory | Factory | ✅ | ❌ |
| Damper Quantity | number | 1 | ✅ | ❌ |
| Blade Action | Parallel/Opposed | Parallel | ✅ | ❌ |
| Damper Mounting Type | Channel/Flange | Channel | ✅ | ❌ |
| Actuator Type | Gravity/Motorized/Spring | Gravity | ✅ | ❌ |
| End Switch | boolean | false | ✅ | ❌ |

### 5.4 Mounting Accessories
| Field | Type | Default | In Schema | In Chat UI |
|-------|------|---------|-----------|------------|
| Roof Curbs | boolean | false | ✅ | ❌ |
| Curb Extension | boolean | false | ✅ | ❌ |
| Curb Cap Adapter | boolean | false | ✅ | ❌ |
| Hinged Curb Cap | None/string | None | ✅ | ❌ |
| Curb Seal | boolean | false | ✅ | ❌ |
| Tie Down Points | boolean | false | ✅ | ❌ |

**Configuration Screen Gap: 17 fields not in Chat UI**

---

## 6. Chat UI Extra Fields (Not in fan-selector)

The chat UI includes these fields that the fan-selector library doesn't:

| Field | In Chat UI | In fan-selector |
|-------|------------|-----------------|
| Frequency (Hz) | ✅ | ❌ |
| Series (G/GB) | ✅ | ❌ (derived) |
| Size | ✅ | ❌ (derived) |
| Elevation | ✅ | ❌ |
| Temperature | ✅ | ❌ |

---

## 7. Recommendations

### Immediate Priority (Task 2)
1. **Add missing critical fields to Chat UI JSON output:**
   - Spark Resistance (required for some applications)
   - Seismic Rated (required for California)
   - High Wind Rated (required for coastal)
   - VFD (Variable Frequency Drive)
   - Disconnect details (rating, protection type)
   - Damper details (actuator type, mounting)
   - Roof Curb

2. **Update fan-context.ts** with complete field list in the JSON template

3. **Update caps-generator.ts** to parse and export all fields

### Phase 2 (Task 3)
Create per-section AI context files:
- `exhaust-fans/performance.md` - CFM, SP, Elevation, Temperature
- `exhaust-fans/electrical.md` - All motor/electrical fields
- `exhaust-fans/sizing.md` - Drive type, application requirements
- `exhaust-fans/configuration.md` - Construction, damper, mounting

### Phase 3
- Add field validation rules
- Add conditional field logic (e.g., disconnect options only when disconnect = true)
- Add field dependencies documentation

---

## 8. Field Categorization for AI

### User MUST Provide
- CFM
- Static Pressure

### User SHOULD Provide (Ask if missing)
- Voltage
- Phase
- Drive Type preference

### AI Can Auto-Generate (with defaults)
- Frequency (60 Hz default)
- Enclosure (TEFC default)
- Elevation (0 default)
- Temperature (70°F default)
- All accessories (false defaults)

### AI Should Infer from Context
- Series (G for direct, GB for belt)
- Size (from CFM/SP requirements)
- Motor HP (from selection result)

---

## Files Reviewed

| File | Location | Fields Defined |
|------|----------|----------------|
| caps-selection.ts | fan-selector/src/types/ | 62+ fields (schema) |
| caps-clipboard.ts | fan-selector/src/export/ | 23 output, 10 input |
| fan-context.ts | chat-ui/lib/ | ~17 fields |
| caps-generator.ts | chat-ui/lib/ | 16 fields |
| CAPS Export CSV | Jobs/ | 23 columns |
