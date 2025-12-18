/**
 * Fan Context Loader
 * Provides comprehensive context about Greenheck G/GB series fans for the AI assistant
 * Updated: Dec 18, 2025 - Added all 62 CAPS UI fields
 */

export const FAN_SELECTION_CONTEXT = `
# Greenheck Fan Selection Assistant Context

You are an AI assistant helping users test Greenheck CAPS (Computerized Automated Product Selection) software for G and GB series roof exhaust fans.

## Your Role
1. Help users describe their fan requirements
2. Parse their requirements into CAPS-compatible parameters
3. Suggest appropriate G or GB series models
4. Generate structured JSON data with ALL CAPS fields for complete export

## IMPORTANT: Structured Output for CAPS Integration
When you recommend a fan selection, you MUST include a JSON code block with ALL selection parameters. This enables the "Copy CAPS Clipboard" button to generate valid import data.

### Complete JSON Output Format

Always include this format when making recommendations. Include ALL fields, using defaults where not specified:

\`\`\`json:caps
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
    "motorHp": "1",
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
\`\`\`

### For Multiple Fans
\`\`\`json:caps
[
  { "mark": "EF-1", "performance": { "cfm": 5000, "staticPressure": 1.5 }, ... },
  { "mark": "EF-2", "performance": { "cfm": 3000, "staticPressure": 1.0 }, ... }
]
\`\`\`

## Field Reference Guide

### Performance Fields (User MUST provide)
| Field | Description | Units | Required |
|-------|-------------|-------|----------|
| cfm | Airflow volume | CFM | ✅ Yes |
| staticPressure | Required static pressure | in. wg | ✅ Yes |
| elevation | Installation elevation | feet | Default: 0 |
| temperature | Airstream temperature | °F | Default: 70 |

### Sizing Options
| Field | Description | Options | Default |
|-------|-------------|---------|---------|
| availableSizes | Size filter | Optimized, All, or array | Optimized |
| sparkResistance | Spark rating | None, TypeA, TypeB, TypeC | None |
| highWindRated | High wind construction | true/false | false |
| seismicRated | Seismic rated | true/false | false |
| efficiencyCodeReq | DOE efficiency code | true/false | false |
| caTitle20Req | California Title 20 | true/false | false |
| driveType | Drive type | Direct, Belt, VG Only, Any | Direct |
| applyVfd | Variable frequency drive | true/false | false |
| speedController | Speed controller | true/false | false |
| performanceBaffle | Performance baffle | true/false | false |
| damperSpCorrection | SP correction for damper | None, Backdraft, Motorized | None |

### Electrical Fields
| Field | Description | Options | Default |
|-------|-------------|---------|---------|
| voltage | Motor voltage | 115, 200, 208, 230, 265, 277, 380, 400, 460, 575 | 460 |
| phase | Electrical phase | 1, 3 | 3 |
| frequency | Electrical frequency | 50, 60 | 60 |
| motorHp | Motor horsepower | string (e.g., "1/4", "1", "5") | - |
| motorDesign | Motor standard | NEMA, IEC | NEMA |
| enclosure | Motor enclosure | TENV, TEFC, ODP, TEAO, IP55 | TEFC |
| ulListed | UL listing number | string | 705 |
| efficiencyRating | Efficiency class | Standard, High, Premium | High |

### VariGreen Control (when applicable)
| Field | Description | Options | Default |
|-------|-------------|---------|---------|
| variGreenControl | Control type | None, Remote Dial, Building Automation, 0-10V, 4-20mA | None |
| transformerHoa | Transformer config | None, Transformer Mounted, Remote | None |
| includeBalanceDial | Balance dial | true/false | false |

### Electrical Accessories
| Field | Description | Options | Default |
|-------|-------------|---------|---------|
| disconnectSwitch | Include disconnect | true/false | false |
| motorStarter | Include starter | true/false | false |
| wiringPigtail | Include pigtail | true/false | false |
| disconnectRating | NEMA rating | NEMA-1, NEMA-3R, NEMA-4, NEMA-4X | NEMA-1 |
| disconnectProtection | Protection type | None, Fused, Circuit Breaker | None |
| disconnectType | Switch type | Toggle, Rotary | Toggle |
| motorMfgLocation | Motor origin | No Preference, USA, North America | No Preference |
| specialMotor | Special motor | true/false | false |

### Configuration Options
| Field | Description | Options | Default |
|-------|-------------|---------|---------|
| coatings | Protective coating | true/false or string | false |
| hoodHasps | Security hasps | true/false | false |
| conduitChaseQty | Conduit chases | number | 1 |
| birdscreenMaterial | Birdscreen | Galvanized, Aluminum, Stainless, None | Galvanized |
| fasteners | Fastener type | Standard, Stainless | Standard |
| unitWarranty | Warranty period | 1 Yr, 3 Yr, 5 Yr | 1 Yr |
| specialNameplate | Special nameplate | true/false | false |

### Damper Options
| Field | Description | Options | Default |
|-------|-------------|---------|---------|
| damper | Include damper | true/false | false |
| damperActuator | Actuator type | Gravity, Motorized, Spring Return | Gravity |
| damperMounting | Mounting method | Loose, Factory | Factory |
| damperBladeAction | Blade action | Parallel, Opposed | Parallel |

### Mounting Options
| Field | Description | Options | Default |
|-------|-------------|---------|---------|
| roofCurbs | Include curb | true/false | false |
| curbExtension | Curb extension | true/false | false |
| curbCapAdapter | Cap adapter | true/false | false |
| hingedCurbCap | Hinged cap | None or string | None |
| curbSeal | Curb seal | true/false | false |
| tieDownPoints | Tie downs | true/false | false |

## G Series (Direct Drive)
- Model: G
- Drive Type: Direct Drive
- Available Sizes: 060, 070, 082, 098, 103, 103HP, 120, 123, 133, 140, 143, 143HP, 163, 163HP, 183, 200, 203
- VariGreen: G-XXX-VG models have VariGreen EC motors
- Speed codes D, G, E, P indicate direct drive
- Best for: Lower CFM applications, quieter operation, less maintenance
- Long motor shaft preferred

## GB Series (Belt Drive)  
- Model: GB
- Drive Type: Belt Drive
- Available Sizes: 80, 100, 120, 140, 160, 180, 200, 220, 240, 270, 300, 330, 360
- Best for: Higher CFM applications, more flexibility in motor sizing
- Housing Material: Aluminum for IP55 enclosure
- Belt drive minimum speed comes from BeltDrive table

## Selection Logic

### When to use G Series (Direct Drive)
- CFM < 10,000
- Lower noise requirement
- Minimum maintenance preference
- Standard roof exhaust applications

### When to use GB Series (Belt Drive)
- CFM > 10,000
- Need specific RPM/SP combinations
- Flexible motor sizing required
- Higher pressure applications

### Special Requirements Trigger Questions
Ask the user if they mention:
- **"California" or "CA"** → Ask about CA Title 20
- **"hospital", "lab", "explosive"** → Ask about Spark Resistance
- **"coast", "hurricane", "wind"** → Ask about High Wind rating
- **"California", "earthquake"** → Ask about Seismic rating
- **"outdoor", "roof", "weatherproof"** → Consider NEMA-3R or NEMA-4 disconnect

## Response Format
When helping users, provide:
1. **Parsed Requirements** - Table of extracted parameters
2. **Full Parameter Table** - ALL CAPS fields with values and defaults
3. **Recommended Models** - Appropriate G or GB selections with reasoning
4. **Complete JSON Block** - Full \`json:caps\` block for export

Always be helpful, accurate, and explain your reasoning. If requirements are unclear, ask clarifying questions.
`;

/**
 * Complete CAPS field definitions with metadata
 */
export interface CapsField {
  id: string;
  name: string;
  category: 'performance' | 'sizing' | 'electrical' | 'configuration' | 'selection';
  type: 'number' | 'string' | 'boolean' | 'enum';
  options?: string[];
  default?: string | number | boolean;
  required: boolean;
  askHuman: boolean;
  description: string;
}

export const CAPS_FIELDS: CapsField[] = [
  // Performance (User MUST provide)
  { id: 'cfm', name: 'CFM', category: 'performance', type: 'number', required: true, askHuman: true, description: 'Airflow volume in cubic feet per minute' },
  { id: 'staticPressure', name: 'Static Pressure', category: 'performance', type: 'number', required: true, askHuman: true, description: 'Required static pressure in inches water gauge' },
  { id: 'elevation', name: 'Elevation', category: 'performance', type: 'number', default: 0, required: false, askHuman: false, description: 'Installation elevation in feet above sea level' },
  { id: 'temperature', name: 'Temperature', category: 'performance', type: 'number', default: 70, required: false, askHuman: false, description: 'Airstream temperature in °F' },
  
  // Sizing
  { id: 'availableSizes', name: 'Available Sizes', category: 'sizing', type: 'string', default: 'Optimized', required: false, askHuman: false, description: 'Size filter mode' },
  { id: 'sparkResistance', name: 'Spark Resistance', category: 'sizing', type: 'enum', options: ['None', 'TypeA', 'TypeB', 'TypeC'], default: 'None', required: false, askHuman: true, description: 'AMCA spark resistance classification' },
  { id: 'highWindRated', name: 'High Wind Rated', category: 'sizing', type: 'boolean', default: false, required: false, askHuman: true, description: 'High wind construction requirement' },
  { id: 'seismicRated', name: 'Seismic Rated', category: 'sizing', type: 'boolean', default: false, required: false, askHuman: true, description: 'Seismic rating requirement' },
  { id: 'efficiencyCodeReq', name: 'Efficiency Code', category: 'sizing', type: 'boolean', default: false, required: false, askHuman: false, description: 'DOE efficiency code requirement' },
  { id: 'caTitle20Req', name: 'CA Title 20', category: 'sizing', type: 'boolean', default: false, required: false, askHuman: true, description: 'California Title 20 requirement' },
  { id: 'driveType', name: 'Drive Type', category: 'sizing', type: 'enum', options: ['Direct', 'Belt', 'VG Only', 'Any'], default: 'Direct', required: false, askHuman: true, description: 'Fan drive type' },
  { id: 'applyVfd', name: 'Apply VFD', category: 'sizing', type: 'boolean', default: false, required: false, askHuman: true, description: 'Variable frequency drive' },
  { id: 'speedController', name: 'Speed Controller', category: 'sizing', type: 'boolean', default: false, required: false, askHuman: false, description: 'Include speed controller' },
  { id: 'performanceBaffle', name: 'Performance Baffle', category: 'sizing', type: 'boolean', default: false, required: false, askHuman: false, description: 'Include performance baffle' },
  { id: 'damperSpCorrection', name: 'Damper SP Correction', category: 'sizing', type: 'enum', options: ['None', 'Backdraft', 'Motorized'], default: 'None', required: false, askHuman: false, description: 'SP correction for damper type' },
  
  // Electrical - Motor
  { id: 'voltage', name: 'Voltage', category: 'electrical', type: 'enum', options: ['115', '200', '208', '230', '265', '277', '380', '400', '460', '575'], default: '460', required: false, askHuman: true, description: 'Motor voltage' },
  { id: 'phase', name: 'Phase', category: 'electrical', type: 'enum', options: ['1', '3'], default: '3', required: false, askHuman: true, description: 'Electrical phase' },
  { id: 'frequency', name: 'Frequency', category: 'electrical', type: 'enum', options: ['50', '60'], default: '60', required: false, askHuman: false, description: 'Electrical frequency (Hz)' },
  { id: 'motorHp', name: 'Motor HP', category: 'electrical', type: 'string', required: false, askHuman: false, description: 'Motor horsepower' },
  { id: 'motorDesign', name: 'Motor Design', category: 'electrical', type: 'enum', options: ['NEMA', 'IEC'], default: 'NEMA', required: false, askHuman: false, description: 'Motor design standard' },
  { id: 'enclosure', name: 'Enclosure', category: 'electrical', type: 'enum', options: ['TENV', 'TEFC', 'ODP', 'TEAO', 'IP55'], default: 'TEFC', required: false, askHuman: false, description: 'Motor enclosure type' },
  { id: 'ulListed', name: 'UL Listed', category: 'electrical', type: 'string', default: '705', required: false, askHuman: false, description: 'UL listing number' },
  { id: 'efficiencyRating', name: 'Efficiency Rating', category: 'electrical', type: 'enum', options: ['Standard', 'High', 'Premium'], default: 'High', required: false, askHuman: false, description: 'Motor efficiency class' },
  
  // Electrical - VariGreen Control
  { id: 'variGreenControl', name: 'VariGreen Control', category: 'electrical', type: 'enum', options: ['None', 'Remote Dial', 'Building Automation', '0-10V', '4-20mA'], default: 'None', required: false, askHuman: false, description: 'VariGreen control type' },
  { id: 'transformerHoa', name: 'Transformer HOA', category: 'electrical', type: 'enum', options: ['None', 'Transformer Mounted', 'Remote'], default: 'None', required: false, askHuman: false, description: 'Transformer/HOA configuration' },
  { id: 'includeBalanceDial', name: 'Balance Dial', category: 'electrical', type: 'boolean', default: false, required: false, askHuman: false, description: 'Include balance dial' },
  
  // Electrical - Accessories
  { id: 'disconnectSwitch', name: 'Disconnect Switch', category: 'electrical', type: 'boolean', default: false, required: false, askHuman: true, description: 'Factory disconnect switch' },
  { id: 'motorStarter', name: 'Motor Starter', category: 'electrical', type: 'boolean', default: false, required: false, askHuman: false, description: 'Include motor starter' },
  { id: 'wiringPigtail', name: 'Wiring Pigtail', category: 'electrical', type: 'boolean', default: false, required: false, askHuman: false, description: 'Wiring pigtail accessory' },
  { id: 'disconnectRating', name: 'Disconnect Rating', category: 'electrical', type: 'enum', options: ['NEMA-1', 'NEMA-3R', 'NEMA-4', 'NEMA-4X'], default: 'NEMA-1', required: false, askHuman: false, description: 'NEMA enclosure rating' },
  { id: 'disconnectProtection', name: 'Disconnect Protection', category: 'electrical', type: 'enum', options: ['None', 'Fused', 'Circuit Breaker'], default: 'None', required: false, askHuman: false, description: 'Disconnect protection type' },
  { id: 'disconnectType', name: 'Disconnect Type', category: 'electrical', type: 'enum', options: ['Toggle', 'Rotary'], default: 'Toggle', required: false, askHuman: false, description: 'Switch type' },
  { id: 'motorMfgLocation', name: 'Motor Mfg Location', category: 'electrical', type: 'enum', options: ['No Preference', 'USA', 'North America'], default: 'No Preference', required: false, askHuman: false, description: 'Motor manufacturing location' },
  { id: 'specialMotor', name: 'Special Motor', category: 'electrical', type: 'boolean', default: false, required: false, askHuman: false, description: 'Request special motor' },
  
  // Configuration - Construction
  { id: 'coatings', name: 'Coatings', category: 'configuration', type: 'boolean', default: false, required: false, askHuman: false, description: 'Protective coatings' },
  { id: 'hoodHasps', name: 'Hood Hasps', category: 'configuration', type: 'boolean', default: false, required: false, askHuman: false, description: 'Security hasps' },
  { id: 'conduitChaseQty', name: 'Conduit Chase Qty', category: 'configuration', type: 'number', default: 1, required: false, askHuman: false, description: 'Number of conduit chases' },
  { id: 'birdscreenMaterial', name: 'Birdscreen Material', category: 'configuration', type: 'enum', options: ['Galvanized', 'Aluminum', 'Stainless', 'None'], default: 'Galvanized', required: false, askHuman: false, description: 'Birdscreen material' },
  { id: 'fasteners', name: 'Fasteners', category: 'configuration', type: 'enum', options: ['Standard', 'Stainless'], default: 'Standard', required: false, askHuman: false, description: 'Fastener type' },
  
  // Configuration - General Accessories
  { id: 'damper', name: 'Damper', category: 'configuration', type: 'boolean', default: false, required: false, askHuman: true, description: 'Include damper' },
  { id: 'damperActuator', name: 'Damper Actuator', category: 'configuration', type: 'enum', options: ['Gravity', 'Motorized', 'Spring Return'], default: 'Gravity', required: false, askHuman: false, description: 'Damper actuator type' },
  { id: 'damperMounting', name: 'Damper Mounting', category: 'configuration', type: 'enum', options: ['Loose', 'Factory'], default: 'Factory', required: false, askHuman: false, description: 'Damper mounting method' },
  { id: 'damperBladeAction', name: 'Blade Action', category: 'configuration', type: 'enum', options: ['Parallel', 'Opposed'], default: 'Parallel', required: false, askHuman: false, description: 'Damper blade action' },
  { id: 'unitWarranty', name: 'Unit Warranty', category: 'configuration', type: 'enum', options: ['1 Yr', '3 Yr', '5 Yr'], default: '1 Yr', required: false, askHuman: false, description: 'Warranty period' },
  { id: 'specialNameplate', name: 'Special Nameplate', category: 'configuration', type: 'boolean', default: false, required: false, askHuman: false, description: 'Special nameplate requirement' },
  
  // Configuration - Mounting
  { id: 'roofCurbs', name: 'Roof Curbs', category: 'configuration', type: 'boolean', default: false, required: false, askHuman: true, description: 'Include roof curb' },
  { id: 'curbExtension', name: 'Curb Extension', category: 'configuration', type: 'boolean', default: false, required: false, askHuman: false, description: 'Curb extension' },
  { id: 'curbCapAdapter', name: 'Curb Cap Adapter', category: 'configuration', type: 'boolean', default: false, required: false, askHuman: false, description: 'Curb cap adapter' },
  { id: 'hingedCurbCap', name: 'Hinged Curb Cap', category: 'configuration', type: 'string', default: 'None', required: false, askHuman: false, description: 'Hinged curb cap type' },
  { id: 'curbSeal', name: 'Curb Seal', category: 'configuration', type: 'boolean', default: false, required: false, askHuman: false, description: 'Curb seal' },
  { id: 'tieDownPoints', name: 'Tie Down Points', category: 'configuration', type: 'boolean', default: false, required: false, askHuman: false, description: 'Tie down points' },
  
  // Selection Output
  { id: 'series', name: 'Series', category: 'selection', type: 'enum', options: ['G', 'GB'], required: false, askHuman: false, description: 'Fan series' },
  { id: 'size', name: 'Size', category: 'selection', type: 'string', required: false, askHuman: false, description: 'Fan size code' },
  { id: 'model', name: 'Model', category: 'selection', type: 'string', required: false, askHuman: false, description: 'Complete model number' },
];

/**
 * Terminology dictionary for mapping user terms to CAPS values
 */
export const TERMINOLOGY_MAP: Record<string, Record<string, string>> = {
  driveType: {
    "direct": "Direct",
    "direct drive": "Direct", 
    "belt": "Belt",
    "belt drive": "Belt",
    "varigreen": "VG Only",
    "variable": "VG Only",
    "vfd": "VG Only",
    "vg": "VG Only",
    "ec motor": "VG Only",
  },
  damper: {
    "yes": "true",
    "no": "false",
    "gravity": "true",
    "backdraft": "true",
    "none": "false",
    "with damper": "true",
    "without damper": "false",
  },
  damperActuator: {
    "gravity": "Gravity",
    "backdraft": "Gravity",
    "motorized": "Motorized",
    "motor operated": "Motorized",
    "spring": "Spring Return",
    "spring return": "Spring Return",
  },
  enclosure: {
    "odp": "ODP",
    "open drip proof": "ODP",
    "tefc": "TEFC",
    "totally enclosed": "TEFC",
    "tenv": "TENV",
    "ip55": "IP55",
    "teao": "TEAO",
  },
  disconnectSwitch: {
    "yes": "true",
    "no": "false",
    "fused": "true",
    "with disconnect": "true",
    "without disconnect": "false",
  },
  disconnectProtection: {
    "fused": "Fused",
    "breaker": "Circuit Breaker",
    "circuit breaker": "Circuit Breaker",
    "none": "None",
  },
  disconnectRating: {
    "nema 1": "NEMA-1",
    "nema-1": "NEMA-1",
    "indoor": "NEMA-1",
    "nema 3r": "NEMA-3R",
    "nema-3r": "NEMA-3R",
    "outdoor": "NEMA-3R",
    "nema 4": "NEMA-4",
    "nema-4": "NEMA-4",
    "watertight": "NEMA-4",
    "nema 4x": "NEMA-4X",
    "nema-4x": "NEMA-4X",
    "stainless": "NEMA-4X",
  },
  sparkResistance: {
    "none": "None",
    "type a": "TypeA",
    "type-a": "TypeA",
    "a": "TypeA",
    "type b": "TypeB",
    "type-b": "TypeB",
    "b": "TypeB",
    "type c": "TypeC",
    "type-c": "TypeC",
    "c": "TypeC",
  },
  efficiencyRating: {
    "standard": "Standard",
    "high": "High",
    "premium": "Premium",
    "high efficiency": "Premium",
    "ie3": "Premium",
  },
  birdscreenMaterial: {
    "galvanized": "Galvanized",
    "galv": "Galvanized",
    "aluminum": "Aluminum",
    "alum": "Aluminum",
    "stainless": "Stainless",
    "ss": "Stainless",
    "none": "None",
  },
};

/**
 * Generate system prompt for Claude
 */
export function getSystemPrompt(): string {
  return FAN_SELECTION_CONTEXT;
}

/**
 * Get fields that should be asked if not provided
 */
export function getAskHumanFields(): CapsField[] {
  return CAPS_FIELDS.filter(f => f.askHuman);
}

/**
 * Get default value for a field
 */
export function getFieldDefault(fieldId: string): string | number | boolean | undefined {
  const field = CAPS_FIELDS.find(f => f.id === fieldId);
  return field?.default;
}

/**
 * Get all fields by category
 */
export function getFieldsByCategory(category: CapsField['category']): CapsField[] {
  return CAPS_FIELDS.filter(f => f.category === category);
}
