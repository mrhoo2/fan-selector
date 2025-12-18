# Electrical Section

## Overview
The electrical section defines voltage requirements, motor specifications, and electrical accessories for the exhaust fan. Most fields have sensible defaults based on commercial building standards.

## Fields in this Section

### Voltage (voltage) - REQUIRED - AUTO-GENERATE (ask if uncertain)
Main power supply voltage for the motor.

**Available Options:**
- 115V (single phase only)
- 200V (3-phase)
- 208V (single or 3-phase)
- 230V (single or 3-phase)
- 265V (single phase only)
- 277V (single phase only)
- 380V (3-phase, international)
- 400V (3-phase, international)
- 460V (3-phase) ← **Most Common Commercial**
- 575V (3-phase, Canada)

**Selection Logic:**
- **460V/3-phase**: Most common for commercial buildings in US (>1 HP motors)
- **208V/3-phase**: Common in smaller commercial, some industrial
- **230V/1-phase**: Small fans (<1 HP), residential applications
- **575V/3-phase**: Canadian commercial/industrial
- **380/400V**: International projects

**Voltage by Motor Size:**
| Motor HP | Common Voltages |
|----------|-----------------|
| < 1/2 HP | 115V, 208V, 230V (1-phase) |
| 1/2 - 1 HP | 208V, 230V, 460V (1 or 3-phase) |
| > 1 HP | 208V, 460V, 575V (3-phase) |

**AI Generation Strategy:**
- **DEFAULT**: 460V for commercial (>1 HP expected)
- Use 208V if:
  - User mentions "208 volt" or "208/230"
  - Small project or lighter duty
- Use 575V if:
  - Project in Canada
  - User explicitly mentions "575 volt"
- **MAYBE ASK** if small fan or unclear building: "What voltage is available at the installation location?"

### Phase (phase) - REQUIRED - AUTO-GENERATE
Electrical phase configuration.

**Available Options:**
- 1 (Single Phase)
- 3 (Three Phase) ← **Most Common Commercial**

**Selection Logic:**
- **3-Phase**: Standard for commercial buildings, >1 HP motors
  - More efficient, smoother operation
  - Required for larger motors (>5 HP)
- **1-Phase**: Residential, small commercial
  - Limited to smaller motors (<3 HP typically)
  - 115V always single phase

**AI Generation Strategy:**
- **DEFAULT**: 3 for commercial applications
- Use 1 if:
  - Voltage is 115V, 265V, or 277V (always single phase)
  - User explicitly requests single phase
  - Very small application (residential, small restroom)
- DO NOT ask unless application seems residential/small

### Frequency (frequency) - OPTIONAL - AUTO-GENERATE
Electrical frequency in Hertz.

**Available Options:**
- 50 Hz (International)
- 60 Hz (North America) ← **Default**

**Selection Logic:**
- **60 Hz**: US, Canada, Mexico, parts of South America
- **50 Hz**: Europe, Asia, Africa, Australia, most of world

**AI Generation Strategy:**
- **DEFAULT**: 60 Hz (US projects assumed)
- Use 50 Hz only if:
  - International project explicitly mentioned
  - User specifies "50 Hz"
- NEVER ask - use geographic context

### Motor HP (motorHp) - OPTIONAL - AUTO-GENERATE
Motor horsepower rating. Selected by CAPS based on performance requirements.

**Common Values:** 1/4, 1/3, 1/2, 3/4, 1, 1.5, 2, 3, 5, 7.5, 10, 15, 20, 25, 30 HP

**Selection Logic:**
- Motor HP is calculated by CAPS software based on CFM and SP
- User typically doesn't specify - CAPS determines optimal motor
- If user specifies, it may limit available selections

**AI Generation Strategy:**
- **DO NOT SPECIFY** unless user explicitly requests
- Let CAPS software determine optimal motor
- If user provides motor HP, include it to constrain selection

### Motor Design (motorDesign) - OPTIONAL - AUTO-GENERATE
Motor design standard.

**Available Options:**
- NEMA (North American) ← **Default**
- IEC (International)

**Selection Logic:**
- **NEMA**: US and North America
- **IEC**: International projects, European motors

**AI Generation Strategy:**
- **DEFAULT**: NEMA
- Use IEC only for international projects
- NEVER ask

### Enclosure (enclosure) - OPTIONAL - AUTO-GENERATE
Motor enclosure type for environmental protection.

**Available Options:**
- TEFC (Totally Enclosed Fan Cooled) ← **Default**
- TENV (Totally Enclosed Non-Ventilated)
- ODP (Open Drip Proof)
- TEAO (Totally Enclosed Air Over)
- IP55 (International Protection rating)

**Selection Logic:**
- **TEFC**: Most common, protects motor from dust/moisture
  - Standard for outdoor/rooftop applications
  - Good for most environments
- **ODP**: Lower cost, only for clean/dry indoor environments
  - NOT recommended for roof exhaust fans
- **TENV**: No external fan, for hazardous locations
- **TEAO**: Air-over motors, airstream provides cooling
- **IP55**: International equivalent to TEFC

**AI Generation Strategy:**
- **DEFAULT**: TEFC (standard for roof exhaust)
- Use ODP only if:
  - Indoor application
  - Clean, dry environment
  - User explicitly requests (cost savings)
- Use IP55 if:
  - International project
  - User specifies IP rating
- NEVER ask - TEFC is always safe choice

### UL Listed (ulListed) - OPTIONAL - AUTO-GENERATE
UL listing standard for safety certification.

**Common Values:**
- "705" (Power Ventilators) ← **Default for exhaust fans**
- "762" (Power Roof/Wall Ventilators)

**AI Generation Strategy:**
- **DEFAULT**: "705"
- DO NOT ask - standard for exhaust fans

### Efficiency Rating (efficiencyRating) - OPTIONAL - AUTO-GENERATE
Motor efficiency classification.

**Available Options:**
- Standard (Baseline)
- High (Energy efficient) ← **Default**
- Premium (Highest efficiency)

**Selection Logic:**
- **High Efficiency**: Best balance of cost and efficiency
  - Meets most energy codes
  - Standard recommendation
- **Premium**: Highest efficiency, higher cost
  - For energy-sensitive projects
  - May be required by code
- **Standard**: Lower cost, lower efficiency
  - Only if budget constrained

**AI Generation Strategy:**
- **DEFAULT**: High
- Use Premium if:
  - User mentions energy efficiency priority
  - LEED or green building certification
  - California project (Title 20)
- Use Standard only if:
  - User explicitly requests (budget)
- NEVER ask unless energy mentioned

### Motor Manufacturing Location (motorMfgLocation) - OPTIONAL - AUTO-GENERATE
Preference for motor manufacturing origin.

**Available Options:**
- No Preference ← **Default**
- USA (US manufactured only)
- North America (US/Canada/Mexico)

**Selection Logic:**
- **No Preference**: Widest selection, best pricing
- **USA**: Required for some government/institutional projects
- **North America**: USMCA compliance

**AI Generation Strategy:**
- **DEFAULT**: No Preference
- Use USA if:
  - Government project
  - User mentions "Buy American" or "domestic"
- NEVER ask unless project type suggests

### Special Motor (specialMotor) - OPTIONAL - AUTO-GENERATE
Flag for special motor requirements.

**Type:** Boolean
**Default:** false

**AI Generation Strategy:**
- **DEFAULT**: false
- Set true only if user mentions special motor requirements
- NEVER ask

## VariGreen Control Fields (G-XXX-VG Models Only)

### VariGreen Control (variGreenControl) - OPTIONAL - AUTO-GENERATE
Control method for VariGreen EC motors.

**Available Options:**
- None ← **Default** (non-VG models)
- Remote Dial (Manual speed control)
- Building Automation (BMS integration)
- 0-10V (Analog voltage control)
- 4-20mA (Analog current control)

**Selection Logic:**
- Only applicable to G-XXX-VG models (VariGreen EC motor)
- **None**: Standard non-VG fan
- **Remote Dial**: Simple manual speed control
- **Building Automation**: BACnet/Modbus integration
- **0-10V / 4-20mA**: Standard analog control signals

**AI Generation Strategy:**
- **DEFAULT**: None (unless VG model selected)
- If user mentions:
  - "BMS" or "building automation" → Building Automation
  - "variable speed" or "speed control" → Remote Dial
  - "0-10 volt" → 0-10V
  - "4-20 milliamp" → 4-20mA
- Ask about control method only if VG model recommended

### Transformer HOA (transformerHoa) - OPTIONAL - AUTO-GENERATE
Transformer and Hand-Off-Auto switch configuration.

**Available Options:**
- None ← **Default**
- Transformer Mounted (On fan)
- Remote (Separate location)

**AI Generation Strategy:**
- **DEFAULT**: None
- Only relevant for VariGreen models
- NEVER ask

### Include Balance Dial (includeBalanceDial) - OPTIONAL - AUTO-GENERATE
Include balance dial for speed adjustment.

**Type:** Boolean
**Default:** false

**AI Generation Strategy:**
- **DEFAULT**: false
- Set true if user mentions "balance" or "field adjustable"
- NEVER ask

## Electrical Accessories

### Disconnect Switch (disconnectSwitch) - OPTIONAL - ASK IF RELEVANT
Factory-installed electrical disconnect.

**Type:** Boolean
**Default:** false

**Selection Logic:**
- **false**: Electrician provides disconnect per code (most common)
- **true**: Factory disconnect included on fan
  - Simplifies installation
  - Ensures code compliance
  - Additional cost

**AI Generation Strategy:**
- **DEFAULT**: false
- **MAYBE ASK** if user mentions:
  - "disconnect" → ask if factory or field-installed
  - "code compliance" → suggest factory disconnect
- Use true if user explicitly requests

### Disconnect Rating (disconnectRating) - CONDITIONAL - AUTO-GENERATE
NEMA enclosure rating for disconnect switch.

**Available Options:**
- NEMA-1 (Indoor) ← **Default**
- NEMA-3R (Outdoor, rain-tight)
- NEMA-4 (Watertight)
- NEMA-4X (Watertight, corrosion resistant)

**Selection Logic:**
- Only applies if disconnectSwitch = true
- **NEMA-1**: Indoor installations
- **NEMA-3R**: Outdoor/rooftop (most common for exhaust fans)
- **NEMA-4**: High moisture environments
- **NEMA-4X**: Coastal/corrosive environments

**AI Generation Strategy:**
- If disconnect requested:
  - **DEFAULT**: NEMA-3R (rooftop application)
  - Use NEMA-4X if coastal/corrosive mentioned
- NEVER ask - use NEMA-3R for roof exhaust

### Disconnect Protection (disconnectProtection) - CONDITIONAL - AUTO-GENERATE
Type of overcurrent protection in disconnect.

**Available Options:**
- None ← **Default**
- Fused
- Circuit Breaker

**Selection Logic:**
- Only applies if disconnectSwitch = true
- **None**: Switch only, no protection
- **Fused**: Traditional fuse protection
- **Circuit Breaker**: Resettable protection

**AI Generation Strategy:**
- **DEFAULT**: None (protection at panel)
- Use Fused or Circuit Breaker if user requests
- NEVER ask

### Disconnect Type (disconnectType) - CONDITIONAL - AUTO-GENERATE
Switch mechanism type.

**Available Options:**
- Toggle ← **Default**
- Rotary

**AI Generation Strategy:**
- **DEFAULT**: Toggle
- NEVER ask

### Motor Starter (motorStarter) - OPTIONAL - AUTO-GENERATE
Factory-installed motor starter.

**Type:** Boolean
**Default:** false

**AI Generation Strategy:**
- **DEFAULT**: false
- Use true only if user explicitly requests
- NEVER ask

### Wiring Pigtail (wiringPigtail) - OPTIONAL - AUTO-GENERATE
Pre-wired pigtail for quick connection.

**Type:** Boolean
**Default:** false

**AI Generation Strategy:**
- **DEFAULT**: false
- Use true if user mentions "pigtail" or "quick connect"
- NEVER ask

## Dependencies

### Affected By:
- **Drive Type**: VariGreen only available on G series
- **Motor HP**: Affects voltage/phase requirements
- **CFM/SP**: Higher performance needs larger motors

### Affects:
- **Model Selection**: Motor options vary by series/size
- **Accessories**: Disconnect specs depend on motor

## Common Scenarios

### Scenario 1: Standard Commercial (460V/3-Phase)
```json
{
  "voltage": 460,
  "phase": 3,
  "frequency": 60,
  "motorDesign": "NEMA",
  "enclosure": "TEFC",
  "ulListed": "705",
  "efficiencyRating": "High",
  "variGreenControl": "None",
  "disconnectSwitch": false,
  "motorMfgLocation": "No Preference"
}
```
**Reasoning:** Standard US commercial building. 460V/3-phase is most common. TEFC for outdoor/roof installation.

### Scenario 2: Small Commercial (208V/3-Phase)
```json
{
  "voltage": 208,
  "phase": 3,
  "frequency": 60,
  "motorDesign": "NEMA",
  "enclosure": "TEFC",
  "ulListed": "705",
  "efficiencyRating": "High",
  "disconnectSwitch": false
}
```
**Reasoning:** Smaller commercial building with 208V service.

### Scenario 3: VariGreen with BMS Integration
```json
{
  "voltage": 460,
  "phase": 3,
  "frequency": 60,
  "motorDesign": "NEMA",
  "enclosure": "TEFC",
  "efficiencyRating": "Premium",
  "variGreenControl": "Building Automation",
  "transformerHoa": "None",
  "includeBalanceDial": false,
  "disconnectSwitch": true,
  "disconnectRating": "NEMA-3R"
}
```
**Reasoning:** VariGreen model with BMS integration for variable speed control. Premium efficiency for energy savings.

### Scenario 4: Canadian Project (575V)
```json
{
  "voltage": 575,
  "phase": 3,
  "frequency": 60,
  "motorDesign": "NEMA",
  "enclosure": "TEFC",
  "efficiencyRating": "High",
  "disconnectSwitch": false
}
```
**Reasoning:** Canadian commercial building uses 575V standard.

### Scenario 5: Government Project (USA Motors)
```json
{
  "voltage": 460,
  "phase": 3,
  "frequency": 60,
  "motorDesign": "NEMA",
  "enclosure": "TEFC",
  "efficiencyRating": "Premium",
  "motorMfgLocation": "USA",
  "disconnectSwitch": true,
  "disconnectRating": "NEMA-3R",
  "disconnectProtection": "Fused"
}
```
**Reasoning:** Government project requires US-manufactured motor. Factory disconnect for code compliance.

## Human Input Required?

### SOMETIMES ASK:
| Field | Question | When to Ask |
|-------|----------|-------------|
| Voltage | "What voltage is available?" | Only if small fan or unclear |
| Phase | "Single or three phase?" | Only if residential/small |
| Disconnect | "Do you need a factory disconnect?" | Only if user mentions |

### NEVER ASK (Use Defaults):
| Field | Default | Reasoning |
|-------|---------|-----------|
| Frequency | 60 Hz | US projects |
| Motor Design | NEMA | North American |
| Enclosure | TEFC | Safe for outdoor |
| UL Listed | 705 | Standard for fans |
| Efficiency | High | Best value |
| VariGreen Control | None | Unless VG model |
| Motor Starter | false | Rarely needed |
| Wiring Pigtail | false | Rarely needed |

## Smart Defaults Summary

```javascript
const electricalDefaults = {
  voltage: 460,
  phase: 3,
  frequency: 60,
  motorDesign: "NEMA",
  enclosure: "TEFC",
  ulListed: "705",
  efficiencyRating: "High",
  variGreenControl: "None",
  transformerHoa: "None",
  includeBalanceDial: false,
  disconnectSwitch: false,
  disconnectRating: "NEMA-1",    // Use NEMA-3R if disconnect = true
  disconnectProtection: "None",
  disconnectType: "Toggle",
  motorStarter: false,
  wiringPigtail: false,
  motorMfgLocation: "No Preference",
  specialMotor: false
};
```
