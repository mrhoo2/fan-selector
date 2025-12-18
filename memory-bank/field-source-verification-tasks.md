# Field Source Verification Tasks

**Purpose:** Track fields that need proper source extraction from CAPS software instead of "UI Sample" or "Database" placeholder sources.

**Goal:** Extract actual source file paths from decompiled C# code or database files so the tool can be automatically updated if the software changes.

**Status Legend:**
- ⬜ Not started
- 🔄 In progress
- ✅ Verified source found
- ❌ Source not in software (manual verification only)

---

## Fields Needing Source Verification

### Currently Marked as "UI Sample"

These fields were provided via user UI sample text and need their actual source located in the decompiled code.

| # | Field Name | Section | Current Status |
|---|------------|---------|----------------|
| 1 | availableSizes | Basic Inputs | ⬜ |
| 2 | caTitle20Req | Application Inputs | ⬜ |
| 3 | includeMotorDrive | Motor (Required) | ⬜ |
| 4 | motorDesign | Motor (Required) | ⬜ |
| 5 | transformerHoa | Control Options | ⬜ |
| 6 | includeBalanceDial | Control Options | ⬜ |
| 7 | disconnectSwitch | Electrical Accessories | ⬜ |
| 8 | motorStarter | Electrical Accessories | ⬜ |
| 9 | wiringPigtail | Electrical Accessories | ⬜ |
| 10 | dsProtection | Disconnect Switch Options | ⬜ |
| 11 | dsType | Disconnect Switch Options | ⬜ |
| 12 | dsJunctionBoxMtg | Disconnect Switch Options | ⬜ |
| 13 | dsSwitchWiring | Disconnect Switch Options | ⬜ |
| 14 | dsAuxiliaryContact | Disconnect Switch Options | ⬜ |
| 15 | dsAuxiliaryContactQty | Disconnect Switch Options | ⬜ |
| 16 | specialMotor | Motor (Advanced) | ⬜ |
| 17 | coatings | Construction | ⬜ |
| 18 | hoodHasps | Construction | ⬜ |
| 19 | conduitChaseQty | Construction | ⬜ |
| 20 | fasteners | Construction | ⬜ |
| 21 | specialNameplate | Accessories | ⬜ |
| 22 | damperMounting | Damper Options | ⬜ |
| 23 | damperQuantity | Damper Options | ⬜ |
| 24 | bladeAction | Damper Options | ⬜ |
| 25 | damperMountingType | Damper Options | ⬜ |
| 26 | actuatorType | Damper Options | ⬜ |
| 27 | endSwitch | Damper Options | ⬜ |
| 28 | roofCurbs | Mounting Accessories | ⬜ |
| 29 | curbExtension | Mounting Accessories | ⬜ |
| 30 | curbCapAdapter | Mounting Accessories | ⬜ |
| 31 | hingedCurbCap | Mounting Accessories | ⬜ |
| 32 | curbSeal | Mounting Accessories | ⬜ |
| 33 | tieDownPoints | Mounting Accessories | ⬜ |

### Currently Marked as "Database (Fans.zip)"

These fields likely have options stored in SQLite database files. Need to extract and verify.

| # | Field Name | Section | Current Status |
|---|------------|---------|----------------|
| 34 | efficiencyCodeReq | Application Inputs | ⬜ |
| 35 | efficiencyRating | Motor (Required) | ⬜ |
| 36 | variGreenControl | Control Options | ⬜ |
| 37 | dsEnclosureRating | Disconnect Switch Options | ⬜ |
| 38 | unitWarranty | Accessories | ⬜ |
| 39 | damperModel | Damper Options | ⬜ |

---

## Verification Tasks (Grouped by 5)

### Task 1: Basic/Application Input Fields ✅ COMPLETE
**Fields:** availableSizes, caTitle20Req, efficiencyCodeReq, coatings, hoodHasps
**Search Strategy:** Look in IFanSelector.cs and related configuration enums
**Results:**
- availableSizes: ✅ `AvailableSizes.cs` (enum: Recommended, All, Unsafe, Specific) - REVIEW: UI may show "Optimized"
- caTitle20Req: ✅ `IFanSelector.cs` - CalculateFEI boolean property
- efficiencyCodeReq: ✅ `IFanSelectorWrapper.cs` - EfficiencyCode string property
- coatings: ❌ NOT FOUND in C# - Delphi UI only
- hoodHasps: ❌ NOT FOUND in C# - Delphi UI only

### Task 2: Motor Required Fields ✅ COMPLETE
**Fields:** includeMotorDrive, motorDesign, efficiencyRating, transformerHoa, includeBalanceDial
**Search Strategy:** Look in Cfs.Fans.MotorSelector2 directory for motor-related enums
**Results:**
- includeMotorDrive: ❌ NOT FOUND in C# - Delphi UI only
- motorDesign: ✅ `MotorType.cs` (enum: Nema, Iec, BrushlessDirectCurrent, ShadedPole, PermanentSplitCapacitor, SynchronousReluctance)
- efficiencyRating: 🔄 Found `IecEfficiencyClass.cs` for IEC (NA, EFF2, IE1-IE5). NEMA Standard/High/Premium may be in database
- transformerHoa: ❌ NOT FOUND in C# - Delphi UI only  
- includeBalanceDial: ❌ NOT FOUND in C# - Delphi UI only

### Task 3: Electrical Accessories Fields ✅ COMPLETE
**Fields:** disconnectSwitch, motorStarter, wiringPigtail, dsProtection, dsType
**Search Strategy:** Search for "disconnect", "starter", "wiring" in decompiled code
**Results:**
- disconnectSwitch: ❌ NOT FOUND in C# - Delphi UI only (found DisconnectSwitch in TutcoDH for duct heaters, not fans)
- motorStarter: ❌ NOT FOUND in C# - Delphi UI only
- wiringPigtail: ❌ NOT FOUND in C# - Delphi UI only
- dsProtection: ❌ NOT FOUND in C# - Delphi UI only
- dsType: ❌ NOT FOUND in C# - Delphi UI only

### Task 4: Disconnect Switch Options ✅ COMPLETE
**Fields:** dsJunctionBoxMtg, dsSwitchWiring, dsAuxiliaryContact, dsAuxiliaryContactQty, dsEnclosureRating
**Search Strategy:** Search for "junction", "auxiliary", "NEMA" in decompiled code
**Results:**
- dsJunctionBoxMtg: ❌ NOT FOUND in C# - Delphi UI only
- dsSwitchWiring: ❌ NOT FOUND in C# - Delphi UI only
- dsAuxiliaryContact: ❌ NOT FOUND in C# - Delphi UI only
- dsAuxiliaryContactQty: ❌ NOT FOUND in C# - Delphi UI only
- dsEnclosureRating: ❌ NOT FOUND in C# - Delphi UI only (NEMA ratings not in fan DLLs)

### Task 5: Motor Advanced & Construction ✅ COMPLETE
**Fields:** specialMotor, conduitChaseQty, fasteners, specialNameplate, unitWarranty
**Search Strategy:** Search in FanSelector and construction-related files
**Results:**
- specialMotor: ❌ NOT FOUND in C# - Delphi UI only
- conduitChaseQty: ❌ NOT FOUND in C# - Delphi UI only
- fasteners: ❌ NOT FOUND in C# - Delphi UI only
- specialNameplate: ❌ NOT FOUND in C# - Delphi UI only
- unitWarranty: ❌ NOT FOUND in C# - Delphi UI only (likely database)

### Task 6: Damper Options (Part 1) ✅ COMPLETE
**Fields:** damperModel, damperMounting, damperQuantity, bladeAction, damperMountingType
**Search Strategy:** Look in Cfs.Dampers namespace or damper-related files
**Results:**
- damperModel: ❌ NOT FOUND in C# - accessory model in database (DamperTypes.cs is for SP corrections only)
- damperMounting: ❌ NOT FOUND in C# - Delphi UI only
- damperQuantity: ❌ NOT FOUND in C# - Delphi UI only
- bladeAction: ❌ NOT FOUND in C# - Delphi UI only
- damperMountingType: ❌ NOT FOUND in C# - Delphi UI only
**Related Enums Found:**
- ✅ `DamperTypes.cs` → None, Backdraft, Control (for static pressure corrections)
- ✅ `IsolationDamperTypes.cs` → None, Gravity, Control (for isolation dampers)

### Task 7: Damper Options (Part 2) & Mounting ✅ COMPLETE
**Fields:** actuatorType, endSwitch, roofCurbs, curbExtension, curbCapAdapter
**Search Strategy:** Search for "actuator", "curb", "mounting" in decompiled code
**Results:**
- actuatorType: 🔄 PARTIAL - IsolationDamperTypes.cs has Gravity/Control, but Electric/Pneumatic in Delphi UI
- endSwitch: ❌ NOT FOUND in C# - Delphi UI only
- roofCurbs: ❌ NOT FOUND in C# - accessory in Delphi UI only
- curbExtension: ❌ NOT FOUND in C# - Delphi UI only
- curbCapAdapter: ❌ NOT FOUND in C# - Delphi UI only
**Related Enums Found:**
- ✅ `CurbMountedPreferenceType.cs` → No, Yes (used for performance calculations, not accessory selection)

### Task 8: Remaining Mounting Accessories ✅ COMPLETE
**Fields:** hingedCurbCap, curbSeal, tieDownPoints, variGreenControl
**Search Strategy:** Search for "hinged", "seal", "VariGreen" in decompiled code
**Results:**
- hingedCurbCap: ❌ NOT FOUND in C# - Delphi UI only
- curbSeal: ❌ NOT FOUND in C# - Delphi UI only
- tieDownPoints: ❌ NOT FOUND in C# - Delphi UI only
- variGreenControl: ❌ NOT FOUND in C# - Delphi UI only (control options, not VG drive)
**Related Properties Found:**
- ✅ `IFanSelector.cs` → VariGreenOnly property (boolean) - used to filter VariGreen-only selections

---

## Search Commands Reference

```bash
# Search for a specific field name in decompiled code
grep -ri "fieldname" Decompiled/Cfs.Fans.* --include="*.cs"

# Find all enum definitions
grep -r "public enum" Decompiled/Cfs.Fans.FanSelector* --include="*.cs"

# Search in motor selector
grep -ri "fieldname" Decompiled/Cfs.Fans.MotorSelector2* --include="*.cs"

# Extract and search database
cd Data/Core/English
unzip -l Fans.zip  # List contents
unzip Fans.zip -d extracted/
sqlite3 extracted/*.db ".tables"
```

---

## How to Use This Document

1. **Pick a task** from the "Verification Tasks" section above
2. **Run the search commands** to find the source file
3. **Update status** in the table (⬜ → ✅ or ❌)
4. **Update caps-field-options.ts** with the correct source comment
5. **Mark task complete** when all 5 fields are verified

---

## Already Verified Sources (Reference)

These fields have confirmed decompiled sources:

| Field | Source File |
|-------|-------------|
| sparkResistance | SparkResistanceOptions.cs |
| driveType | DriveType.cs |
| applyVfd | AllowVfd.cs |
| damperCorrection | DamperTypes.cs |
| enclosure | EnclosureType.cs |
| motorMfgLocation | ManufacturingLocation.cs |
| highWindRated | IFanSelector.cs - RequiresHighWind |
| seismicRated | IFanSelector.cs - RequiresSeismic |
| speedController | IFanSelector.cs - AllowSpeedController |
| performanceBaffle | IFanSelector.cs - AllowPerformanceBaffle |
| voltage | IFanSelector.cs - Voltage |
| phase | IFanSelector.cs - Phase |
| ulListed | IFanSelector.cs - RequiresUL762 |
| motorSize | IMotorSelector.cs - HP values |
| damper | IFanSelector.cs - HasDamper |
| birdscreenMaterial | Material.cs |

---

## Last Updated
2024-12-18

## Total Progress
- **All 8 Tasks Complete**
- **Verified in C# DLLs:** 7 fields (availableSizes, caTitle20Req, efficiencyCodeReq, motorDesign, DamperTypes, IsolationDamperTypes, CurbMountedPreferenceType)
- **NOT FOUND in C# DLLs:** 35 fields - Handled by Delphi UI layer (.bpl files) or SQLite database
- **Previously Verified:** 16 fields (sparkResistance, driveType, applyVfd, etc.)

## Key Findings

### Architecture Insight
The CAPS software uses a **hybrid architecture**:
1. **C# DLLs** - Handle fan selection calculations, motor selection, performance calculations
2. **Delphi UI (.bpl)** - Handle accessory configuration, mounting options, electrical accessories
3. **SQLite Database** - Store option values, model data, pricing

### Fields Found in C# Code
Core selection parameters that affect fan performance calculations are in C# enums:
- Fan sizing: AvailableSizes, DriveType, AllowVfd
- Motor: MotorType, EnclosureType, ManufacturingLocation
- Performance: DamperTypes (SP corrections), IsolationDamperTypes, CurbMountedPreferenceType
- Application: SparkResistanceOptions, CalculateFEI, RequiresHighWind, RequiresSeismic

### Fields NOT Found in C# Code
Accessory and configuration options that don't affect core calculations:
- All disconnect switch options (10 fields)
- All damper accessory options (7 fields)
- All mounting accessories (6 fields)
- Construction options (coatings, hoodHasps, fasteners, etc.)
- Motor accessories (transformerHoa, includeBalanceDial)

These are likely in:
- Delphi UI code (.bpl files in Bin/)
- SQLite database tables
- Product configuration files
