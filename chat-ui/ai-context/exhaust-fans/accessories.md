# Accessories Section

## Overview
The accessories section covers dampers, coatings, birdscreens, mounting options, and other factory-installed accessories. Most accessories have sensible defaults and don't require user input unless specifically mentioned.

## Fields in this Section

### Damper (damper) - OPTIONAL - ASK IF RELEVANT
Include a backdraft or control damper with the fan.

**Type:** Boolean
**Default:** false

**Selection Logic:**
- **Backdraft Damper**: Prevents reverse airflow when fan is off
  - Gravity-operated (closes when fan stops)
  - Common for roof exhaust applications
- **Motorized Damper**: Active control damper
  - Opens/closes with actuator
  - For control applications

**When to Include Damper:**
| Application | Damper Recommended |
|-------------|-------------------|
| Roof exhaust (general) | Yes - backdraft |
| Wall exhaust | Yes - backdraft |
| Constant volume system | Yes - backdraft |
| VAV system | Yes - motorized |
| No reverse flow risk | No |
| Existing duct damper | No |

**AI Generation Strategy:**
- **DEFAULT**: false (let user specify)
- **ASK** if user doesn't mention: "Do you need a backdraft damper?"
- Use true if:
  - User mentions "damper", "backdraft", "prevent backflow"
  - Roof exhaust application (typically needs damper)
- NEVER add motorized unless user specifically requests

### Damper Actuator (damperActuator) - CONDITIONAL - AUTO-GENERATE
Type of damper actuator when damper is included.

**Available Options:**
- Gravity ← **Default for backdraft**
- Motorized
- Spring Return

**Selection Logic:**
- Only applies if damper = true
- **Gravity**: Blades open with airflow, close by weight
  - No power required
  - Simplest, most reliable
- **Motorized**: Electric actuator
  - For control applications
  - Requires power and control signal
- **Spring Return**: Motorized with fail-safe
  - Fails to specified position on power loss

**AI Generation Strategy:**
- **DEFAULT**: Gravity (when damper = true)
- Use Motorized if:
  - User mentions "motorized damper"
  - VAV or control application
  - BMS integration for damper control
- Use Spring Return if:
  - User mentions "fail-safe" or "spring return"
- NEVER ask - infer from context

### Damper Mounting (damperMounting) - CONDITIONAL - AUTO-GENERATE
How the damper is mounted to the fan.

**Available Options:**
- Factory ← **Default**
- Loose (ship separately)

**Selection Logic:**
- Only applies if damper = true
- **Factory**: Damper installed on fan at factory
  - Simplifies installation
  - Ensures proper fit
- **Loose**: Damper ships separately
  - For field installation
  - When different mounting needed

**AI Generation Strategy:**
- **DEFAULT**: Factory (always prefer factory-mounted)
- Use Loose only if user specifically requests
- NEVER ask

### Damper Blade Action (damperBladeAction) - CONDITIONAL - AUTO-GENERATE
Damper blade movement pattern.

**Available Options:**
- Parallel ← **Default**
- Opposed

**Selection Logic:**
- Only applies if damper = true
- **Parallel**: All blades rotate same direction
  - Standard for backdraft dampers
  - Better for on/off control
- **Opposed**: Adjacent blades rotate opposite
  - Better for modulating control
  - More uniform airflow

**AI Generation Strategy:**
- **DEFAULT**: Parallel
- Use Opposed only if user specifically requests for modulating control
- NEVER ask

### Coatings (coatings) - OPTIONAL - AUTO-GENERATE
Protective coating for corrosive environments.

**Type:** Boolean or String
**Default:** false

**Available Options (when true):**
- Heresite (standard protective coating)
- Phenolic (chemical resistant)
- Epoxy (general purpose)
- Custom (specify)

**Selection Logic:**
- **No coating**: Standard galvanized steel, adequate for most environments
- **Coating needed**:
  - Coastal/salt air environments
  - Chemical exhaust
  - High humidity
  - Corrosive atmospheres

**Application Guidelines:**
| Environment | Coating Recommended |
|-------------|-------------------|
| General exhaust | None |
| Coastal/salt air | Heresite or stainless |
| Chemical fumes | Phenolic or stainless |
| Pool/natatorium | Heresite or phenolic |
| Food processing | Epoxy or stainless |

**AI Generation Strategy:**
- **DEFAULT**: false
- Use true (Heresite) if:
  - User mentions "coastal", "salt air", "marine"
  - User mentions "pool", "natatorium"
  - User mentions "corrosive"
- **MAYBE ASK** if user mentions potentially corrosive environment
- NEVER ask for standard applications

### Hood Hasps (hoodHasps) - OPTIONAL - AUTO-GENERATE
Security hasps on hood to prevent unauthorized access.

**Type:** Boolean
**Default:** false

**Selection Logic:**
- Prevents hood removal without proper tools
- For security-sensitive applications
- Schools, prisons, mental health facilities

**AI Generation Strategy:**
- **DEFAULT**: false
- Use true if user mentions "security", "tamper-proof", "school", "prison"
- NEVER ask

### Conduit Chase Quantity (conduitChaseQty) - OPTIONAL - AUTO-GENERATE
Number of conduit chases (knockout openings for wiring).

**Type:** Number
**Default:** 1

**Selection Logic:**
- Standard: 1 chase for power wiring
- Multiple: Additional for controls, sensors
- Depends on control complexity

**AI Generation Strategy:**
- **DEFAULT**: 1
- Use 2 if motorized damper + separate control
- NEVER ask - 1 is adequate for most applications

### Birdscreen Material (birdscreenMaterial) - OPTIONAL - AUTO-GENERATE
Material for bird/debris screen on intake/discharge.

**Available Options:**
- Galvanized ← **Default**
- Aluminum
- Stainless
- None

**Selection Logic:**
- **Galvanized**: Standard, most economical
  - Adequate for most environments
- **Aluminum**: Lightweight, corrosion resistant
  - Coastal environments
- **Stainless**: Most durable, corrosion resistant
  - Harsh environments
  - Food processing
- **None**: No screen
  - Kitchen grease exhaust (code requirement)
  - Some high-CFM applications

**AI Generation Strategy:**
- **DEFAULT**: Galvanized
- Use Stainless if:
  - Coastal/marine environment
  - Chemical/corrosive environment
  - Food processing
- Use None if:
  - Kitchen exhaust (grease)
  - User explicitly requests no screen
- NEVER ask unless coastal/chemical mentioned

### Fasteners (fasteners) - OPTIONAL - AUTO-GENERATE
Type of fasteners used in construction.

**Available Options:**
- Standard ← **Default**
- Stainless (corrosion resistant)

**Selection Logic:**
- **Standard**: Zinc-plated, adequate for most environments
- **Stainless**: For corrosive environments
  - Pairs with stainless birdscreen
  - Coastal/marine
  - Chemical environments

**AI Generation Strategy:**
- **DEFAULT**: Standard
- Use Stainless if:
  - Coating selected
  - Stainless birdscreen selected
  - Coastal/corrosive environment
- NEVER ask

### Unit Warranty (unitWarranty) - OPTIONAL - AUTO-GENERATE
Extended warranty period.

**Available Options:**
- 1 Yr ← **Default**
- 3 Yr
- 5 Yr

**Selection Logic:**
- Standard warranty is 1 year
- Extended warranties add cost
- Consider for critical applications

**AI Generation Strategy:**
- **DEFAULT**: 1 Yr
- Use 3 Yr or 5 Yr only if user specifically requests
- NEVER ask unless user mentions warranty concern

### Special Nameplate (specialNameplate) - OPTIONAL - AUTO-GENERATE
Custom or special nameplate requirements.

**Type:** Boolean
**Default:** false

**AI Generation Strategy:**
- **DEFAULT**: false
- Use true only if user specifically requests
- NEVER ask

## Mounting Options

### Roof Curbs (roofCurbs) - OPTIONAL - ASK IF RELEVANT
Include factory roof curb with fan.

**Type:** Boolean
**Default:** false

**Selection Logic:**
- **With curb**: Complete installation package
  - Simplifies ordering
  - Ensures proper fit
  - May cost more than field-built
- **Without curb**: Curb by others
  - Existing curb on roof
  - Contractor-built curb

**AI Generation Strategy:**
- **DEFAULT**: false
- **MAYBE ASK**: "Do you need a factory roof curb, or is there an existing curb?"
- Use true if user requests factory curb
- NEVER assume - curbs often exist or built by others

### Curb Extension (curbExtension) - CONDITIONAL - AUTO-GENERATE
Extended height curb for snow/water protection.

**Type:** Boolean
**Default:** false

**Selection Logic:**
- Only applies if roofCurbs = true
- Extended curb for:
  - Heavy snow areas
  - Flat roofs with ponding
  - Extra clearance needed

**AI Generation Strategy:**
- **DEFAULT**: false
- Use true if user mentions snow or needs extra height
- NEVER ask

### Curb Cap Adapter (curbCapAdapter) - CONDITIONAL - AUTO-GENERATE
Adapter for mounting on existing curb.

**Type:** Boolean
**Default:** false

**Selection Logic:**
- For mounting new fan on existing curb
- Adapts different curb sizes/styles

**AI Generation Strategy:**
- **DEFAULT**: false
- Use true if user mentions retrofitting existing curb
- NEVER ask

### Hinged Curb Cap (hingedCurbCap) - OPTIONAL - AUTO-GENERATE
Hinged access to fan for service.

**Available Options:**
- None ← **Default**
- Standard Hinged
- Weather-sealed Hinged

**Selection Logic:**
- Allows opening hood for motor/belt access
- Simplifies maintenance
- Additional cost

**AI Generation Strategy:**
- **DEFAULT**: None
- Use Standard Hinged if user mentions "service access" or "hinged"
- NEVER ask

### Curb Seal (curbSeal) - CONDITIONAL - AUTO-GENERATE
Sealing material between fan and curb.

**Type:** Boolean
**Default:** false

**Selection Logic:**
- Only applies if roofCurbs = true
- Prevents air/water infiltration
- Standard for quality installations

**AI Generation Strategy:**
- **DEFAULT**: false (or true if curb included)
- NEVER ask

### Tie Down Points (tieDownPoints) - OPTIONAL - AUTO-GENERATE
Hurricane/seismic tie-down attachment points.

**Type:** Boolean
**Default:** false

**Selection Logic:**
- Required for high wind/seismic zones
- Code requirement in some areas
- Usually pairs with highWindRated or seismicRated

**AI Generation Strategy:**
- **DEFAULT**: false
- Use true if:
  - highWindRated = true
  - seismicRated = true
  - User mentions "hurricane straps" or "tie downs"
- NEVER ask - auto-enable with wind/seismic rating

## Dependencies

### Affected By:
- **Drive Type**: Some accessories only for certain drive types
- **Environment**: Coastal/chemical affects material choices
- **Application**: Kitchen exhaust has specific requirements

### Affects:
- **Price**: Accessories add cost
- **Lead Time**: Custom accessories may extend delivery
- **Installation**: Factory-installed simplifies field work

## Common Scenarios

### Scenario 1: Standard Roof Exhaust
```json
{
  "damper": true,
  "damperActuator": "Gravity",
  "damperMounting": "Factory",
  "damperBladeAction": "Parallel",
  "coatings": false,
  "hoodHasps": false,
  "conduitChaseQty": 1,
  "birdscreenMaterial": "Galvanized",
  "fasteners": "Standard",
  "unitWarranty": "1 Yr",
  "roofCurbs": false,
  "tieDownPoints": false
}
```
**Reasoning:** Standard exhaust with backdraft damper. Galvanized birdscreen standard. No special environment.

### Scenario 2: Coastal Application
```json
{
  "damper": true,
  "damperActuator": "Gravity",
  "damperMounting": "Factory",
  "damperBladeAction": "Parallel",
  "coatings": true,
  "hoodHasps": false,
  "conduitChaseQty": 1,
  "birdscreenMaterial": "Stainless",
  "fasteners": "Stainless",
  "unitWarranty": "1 Yr",
  "roofCurbs": false,
  "tieDownPoints": true
}
```
**Reasoning:** Coastal location needs corrosion protection (coating, stainless components). Tie-downs for wind.

### Scenario 3: Kitchen Exhaust
```json
{
  "damper": true,
  "damperActuator": "Gravity",
  "damperMounting": "Factory",
  "damperBladeAction": "Parallel",
  "coatings": false,
  "hoodHasps": false,
  "conduitChaseQty": 1,
  "birdscreenMaterial": "None",
  "fasteners": "Standard",
  "unitWarranty": "1 Yr",
  "roofCurbs": false,
  "hingedCurbCap": "Standard Hinged"
}
```
**Reasoning:** Kitchen exhaust requires no birdscreen (grease buildup). Hinged access for cleaning.

### Scenario 4: School with Security
```json
{
  "damper": true,
  "damperActuator": "Gravity",
  "damperMounting": "Factory",
  "damperBladeAction": "Parallel",
  "coatings": false,
  "hoodHasps": true,
  "conduitChaseQty": 1,
  "birdscreenMaterial": "Galvanized",
  "fasteners": "Standard",
  "unitWarranty": "1 Yr",
  "roofCurbs": true,
  "curbSeal": true
}
```
**Reasoning:** School needs hood hasps for security. Factory curb with seal for complete package.

### Scenario 5: Pool/Natatorium
```json
{
  "damper": true,
  "damperActuator": "Gravity",
  "damperMounting": "Factory",
  "damperBladeAction": "Parallel",
  "coatings": true,
  "hoodHasps": false,
  "conduitChaseQty": 1,
  "birdscreenMaterial": "Stainless",
  "fasteners": "Stainless",
  "unitWarranty": "3 Yr",
  "roofCurbs": false
}
```
**Reasoning:** Pool chlorine is corrosive - need coating and stainless components. Extended warranty for harsh environment.

### Scenario 6: BMS-Controlled VAV System
```json
{
  "damper": true,
  "damperActuator": "Motorized",
  "damperMounting": "Factory",
  "damperBladeAction": "Opposed",
  "coatings": false,
  "hoodHasps": false,
  "conduitChaseQty": 2,
  "birdscreenMaterial": "Galvanized",
  "fasteners": "Standard",
  "unitWarranty": "1 Yr",
  "roofCurbs": false
}
```
**Reasoning:** VAV needs motorized damper with opposed blades for modulating control. Extra conduit for damper control wiring.

## Human Input Required?

### SOMETIMES ASK:
| Field | Question | When to Ask |
|-------|----------|-------------|
| Damper | "Do you need a backdraft damper?" | If not mentioned and roof exhaust |
| Roof Curbs | "Do you need a factory curb?" | If new installation |
| Coatings | "Is this a corrosive environment?" | If coastal/chemical/pool mentioned |

### NEVER ASK (Use Defaults):
| Field | Default | Reasoning |
|-------|---------|-----------|
| Damper Actuator | Gravity | When damper needed |
| Damper Mounting | Factory | Always preferred |
| Damper Blade Action | Parallel | Standard |
| Hood Hasps | false | Rarely needed |
| Conduit Chase | 1 | Standard |
| Birdscreen | Galvanized | Most economical |
| Fasteners | Standard | Match birdscreen |
| Warranty | 1 Yr | Standard |
| Special Nameplate | false | Rarely needed |
| Curb accessories | false | Based on curb selection |

## Smart Defaults Summary

```javascript
const accessoriesDefaults = {
  damper: false,              // ASK for roof exhaust
  damperActuator: "Gravity",  // When damper = true
  damperMounting: "Factory",
  damperBladeAction: "Parallel",
  coatings: false,
  hoodHasps: false,
  conduitChaseQty: 1,
  birdscreenMaterial: "Galvanized",  // Stainless for coastal
  fasteners: "Standard",             // Stainless if birdscreen is
  unitWarranty: "1 Yr",
  specialNameplate: false,
  roofCurbs: false,           // ASK if new installation
  curbExtension: false,
  curbCapAdapter: false,
  hingedCurbCap: "None",
  curbSeal: false,
  tieDownPoints: false        // Auto-enable with wind/seismic
};

// Smart defaults based on environment
function getAccessoryDefaults(environment: string) {
  if (environment === "coastal" || environment === "pool") {
    return {
      coatings: true,
      birdscreenMaterial: "Stainless",
      fasteners: "Stainless"
    };
  }
  if (environment === "kitchen") {
    return {
      birdscreenMaterial: "None",
      hingedCurbCap: "Standard Hinged"
    };
  }
  return accessoriesDefaults;
}
```
