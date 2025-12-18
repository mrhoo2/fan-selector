# Greenheck Exhaust Fan Selection Quick Reference

## Quick Decision Matrix

### Series Selection
| CFM | Preferred Series | Drive Type |
|-----|------------------|------------|
| < 8,000 | G | Direct |
| 8,000-12,000 | G or GB | Ask user |
| > 12,000 | GB | Belt |
| Variable speed needed | G-VG | VariGreen |

### Required vs Optional Questions

#### ALWAYS ASK (Required Performance)
```
1. "What CFM (airflow) do you need?"
2. "What static pressure (SP) in inches water gauge?"
```

#### SOMETIMES ASK (Context Triggers)
| Trigger Words | Question to Ask |
|---------------|-----------------|
| "lab", "laboratory", "fume" | "Do you need spark resistance?" |
| "California", "CA" | "Is this a California project? (affects seismic/Title 20)" |
| "Florida", "coast", "hurricane" | "Is this a coastal/hurricane zone?" |
| "Denver", "mountain", "altitude" | "What is the project elevation?" |
| "kitchen", "grease" | "Commercial kitchen exhaust?" (auto: no birdscreen) |
| "pool", "natatorium" | Confirm for coatings |
| No damper mentioned | "Do you need a backdraft damper?" |

#### NEVER ASK (Use Defaults)
- Voltage → 460V (208V if small, 575V if Canada)
- Phase → 3 (1 if residential/small)
- Frequency → 60 Hz
- Motor enclosure → TEFC
- Birdscreen → Galvanized
- Fasteners → Standard
- Warranty → 1 Year
- Most electrical accessories → false

## Smart Defaults Summary

```javascript
const SMART_DEFAULTS = {
  // Performance
  elevation: 0,
  temperature: 70,
  
  // Sizing
  driveType: "Direct",      // Belt if CFM > 10,000
  availableSizes: "Optimized",
  sparkResistance: "None",
  highWindRated: false,
  seismicRated: false,
  caTitle20Req: false,
  applyVfd: false,
  damperSpCorrection: "None",
  
  // Electrical
  voltage: 460,
  phase: 3,
  frequency: 60,
  motorDesign: "NEMA",
  enclosure: "TEFC",
  ulListed: "705",
  efficiencyRating: "High",
  variGreenControl: "None",
  disconnectSwitch: false,
  motorMfgLocation: "No Preference",
  
  // Accessories
  damper: false,           // ASK user
  damperActuator: "Gravity",
  damperMounting: "Factory",
  coatings: false,
  birdscreenMaterial: "Galvanized",
  fasteners: "Standard",
  unitWarranty: "1 Yr",
  roofCurbs: false,
  tieDownPoints: false
};
```

## Application-Based Overrides

### Kitchen Exhaust
```javascript
{
  temperature: 100,
  birdscreenMaterial: "None",
  hingedCurbCap: "Standard Hinged"
}
```

### Laboratory
```javascript
{
  sparkResistance: "TypeB"
}
```

### California Project
```javascript
{
  seismicRated: true,
  caTitle20Req: true
}
```

### Coastal/Hurricane Zone
```javascript
{
  highWindRated: true,
  coatings: true,
  birdscreenMaterial: "Stainless",
  fasteners: "Stainless",
  tieDownPoints: true
}
```

### Pool/Natatorium
```javascript
{
  coatings: true,
  birdscreenMaterial: "Stainless",
  fasteners: "Stainless"
}
```

### Canadian Project
```javascript
{
  voltage: 575
}
```

### Government Project
```javascript
{
  motorMfgLocation: "USA",
  efficiencyRating: "Premium"
}
```

### High Altitude (Denver, etc.)
```javascript
{
  elevation: 5280  // Look up actual elevation
}
```

## Output JSON Template

Always include this complete JSON block when making recommendations:

```json:caps
{
  "mark": "EF-1",
  "quantity": 1,
  
  "performance": {
    "cfm": 5000,
    "staticPressure": 1.5,
    "elevation": 0,
    "temperature": 70
  },
  
  "sizing": {
    "availableSizes": "Optimized",
    "sparkResistance": "None",
    "highWindRated": false,
    "seismicRated": false,
    "efficiencyCodeReq": false,
    "caTitle20Req": false,
    "driveType": "Direct",
    "applyVfd": false,
    "speedController": false,
    "performanceBaffle": false,
    "damperSpCorrection": "None"
  },
  
  "electrical": {
    "voltage": 460,
    "phase": 3,
    "frequency": 60,
    "motorHp": "",
    "motorDesign": "NEMA",
    "enclosure": "TEFC",
    "ulListed": "705",
    "efficiencyRating": "High",
    "variGreenControl": "None",
    "transformerHoa": "None",
    "includeBalanceDial": false,
    "disconnectSwitch": false,
    "motorStarter": false,
    "wiringPigtail": false,
    "disconnectRating": "NEMA-1",
    "disconnectProtection": "None",
    "disconnectType": "Toggle",
    "motorMfgLocation": "No Preference",
    "specialMotor": false
  },
  
  "configuration": {
    "coatings": false,
    "hoodHasps": false,
    "conduitChaseQty": 1,
    "birdscreenMaterial": "Galvanized",
    "fasteners": "Standard",
    "damper": true,
    "damperActuator": "Gravity",
    "damperMounting": "Factory",
    "damperBladeAction": "Parallel",
    "unitWarranty": "1 Yr",
    "specialNameplate": false,
    "roofCurbs": false,
    "curbExtension": false,
    "curbCapAdapter": false,
    "hingedCurbCap": "None",
    "curbSeal": false,
    "tieDownPoints": false
  },
  
  "selection": {
    "series": "G",
    "size": "163",
    "model": "G-163-VG"
  }
}
```

## G Series Size Reference
| Size | Typical CFM Range |
|------|-------------------|
| 060 | 100-500 |
| 070 | 200-700 |
| 082 | 300-900 |
| 098 | 400-1,200 |
| 103 | 500-1,500 |
| 120 | 700-2,000 |
| 123 | 800-2,500 |
| 133 | 1,000-3,000 |
| 140 | 1,200-4,000 |
| 143 | 1,500-4,500 |
| 163 | 2,000-6,000 |
| 183 | 3,000-8,000 |
| 200 | 4,000-10,000 |
| 203 | 5,000-12,000 |

## GB Series Size Reference
| Size | Typical CFM Range |
|------|-------------------|
| 80 | 500-2,000 |
| 100 | 1,000-3,500 |
| 120 | 1,500-5,000 |
| 140 | 2,000-7,000 |
| 160 | 3,000-10,000 |
| 180 | 4,000-13,000 |
| 200 | 5,000-16,000 |
| 220 | 6,000-20,000 |
| 240 | 8,000-25,000 |
| 270 | 10,000-30,000 |
| 300 | 12,000-40,000 |
| 330 | 15,000-50,000 |
| 360 | 20,000-60,000+ |

## Response Checklist

When generating a fan recommendation:

- [ ] CFM confirmed
- [ ] Static Pressure confirmed
- [ ] Drive type determined (based on CFM)
- [ ] Series selected (G, GB, or G-VG)
- [ ] Special requirements checked (spark, seismic, high wind)
- [ ] Electrical defaults applied (460V/3ph/60Hz unless special)
- [ ] Damper question addressed
- [ ] Complete JSON block included
- [ ] Explanation provided

## Example Conversations

### Simple Case
```
User: I need a 3000 CFM fan at 1 inch SP
AI: [Apply defaults, recommend G series, include JSON]
```

### Lab Application
```
User: I need an exhaust fan for a chemistry lab
AI: What CFM and SP do you need?
User: 2000 CFM, 1.5 inches
AI: For a lab, do you need spark resistance? Type B is typical.
User: Yes
AI: [Apply lab defaults + TypeB spark, include JSON]
```

### California Hospital
```
User: Hospital project in Los Angeles, 5000 CFM
AI: Got it - California hospital. What static pressure?
User: 1 inch
AI: [Auto-enable seismic + CA Title 20, recommend VG for BMS, include JSON]
```
