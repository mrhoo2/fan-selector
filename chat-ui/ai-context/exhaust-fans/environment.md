# Environment & Application Section

## Overview
The environment section covers application-specific context that affects fan selection including building type, geographic location, special requirements, and environmental conditions. This section helps the AI understand the broader context to make better default selections.

## Application Context (Not Direct CAPS Fields)

### Application Type - CONTEXT - ASK IF UNCLEAR
The type of space being exhausted.

**Common Applications:**
| Application | Typical CFM | Typical SP | Special Considerations |
|-------------|-------------|------------|----------------------|
| Office/General | 100-2,000 | 0.25-0.5 | Standard |
| Restroom | 100-500 | 0.25-0.5 | Standard |
| Break Room | 200-500 | 0.25-0.5 | May need grease hood |
| Kitchen (Commercial) | 1,000-10,000 | 1.0-2.0 | No birdscreen, hinged |
| Laboratory | 500-5,000 | 1.0-3.0 | Spark resistance |
| Parking Garage | 5,000-50,000+ | 0.5-1.5 | High CFM |
| Warehouse | 2,000-20,000 | 0.5-1.0 | Large space |
| Pool/Natatorium | 1,000-10,000 | 0.5-1.0 | Corrosion protection |
| Hospital | 500-5,000 | 0.5-1.5 | Seismic, redundancy |
| Data Center | 1,000-20,000 | 0.5-1.5 | High reliability |
| Paint Booth | 1,000-10,000 | 1.0-2.0 | Spark Type A |
| Industrial | 2,000-50,000+ | 0.5-2.0 | Varies by process |

**AI Generation Strategy:**
- **ASK** if not clear: "What type of space is this for? (e.g., office, kitchen, lab)"
- Use application to inform defaults for:
  - Spark resistance
  - Coatings
  - Birdscreen
  - Drive type

### Geographic Location - CONTEXT - ASK IF RELEVANT
Project location affects several selection parameters.

**Location Impact Map:**
| Region | Elevation | Seismic | High Wind | Voltage | Special |
|--------|-----------|---------|-----------|---------|---------|
| California | Varies | Yes | Some coast | 460V | CA Title 20 |
| Florida | Low | No | Yes (coast) | 460V | Hurricane |
| Texas Coast | Low | No | Yes | 460V | Hurricane |
| Pacific NW | Low-High | Some | No | 460V | Seattle seismic |
| Mountain West | High | Some | No | 460V | Elevation correction |
| Canada | Varies | Some | No | 575V | 50/60 Hz |
| Midwest | Low | Low | Low | 460V | Standard |
| Northeast | Low | Low | Some | 460V | Standard |

**AI Generation Strategy:**
- **ASK** if seismic/wind triggers: "What city/state is this project in?"
- Use location to auto-set:
  - Elevation (Denver = 5,280 ft)
  - Seismic rating (California = true)
  - High wind rating (Florida coast = true)
  - CA Title 20 (California = true)
  - Voltage (Canada = 575V)

### Building Type - CONTEXT - AUTO-GENERATE
The type of building affects code requirements.

**Building Type Implications:**
| Building Type | Typical Requirements |
|---------------|---------------------|
| Office | Standard |
| Retail | Standard |
| Restaurant | Kitchen exhaust code |
| School | Hood hasps, security |
| Hospital | Seismic, reliability |
| Laboratory | Spark resistance |
| Manufacturing | Varies by process |
| Government | USA motors |
| Data Center | High reliability |

**AI Generation Strategy:**
- Infer from application type
- Use to inform:
  - Motor manufacturing location
  - Extended warranties
  - Security features

## Environmental Factors

### Corrosive Environment - CONTEXT - ASK IF RELEVANT
Presence of corrosive chemicals or conditions.

**Corrosion Sources:**
| Source | Protection Needed |
|--------|-------------------|
| Salt air (coastal) | Coating, SS components |
| Pool chemicals | Coating, SS components |
| Laboratory chemicals | Chemical-resistant coating |
| Food processing | FDA-compliant coating |
| High humidity | Coating recommended |
| Industrial fumes | Depends on chemistry |

**AI Generation Strategy:**
- **ASK** if user mentions potentially corrosive environment
- Auto-enable coatings and stainless if confirmed
- Questions to ask:
  - "Is this in a coastal location?"
  - "Are there corrosive chemicals in the air?"

### Hazardous Location - CONTEXT - ASK IF RELEVANT
Presence of flammable or explosive materials.

**Hazard Classifications:**
| NEC Class | Description | Fan Requirements |
|-----------|-------------|-----------------|
| Class I | Flammable gases/vapors | Spark Type A, explosion-proof motor |
| Class II | Combustible dust | Spark Type A or B |
| Class III | Ignitable fibers | Spark Type B or C |
| Non-hazardous | No special | Standard |

**AI Generation Strategy:**
- **ASK** if user mentions hazardous materials
- Questions to ask:
  - "Is this a classified hazardous location?"
  - "What spark resistance classification is required?"
- Enable appropriate spark resistance

### Noise Sensitivity - CONTEXT - AUTO-GENERATE
Noise level considerations for the application.

**Noise-Sensitive Applications:**
| Application | Noise Concern | Recommendation |
|-------------|---------------|----------------|
| Office | High | Direct drive, smaller fans |
| Hospital | High | Direct drive, acoustical |
| Residential | High | Direct drive, low speed |
| Industrial | Low | Belt drive acceptable |
| Parking garage | Low | Any |

**AI Generation Strategy:**
- Infer from application
- If noise-sensitive, prefer:
  - Direct drive over belt
  - Smaller fans running slower
  - VariGreen for speed control

## Combining Context for Smart Defaults

### Complete Context Assessment

When gathering information, build a context object:

```javascript
const applicationContext = {
  // Core performance (MUST have)
  cfm: number,           // User provides
  staticPressure: number, // User provides
  
  // Application context (helps with defaults)
  application: string,   // "kitchen", "lab", "office", etc.
  location: {
    city: string,
    state: string,
    elevation: number,   // Auto-lookup or ask if high-altitude
  },
  
  // Environmental flags (inferred or asked)
  isCoastal: boolean,
  isHazardous: boolean,
  isCorrosive: boolean,
  isNoiseSensitive: boolean,
  
  // Building type context
  buildingType: string,  // "hospital", "school", "office", etc.
  isGovernment: boolean,
};
```

### Smart Default Generation

Based on context, generate optimal defaults:

```javascript
function generateDefaults(context: ApplicationContext) {
  const defaults = {
    // Performance
    elevation: context.location.elevation || 0,
    temperature: getTemperatureDefault(context.application),
    
    // Drive Type
    driveType: getDriveTypeDefault(context.cfm, context.application),
    sparkResistance: context.isHazardous ? "TypeB" : "None",
    highWindRated: context.isCoastal || false,
    seismicRated: isSeismicZone(context.location.state),
    caTitle20Req: context.location.state === "CA",
    
    // Electrical
    voltage: context.location.country === "CA" ? 575 : 460,
    phase: 3,
    frequency: 60,
    motorMfgLocation: context.isGovernment ? "USA" : "No Preference",
    
    // Accessories
    coatings: context.isCoastal || context.isCorrosive,
    birdscreenMaterial: getBirdscreenDefault(context),
    fasteners: context.isCoastal ? "Stainless" : "Standard",
    tieDownPoints: context.isCoastal || isSeismicZone(context.location.state),
  };
  
  return defaults;
}
```

## Common Combined Scenarios

### Scenario 1: California Hospital Lab
**Context:**
- Application: Laboratory
- Location: Los Angeles, CA
- Building: Hospital

**Auto-Generated Defaults:**
```json
{
  "elevation": 300,
  "temperature": 70,
  "driveType": "Direct",
  "sparkResistance": "TypeB",
  "highWindRated": false,
  "seismicRated": true,
  "caTitle20Req": true,
  "voltage": 460,
  "phase": 3,
  "coatings": false,
  "birdscreenMaterial": "Galvanized"
}
```
**Reasoning:** California project needs seismic + Title 20. Lab needs spark resistance. No coastal corrosion.

### Scenario 2: Florida Coastal Restaurant
**Context:**
- Application: Kitchen exhaust
- Location: Miami Beach, FL
- Building: Restaurant

**Auto-Generated Defaults:**
```json
{
  "elevation": 10,
  "temperature": 100,
  "driveType": "Direct",
  "sparkResistance": "None",
  "highWindRated": true,
  "seismicRated": false,
  "caTitle20Req": false,
  "voltage": 460,
  "phase": 3,
  "coatings": true,
  "birdscreenMaterial": "None",
  "fasteners": "Stainless",
  "tieDownPoints": true,
  "hingedCurbCap": "Standard Hinged"
}
```
**Reasoning:** Kitchen exhaust needs no birdscreen, hinged access. Coastal Florida needs high wind, coatings, stainless, tie-downs.

### Scenario 3: Denver Data Center
**Context:**
- Application: Data center exhaust
- Location: Denver, CO
- Building: Data center

**Auto-Generated Defaults:**
```json
{
  "elevation": 5280,
  "temperature": 70,
  "driveType": "VG Only",
  "sparkResistance": "None",
  "highWindRated": false,
  "seismicRated": false,
  "caTitle20Req": false,
  "voltage": 460,
  "phase": 3,
  "efficiencyRating": "Premium",
  "variGreenControl": "Building Automation",
  "unitWarranty": "3 Yr",
  "coatings": false,
  "birdscreenMaterial": "Galvanized"
}
```
**Reasoning:** High elevation needs correction. Data center benefits from VG with BMS, premium efficiency, extended warranty.

### Scenario 4: Canadian Manufacturing
**Context:**
- Application: Industrial exhaust
- Location: Toronto, ON, Canada
- Building: Manufacturing

**Auto-Generated Defaults:**
```json
{
  "elevation": 250,
  "temperature": 70,
  "driveType": "Belt",
  "sparkResistance": "None",
  "highWindRated": false,
  "seismicRated": false,
  "caTitle20Req": false,
  "voltage": 575,
  "phase": 3,
  "frequency": 60,
  "motorDesign": "NEMA",
  "coatings": false,
  "birdscreenMaterial": "Galvanized"
}
```
**Reasoning:** Canadian project uses 575V. Manufacturing likely needs high CFM (belt drive). Standard otherwise.

### Scenario 5: Government Office Building
**Context:**
- Application: General exhaust
- Location: Washington, DC
- Building: Federal government

**Auto-Generated Defaults:**
```json
{
  "elevation": 10,
  "temperature": 70,
  "driveType": "Direct",
  "sparkResistance": "None",
  "highWindRated": false,
  "seismicRated": false,
  "caTitle20Req": false,
  "voltage": 460,
  "phase": 3,
  "efficiencyRating": "Premium",
  "motorMfgLocation": "USA",
  "coatings": false,
  "birdscreenMaterial": "Galvanized"
}
```
**Reasoning:** Government needs USA motors (Buy American). Premium efficiency for LEED/sustainability goals.

## Question Flow for Context Gathering

### Minimal Questions Strategy

**Always Ask (2 questions):**
1. "What CFM do you need?" (if not provided)
2. "What static pressure?" (if not provided)

**Sometimes Ask (only if triggers):**
3. "What type of space?" (if unclear from context)
4. "What location/state?" (if seismic/wind/elevation might apply)
5. "Do you need spark resistance?" (if hazardous mentioned)
6. "Is this a corrosive environment?" (if coastal/chemical mentioned)

**Never Ask (use smart defaults):**
- Voltage (infer from location/motor size)
- Phase (commercial = 3-phase)
- Most accessories (use application-based defaults)
- Minor options (birdscreen material, fasteners, etc.)

### Conversation Example

**Good Flow:**
```
User: "I need an exhaust fan for a lab"
AI: "I can help with that! What CFM do you need?"
User: "2000 CFM"
AI: "And what static pressure?"
User: "1.5 inches"
AI: "Since this is a lab, do you need spark resistance? Type B is common for laboratory applications."
User: "Yes, Type B"
AI: [Generates complete selection with lab-appropriate defaults]
```

**Avoid:**
- Asking about every field
- Asking about electrical unless unusual situation
- Asking about accessories that have clear defaults

## Summary: Context-Driven Defaults

| Context Trigger | Auto-Set Fields |
|-----------------|-----------------|
| California | seismicRated, caTitle20Req |
| Florida coast | highWindRated, coatings, tieDownPoints |
| Canada | voltage: 575 |
| Denver/mountains | elevation: 5000+ |
| Lab | sparkResistance: TypeB |
| Kitchen | birdscreen: None, hingedCurbCap |
| Pool | coatings, stainless components |
| Government | motorMfgLocation: USA |
| Hospital | seismicRated (if West Coast), extended warranty |
| Data center | VariGreen, BMS, premium efficiency |

The goal is to **infer as much as possible** from context clues, asking only essential performance questions (CFM, SP) and confirming only when special requirements apply.
