# Drive Type & Sizing Section

## Overview
The drive type section determines whether the fan uses direct drive or belt drive, and includes related sizing options. This is one of the most important selections as it determines which series (G or GB) is appropriate and affects motor selection, maintenance requirements, and efficiency.

## Fields in this Section

### Drive Type (driveType) - REQUIRED - ASK IF RELEVANT
The mechanism used to transfer power from motor to fan wheel.

**Available Options:**
- Direct ← **Default for lower CFM**
- Belt
- VG Only (VariGreen EC motor)
- Any (show all options)

**Selection Logic:**

| Drive Type | Series | Best For | Characteristics |
|------------|--------|----------|-----------------|
| **Direct** | G | CFM < 10,000, Lower noise, Low maintenance | Motor shaft directly connected to wheel |
| **Belt** | GB | High CFM, Flexibility in motor sizing | V-belt connects motor to fan shaft |
| **VG Only** | G-VG | Variable speed needs, Energy efficiency | EC motor with integrated VFD |
| **Any** | G or GB | When comparing options | Shows all viable selections |

**Performance Boundaries:**
- G Series (Direct): Up to ~15,000 CFM max, best under 10,000
- GB Series (Belt): 1,000 - 50,000+ CFM, no upper limit

**AI Generation Strategy:**
- **DEFAULT**: Direct (G series) for CFM ≤ 10,000
- Use Belt (GB series) if:
  - CFM > 10,000 (belt drive provides more options)
  - User specifically requests belt drive
  - High SP with moderate CFM (belt provides more motor flexibility)
- Use VG Only if:
  - User mentions "variable speed", "VariGreen", "EC motor", "VFD"
  - Energy efficiency is priority
  - Building automation integration needed
- **MAYBE ASK** if CFM is borderline (8,000-12,000): "Would you prefer direct drive (quieter, less maintenance) or belt drive (more flexibility)?"

### Available Sizes (availableSizes) - OPTIONAL - AUTO-GENERATE
Filter for fan sizes to include in selection.

**Available Options:**
- Optimized ← **Default** (CAPS shows best options)
- All (show all sizes that can meet requirements)
- [Array of specific sizes]

**Selection Logic:**
- **Optimized**: CAPS software selects most efficient sizes
- **All**: Shows complete range of options
- **Specific**: User has constraint (existing curb, space limitation)

**AI Generation Strategy:**
- **DEFAULT**: "Optimized"
- Use "All" if user wants to compare options
- Use specific sizes only if user has existing curb or space constraint
- NEVER ask unless user mentions size constraint

### Spark Resistance (sparkResistance) - OPTIONAL - ASK IF RELEVANT
AMCA Spark Resistance classification for hazardous environments.

**Available Options:**
- None ← **Default**
- TypeA (All aluminum/non-ferrous)
- TypeB (Non-ferrous wheel, steel housing with coating)
- TypeC (Steel with coating)

**Selection Logic:**
- **None**: General exhaust, non-hazardous
- **Type A**: Most stringent, volatile environments
  - All components non-sparking
  - Required for highly explosive atmospheres
- **Type B**: Medium hazard
  - Non-ferrous wheel (can't spark on housing)
  - Common for labs, paint booths
- **Type C**: Lowest spark resistance level
  - Coated steel components
  - Light industrial applications

**Application Guidelines:**
| Application | Recommended Spark Resistance |
|-------------|------------------------------|
| General exhaust | None |
| Office/restroom | None |
| Kitchen/grease | None |
| Paint booth | Type B |
| Laboratory fume | Type B |
| Chemical storage | Type A or B |
| Solvent handling | Type A |
| Grain/dust | Type A or B |
| Explosive gases | Type A |

**AI Generation Strategy:**
- **DEFAULT**: None
- **ASK** if user mentions:
  - Lab, laboratory, fume hood → "Do you need spark resistance? Type B is common for labs."
  - Paint, solvent, explosive → "What spark resistance classification is required?"
  - Chemical, hazardous → "Is this a hazardous environment requiring spark resistance?"
- Use Type B if:
  - Lab or paint booth mentioned
  - User unsure but mentions "some hazardous materials"
- Use Type A if:
  - Highly explosive environment
  - User specifically requests

### High Wind Rated (highWindRated) - OPTIONAL - ASK IF RELEVANT
Enhanced construction for high wind environments.

**Type:** Boolean
**Default:** false

**Selection Logic:**
- Standard fans rated for typical wind conditions
- High wind rated construction for:
  - Coastal locations (hurricane zones)
  - High-rise buildings
  - Areas with >90 mph design wind speeds

**AI Generation Strategy:**
- **DEFAULT**: false
- **ASK** if user mentions:
  - "Florida", "Gulf Coast", "hurricane"
  - "high rise", "tall building"
  - "high wind", "coastal"
- Use true if coastal/hurricane zone confirmed
- NEVER ask for typical inland projects

### Seismic Rated (seismicRated) - OPTIONAL - ASK IF RELEVANT
Seismic certification for earthquake-prone areas.

**Type:** Boolean
**Default:** false

**Selection Logic:**
- Required in seismic design categories C, D, E, F
- Common requirement in California, Pacific Northwest, Alaska
- Also required for essential facilities (hospitals) in moderate zones

**AI Generation Strategy:**
- **DEFAULT**: false
- **ASK** if user mentions:
  - "California", "Seattle", "Portland", "Alaska"
  - "seismic", "earthquake"
  - "hospital", "essential facility" + West Coast
- Use true if California project confirmed
- NEVER ask for typical East Coast/Midwest projects

### Efficiency Code Requirement (efficiencyCodeReq) - OPTIONAL - AUTO-GENERATE
DOE energy efficiency code compliance.

**Type:** Boolean
**Default:** false

**Selection Logic:**
- DOE fan efficiency regulations for commercial fans
- May be required by code for certain applications
- Affects available fan selections

**AI Generation Strategy:**
- **DEFAULT**: false
- Use true if user mentions DOE compliance requirement
- NEVER ask - code compliance handled separately

### CA Title 20 Requirement (caTitle20Req) - OPTIONAL - ASK IF RELEVANT
California Title 20 appliance efficiency compliance.

**Type:** Boolean
**Default:** false

**Selection Logic:**
- California-specific energy efficiency requirement
- Required for products sold/installed in California
- Affects available motor options

**AI Generation Strategy:**
- **DEFAULT**: false
- **ASK** if user mentions California project
- Use true if California confirmed
- Often paired with seismicRated = true for CA projects

### Apply VFD (applyVfd) - OPTIONAL - AUTO-GENERATE
Variable Frequency Drive for speed control.

**Type:** Boolean
**Default:** false

**Selection Logic:**
- VFD allows motor speed adjustment
- Used for energy savings, noise reduction
- Alternative to VariGreen for belt drive fans
- Requires inverter-duty motor

**AI Generation Strategy:**
- **DEFAULT**: false
- Use true if:
  - User mentions "VFD" or "variable frequency drive"
  - Variable speed needed on belt drive (GB) fan
  - Energy efficiency priority on non-VG model
- NEVER ask - use VariGreen for variable speed instead

### Speed Controller (speedController) - OPTIONAL - AUTO-GENERATE
Factory speed controller (non-VFD).

**Type:** Boolean
**Default:** false

**Selection Logic:**
- Simple speed control for direct drive fans
- Less efficient than VFD/VariGreen
- Lower cost option

**AI Generation Strategy:**
- **DEFAULT**: false
- Use true only if user explicitly requests
- NEVER ask - recommend VariGreen instead

### Performance Baffle (performanceBaffle) - OPTIONAL - AUTO-GENERATE
Baffle to improve fan performance characteristics.

**Type:** Boolean
**Default:** false

**AI Generation Strategy:**
- **DEFAULT**: false
- Use true only if user explicitly requests
- NEVER ask

### Damper SP Correction (damperSpCorrection) - OPTIONAL - AUTO-GENERATE
Static pressure correction for installed damper.

**Available Options:**
- None ← **Default**
- Backdraft (Gravity damper correction)
- Motorized (Motorized damper correction)

**Selection Logic:**
- Adjusts SP calculation for damper pressure drop
- Only needed if damper included in fan selection
- CAPS applies correction automatically

**AI Generation Strategy:**
- **DEFAULT**: None
- Auto-select based on damper selection:
  - No damper → None
  - Gravity damper → Backdraft
  - Motorized damper → Motorized
- NEVER ask - derive from damper selection

## Dependencies

### Affects Other Sections:
- **Series**: Direct → G, Belt → GB
- **Electrical**: VariGreen has specific electrical requirements
- **Model Selection**: Drive type determines available models

### Affected By:
- **CFM**: High CFM typically needs belt drive
- **Application**: Hazardous environments may need spark resistance
- **Location**: Region affects seismic/wind requirements

## Common Scenarios

### Scenario 1: Small Office Exhaust (Direct Drive)
```json
{
  "driveType": "Direct",
  "availableSizes": "Optimized",
  "sparkResistance": "None",
  "highWindRated": false,
  "seismicRated": false,
  "efficiencyCodeReq": false,
  "caTitle20Req": false,
  "applyVfd": false,
  "speedController": false,
  "performanceBaffle": false,
  "damperSpCorrection": "None"
}
```
**Reasoning:** Standard office exhaust, low CFM. Direct drive is quieter and lower maintenance.
**Series:** G

### Scenario 2: Large Warehouse (Belt Drive)
```json
{
  "driveType": "Belt",
  "availableSizes": "Optimized",
  "sparkResistance": "None",
  "highWindRated": false,
  "seismicRated": false,
  "efficiencyCodeReq": false,
  "caTitle20Req": false,
  "applyVfd": false,
  "damperSpCorrection": "Backdraft"
}
```
**Reasoning:** High CFM (>15,000) requires belt drive. GB series provides necessary capacity.
**Series:** GB

### Scenario 3: Laboratory Fume Exhaust (Spark Resistant)
```json
{
  "driveType": "Direct",
  "availableSizes": "Optimized",
  "sparkResistance": "TypeB",
  "highWindRated": false,
  "seismicRated": false,
  "efficiencyCodeReq": false,
  "caTitle20Req": false,
  "applyVfd": false,
  "damperSpCorrection": "None"
}
```
**Reasoning:** Lab exhaust requires Type B spark resistance for safety. Direct drive adequate for moderate CFM.
**Series:** G with Type B spark construction

### Scenario 4: California Hospital (VariGreen, Seismic)
```json
{
  "driveType": "VG Only",
  "availableSizes": "Optimized",
  "sparkResistance": "None",
  "highWindRated": false,
  "seismicRated": true,
  "efficiencyCodeReq": false,
  "caTitle20Req": true,
  "applyVfd": false,
  "damperSpCorrection": "None"
}
```
**Reasoning:** California requires seismic rating and Title 20. Hospital benefits from VariGreen variable speed for energy and BMS integration.
**Series:** G-VG

### Scenario 5: Florida Coastal Project (High Wind)
```json
{
  "driveType": "Direct",
  "availableSizes": "Optimized",
  "sparkResistance": "None",
  "highWindRated": true,
  "seismicRated": false,
  "efficiencyCodeReq": false,
  "caTitle20Req": false,
  "applyVfd": false,
  "damperSpCorrection": "None"
}
```
**Reasoning:** Gulf Coast location requires high wind rated construction. No seismic needed in Florida.
**Series:** G (high wind construction)

### Scenario 6: Paint Booth Exhaust (Spark Type A)
```json
{
  "driveType": "Belt",
  "availableSizes": "Optimized",
  "sparkResistance": "TypeA",
  "highWindRated": false,
  "seismicRated": false,
  "efficiencyCodeReq": false,
  "caTitle20Req": false,
  "applyVfd": true,
  "damperSpCorrection": "Motorized"
}
```
**Reasoning:** Paint booth requires Type A spark resistance for volatile solvents. VFD for variable flow control. Motorized damper for control.
**Series:** GB with Type A spark construction

## Human Input Required?

### SOMETIMES ASK:
| Field | Question | When to Ask |
|-------|----------|-------------|
| Drive Type | "Direct or belt drive?" | Only if CFM is 8,000-12,000 (borderline) |
| Spark Resistance | "Do you need spark resistance?" | If lab/paint/hazardous mentioned |
| High Wind | "High wind rated construction?" | If Florida/coast/hurricane mentioned |
| Seismic | "Seismic certification needed?" | If California/Seattle/hospital mentioned |
| CA Title 20 | "Is this a California project?" | If user mentions CA or might be CA |

### NEVER ASK (Use Defaults):
| Field | Default | Reasoning |
|-------|---------|-----------|
| Available Sizes | Optimized | Let CAPS optimize |
| Efficiency Code | false | Handled by CAPS |
| Apply VFD | false | Recommend VariGreen instead |
| Speed Controller | false | Recommend VariGreen |
| Performance Baffle | false | Rarely needed |
| Damper SP Correction | None | Auto-derive from damper |

## Smart Defaults Summary

```javascript
const driveTypeDefaults = {
  driveType: "Direct",          // Changes to "Belt" if CFM > 10,000
  availableSizes: "Optimized",
  sparkResistance: "None",
  highWindRated: false,
  seismicRated: false,
  efficiencyCodeReq: false,
  caTitle20Req: false,
  applyVfd: false,
  speedController: false,
  performanceBaffle: false,
  damperSpCorrection: "None"    // Auto-derived from damper selection
};

// Smart default logic
function getDriveTypeDefault(cfm: number): string {
  if (cfm > 10000) return "Belt";
  return "Direct";
}
```

## Decision Tree for Drive Type

```
CFM Provided?
├── CFM ≤ 8,000 → Direct (G series)
│   └── Variable speed needed? → VG Only (G-VG)
├── CFM 8,000-12,000 → ASK user preference
│   ├── Prefer quiet/low maintenance → Direct (G series)
│   └── Prefer flexibility/future capacity → Belt (GB series)
└── CFM > 12,000 → Belt (GB series)
    └── Variable speed needed? → Belt + VFD
```

## G vs GB Series Selection Guide

| Requirement | G Series | GB Series |
|-------------|----------|-----------|
| CFM < 10,000 | ✅ Preferred | ⚠️ Available |
| CFM > 10,000 | ❌ Limited | ✅ Preferred |
| Low noise priority | ✅ Better | ⚠️ Louder |
| Low maintenance | ✅ Better | ❌ Belt replacement |
| Motor flexibility | ❌ Fixed | ✅ Many options |
| Variable speed | ✅ VariGreen | ✅ VFD |
| High SP (>2") | ⚠️ Limited | ✅ Better |
| Spark resistance | ✅ Available | ✅ Available |
