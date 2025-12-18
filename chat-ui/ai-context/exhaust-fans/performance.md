# Performance Section

## Overview
The performance section defines the core air moving requirements for the exhaust fan including airflow volume, static pressure, and operating conditions. These are the most critical inputs that determine fan selection.

## Fields in this Section

### CFM (cfm) - REQUIRED - ASK HUMAN
The volume of air the fan needs to exhaust, measured in Cubic Feet per Minute.

**Type:** Numeric field
**Range:** 100 - 100,000+ CFM (varies by model)

**Selection Logic:**
- CFM is calculated based on room volume and air changes per hour (ACH)
- Formula: CFM = (Room Volume × ACH) / 60
- Different applications have different ACH requirements:
  - General exhaust: 6-10 ACH
  - Restrooms: 10-15 ACH
  - Kitchens: 15-30 ACH
  - Labs/Hazardous: 10-20 ACH
  - Parking garages: 6-8 ACH

**CFM Ranges by Series:**
| Series | Typical CFM Range | Best For |
|--------|------------------|----------|
| G (Direct) | 500 - 10,000 | Lower CFM, quieter |
| GB (Belt) | 1,000 - 50,000+ | Higher CFM, flexibility |

**AI Generation Strategy:**
- **MUST ASK HUMAN** if not provided: "What CFM (airflow) do you need?"
- If user provides room dimensions + ACH, calculate CFM
- If user mentions application but not CFM, suggest typical range:
  - "For a restroom, typical CFM is 100-500. What size is your restroom?"
- **NEVER GUESS** - CFM is critical to proper selection

### Static Pressure (staticPressure) - REQUIRED - ASK HUMAN
External Static Pressure - the resistance the fan must overcome from ductwork, filters, and system components.

**Type:** Numeric field
**Units:** inches of water gauge (in. wg)
**Range:** 0.0 to 4.0+ in. wg (varies by model)

**Selection Logic:**
- SP depends on duct length, fittings, filters, dampers
- Higher SP = more powerful fan needed
- System SP must be within fan's rated capacity

**Typical Values:**
| Application | Typical SP Range |
|-------------|-----------------|
| No duct (wall/roof exhaust) | 0.0 - 0.25 in. wg |
| Short duct run (<50 ft) | 0.25 - 0.5 in. wg |
| Medium duct run (50-100 ft) | 0.5 - 1.0 in. wg |
| Long/complex ductwork | 1.0 - 2.0 in. wg |
| High resistance systems | 2.0 - 4.0+ in. wg |

**AI Generation Strategy:**
- **MUST ASK HUMAN** if not provided: "What static pressure (SP) do you need?"
- If user unsure, ask about ductwork: "Is this a rooftop exhaust with short ducts or a longer duct system?"
- **FALLBACK DEFAULT**: 0.5 in. wg (if user says "typical" or "standard")
- Consider higher SP if user mentions:
  - Long duct runs
  - Multiple elbows/fittings
  - HEPA or high-efficiency filters
  - Grease filters (kitchen)

### Elevation (elevation) - OPTIONAL - AUTO-GENERATE
Site elevation above sea level in feet. Affects air density and fan performance.

**Type:** Numeric field
**Units:** feet above sea level
**Range:** 0 to 10,000 feet

**Selection Logic:**
- Higher elevation = lower air density = reduced fan capacity
- Capacity derates approximately 3% per 1,000 feet above sea level
- Most projects are at 0-2,000 feet (minimal impact)
- High elevation (>5,000 feet) requires performance adjustment

**Common Elevations:**
| Location | Approximate Elevation |
|----------|----------------------|
| Coastal cities | 0-100 ft |
| Most US cities | 0-1,000 ft |
| Denver, CO | 5,280 ft |
| Salt Lake City, UT | 4,226 ft |
| Albuquerque, NM | 5,312 ft |
| Mexico City | 7,350 ft |

**AI Generation Strategy:**
- **DEFAULT**: 0 feet (sea level) - use for most projects
- **ASK ONLY IF** project location suggests high elevation:
  - User mentions Denver, Salt Lake, Albuquerque, mountain regions
  - User explicitly mentions "high altitude" or "elevation"
- If location provided, estimate from table above
- DO NOT ask for every project

### Temperature (temperature) - OPTIONAL - AUTO-GENERATE
Airstream temperature of the exhaust air in degrees Fahrenheit.

**Type:** Numeric field
**Units:** °F
**Range:** -40 to 250°F (varies by construction)

**Selection Logic:**
- Standard fans rated for 0-104°F (40°C)
- Higher temperatures require special construction
- Temperature affects air density and motor selection
- Some applications have specific temperature requirements

**Typical Values:**
| Application | Typical Temperature |
|-------------|---------------------|
| General exhaust | 70°F (ambient) |
| Restrooms | 70-75°F |
| Kitchen (grease) | 100-150°F |
| Laundry | 80-120°F |
| Industrial process | 100-200°F |
| Paint booths | 70-100°F |

**AI Generation Strategy:**
- **DEFAULT**: 70°F - standard ambient temperature
- **ASK ONLY IF** user mentions:
  - Kitchen/grease exhaust → suggest 100-150°F
  - Laundry → suggest 100°F
  - Industrial/process exhaust → ask specific temperature
  - "Hot air" or "high temperature" → ask for specific value
- DO NOT ask for general exhaust applications

## Dependencies

### Affects Other Sections:
- **Drive Type**: High CFM (>10,000) typically requires belt drive (GB)
- **Series Selection**: CFM + SP determine whether G or GB is appropriate
- **Motor HP**: Higher CFM/SP requires more motor power
- **Size Selection**: Performance requirements determine physical size

### Affected By:
- **Application Type**: Kitchen, lab, general exhaust have different requirements
- **Ductwork Design**: Determines SP requirements
- **Building Location**: Affects elevation

## Common Scenarios

### Scenario 1: Office Restroom Exhaust
```json
{
  "cfm": 350,
  "staticPressure": 0.25,
  "elevation": 0,
  "temperature": 70
}
```
**Reasoning:** Small restroom with short duct to roof. Low CFM and SP. Standard conditions.
**Likely Selection:** G-082 or G-098

### Scenario 2: Commercial Kitchen Hood Exhaust
```json
{
  "cfm": 3500,
  "staticPressure": 1.5,
  "elevation": 0,
  "temperature": 100
}
```
**Reasoning:** Kitchen hood requires moderate CFM with higher SP due to grease filters. Elevated temperature from cooking.
**Likely Selection:** G-163 or GB-140

### Scenario 3: Parking Garage Exhaust
```json
{
  "cfm": 15000,
  "staticPressure": 0.75,
  "elevation": 0,
  "temperature": 70
}
```
**Reasoning:** Large garage needs high CFM for code compliance. Moderate SP with typical ductwork.
**Likely Selection:** GB-240 or GB-270

### Scenario 4: Lab Fume Hood Exhaust
```json
{
  "cfm": 2000,
  "staticPressure": 2.0,
  "elevation": 0,
  "temperature": 70
}
```
**Reasoning:** Lab exhaust with high SP due to scrubbers and filtration. Will also need spark resistance.
**Likely Selection:** G-143 or GB-120 (with Type B spark)

### Scenario 5: High Altitude Project (Denver)
```json
{
  "cfm": 5000,
  "staticPressure": 1.0,
  "elevation": 5280,
  "temperature": 70
}
```
**Reasoning:** Denver project requires elevation correction for accurate fan selection.
**Likely Selection:** G-163 or GB-160 (sized for altitude)

## Human Input Required?

### MUST ASK (Required):
| Field | Question | When to Ask |
|-------|----------|-------------|
| CFM | "What CFM (airflow) do you need?" | ALWAYS if not provided |
| Static Pressure | "What static pressure do you need?" | ALWAYS if not provided |

### SOMETIMES ASK (Contextual):
| Field | Question | When to Ask |
|-------|----------|-------------|
| Elevation | "What is the project elevation?" | Only if Denver/mountain region mentioned |
| Temperature | "What is the exhaust air temperature?" | Only if kitchen/industrial mentioned |

### NEVER ASK (Use Defaults):
| Field | Default | Reasoning |
|-------|---------|-----------|
| Elevation | 0 ft | Most projects sea level |
| Temperature | 70°F | Standard ambient |

## Smart Defaults Summary

```javascript
const performanceDefaults = {
  elevation: 0,        // Sea level
  temperature: 70,     // Standard ambient
  // CFM: NO DEFAULT - must ask
  // staticPressure: NO DEFAULT - must ask (or use 0.5 if "typical")
};
```

## Tips for Conversation

**Good conversation flow:**
1. User: "I need an exhaust fan for a restroom"
2. AI: "I can help with that! What CFM do you need? For restrooms, typical range is 100-500 CFM depending on size."
3. User: "350 CFM"
4. AI: "Great, and what's the static pressure requirement? For a rooftop unit with short ductwork, 0.25-0.5 in. wg is typical."
5. User: "Let's say 0.25"
6. AI: [Proceeds to recommend fan with full JSON output]

**Avoid:**
- Asking about elevation unless high-altitude location mentioned
- Asking about temperature for general exhaust
- Guessing CFM - always confirm with user
