/**
 * Build Vision Spec Type Mapping
 * 
 * Maps Build Vision SpecType IDs and names to CAPS selection fields
 * Based on SpecTypes_FINAL_SEED.json from Build Vision backend
 * 
 * @version 1.0.0
 * @author Build Vision
 */

// ============================================
// BUILD VISION SPEC TYPE DEFINITIONS
// ============================================

/**
 * Build Vision Spec Type structure
 */
export interface BuildVisionSpecType {
  id: string;
  name: string;
  description?: string;
  alternateNames?: string[];
}

/**
 * A spec value extracted from a Build Vision document/schedule
 */
export interface BuildVisionSpecValue {
  /** Spec Type ID from Build Vision */
  specTypeId: string;
  
  /** Spec Type Name (for reference) */
  specTypeName?: string;
  
  /** The extracted value */
  value: string | number | boolean;
  
  /** Unit of measure (if applicable) */
  unit?: string;
  
  /** Confidence score from extraction (0-1) */
  confidence?: number;
}

// ============================================
// SPEC TYPE ID MAPPINGS
// Based on SpecTypes_FINAL_SEED.json
// ============================================

export const SPEC_TYPE_IDS = {
  // Core Performance Specs
  VOLTAGE: '7cafa240-aa93-5b24-bd1c-1008283492b0',
  PHASE: 'ea199f25-ec25-5e1d-81da-6e63bc2c653f',
  MOTOR_HORSEPOWER: 'cb135d4b-dbc0-5ebe-bd94-ab701afc3bd5',
  MOTOR_EFFICIENCY: '66d26b7e-e7ee-5f70-a254-86b0c42e3ef1',
  MOTOR_ENCLOSURE: '442ff1bb-25e4-5ab2-87fc-cf3eb9d3dc1d',
  DRIVE_TYPE: 'aa16d27e-fcc1-54dd-9d6e-7ec754fd66ca',
  EXTERNAL_STATIC_PRESSURE: 'b64d61da-672f-59db-869e-a1ece88dee07',
  FAN_CFM: '4d04da7e-d1cf-444e-8d10-b9d99f709693',
  VFD_READY: 'b7515d3a-e192-5466-b12c-d4abbc3e3dcf',
  
  // Damper Specs
  DAMPER_INCLUDED: '927ed702-1e10-59ec-8f2e-eb7b55625467',
  BACKDRAFT_DAMPER: '029ffea1-c1cd-5e49-8bfd-30e00b81ccaf',
  ACTUATOR_TYPE: '6ddd57df-9b76-501d-8b8a-74a11c2fb2a2',
  
  // Disconnect Specs
  DISCONNECT_SWITCH: '0850f620-da2f-5961-911c-46fe649fcff0',
  DISCONNECT_TYPE: '51be122e-50ee-445c-b72f-38d861eaf93d',
  
  // Physical Specs
  WEIGHT: 'b3f87472-e14e-4efb-8ce9-5a9322e3cb79',
} as const;

// Create reverse lookup by name
export const SPEC_TYPE_BY_NAME: Record<string, string> = {
  'Voltage': SPEC_TYPE_IDS.VOLTAGE,
  'Phase': SPEC_TYPE_IDS.PHASE,
  'Motor Horsepower': SPEC_TYPE_IDS.MOTOR_HORSEPOWER,
  'Motor HP': SPEC_TYPE_IDS.MOTOR_HORSEPOWER,
  'HP': SPEC_TYPE_IDS.MOTOR_HORSEPOWER,
  'Motor Efficiency': SPEC_TYPE_IDS.MOTOR_EFFICIENCY,
  'Motor Enclosure': SPEC_TYPE_IDS.MOTOR_ENCLOSURE,
  'Enclosure': SPEC_TYPE_IDS.MOTOR_ENCLOSURE,
  'Drive Type': SPEC_TYPE_IDS.DRIVE_TYPE,
  'External Static Pressure': SPEC_TYPE_IDS.EXTERNAL_STATIC_PRESSURE,
  'ESP': SPEC_TYPE_IDS.EXTERNAL_STATIC_PRESSURE,
  'Static Pressure': SPEC_TYPE_IDS.EXTERNAL_STATIC_PRESSURE,
  'SP': SPEC_TYPE_IDS.EXTERNAL_STATIC_PRESSURE,
  'Fan CFM': SPEC_TYPE_IDS.FAN_CFM,
  'CFM': SPEC_TYPE_IDS.FAN_CFM,
  'Airflow': SPEC_TYPE_IDS.FAN_CFM,
  'VFD Ready': SPEC_TYPE_IDS.VFD_READY,
  'VFD Compatible': SPEC_TYPE_IDS.VFD_READY,
  'Damper Included': SPEC_TYPE_IDS.DAMPER_INCLUDED,
  'Backdraft Damper': SPEC_TYPE_IDS.BACKDRAFT_DAMPER,
  'Actuator Type': SPEC_TYPE_IDS.ACTUATOR_TYPE,
  'Disconnect Switch': SPEC_TYPE_IDS.DISCONNECT_SWITCH,
  'Disconnect': SPEC_TYPE_IDS.DISCONNECT_SWITCH,
  'Disconnect Type': SPEC_TYPE_IDS.DISCONNECT_TYPE,
  'Weight': SPEC_TYPE_IDS.WEIGHT,
};

// ============================================
// CAPS FIELD MAPPING
// ============================================

/**
 * Maps Build Vision spec type IDs to CAPS selection field paths
 */
export const SPEC_TO_CAPS_MAPPING: Record<string, CapsFieldMapping> = {
  [SPEC_TYPE_IDS.VOLTAGE]: {
    capsPath: 'electrical.motor.voltage',
    transform: parseVoltage,
    capsFieldName: 'voltage'
  },
  [SPEC_TYPE_IDS.PHASE]: {
    capsPath: 'electrical.motor.phase',
    transform: parsePhase,
    capsFieldName: 'phase'
  },
  [SPEC_TYPE_IDS.MOTOR_HORSEPOWER]: {
    capsPath: 'electrical.motor.motorSizeHp',
    transform: normalizeHorsepower,
    capsFieldName: 'motorSizeHp'
  },
  [SPEC_TYPE_IDS.MOTOR_EFFICIENCY]: {
    capsPath: 'electrical.motor.efficiencyRating',
    transform: parseEfficiency,
    capsFieldName: 'efficiencyRating'
  },
  [SPEC_TYPE_IDS.MOTOR_ENCLOSURE]: {
    capsPath: 'electrical.motor.enclosure',
    transform: parseEnclosure,
    capsFieldName: 'enclosure'
  },
  [SPEC_TYPE_IDS.DRIVE_TYPE]: {
    capsPath: 'sizing.advanced.driveType',
    transform: parseDriveType,
    capsFieldName: 'driveType'
  },
  [SPEC_TYPE_IDS.EXTERNAL_STATIC_PRESSURE]: {
    capsPath: 'performance.staticPressure',
    transform: parseNumber,
    capsFieldName: 'staticPressure'
  },
  [SPEC_TYPE_IDS.FAN_CFM]: {
    capsPath: 'performance.cfm',
    transform: parseCfm,
    capsFieldName: 'cfm'
  },
  [SPEC_TYPE_IDS.VFD_READY]: {
    capsPath: 'sizing.advanced.applyVfd',
    transform: parseBoolean,
    capsFieldName: 'applyVfd'
  },
  [SPEC_TYPE_IDS.DAMPER_INCLUDED]: {
    capsPath: 'configuration.accessories.damper',
    transform: parseBoolean,
    capsFieldName: 'damper'
  },
  [SPEC_TYPE_IDS.BACKDRAFT_DAMPER]: {
    capsPath: 'configuration.damper.actuatorType',
    transform: () => 'Gravity',
    capsFieldName: 'actuatorType',
    additionalMappings: {
      'configuration.accessories.damper': true
    }
  },
  [SPEC_TYPE_IDS.ACTUATOR_TYPE]: {
    capsPath: 'configuration.damper.actuatorType',
    transform: parseActuatorType,
    capsFieldName: 'actuatorType'
  },
  [SPEC_TYPE_IDS.DISCONNECT_SWITCH]: {
    capsPath: 'electrical.electricalAccessories.disconnectSwitch',
    transform: parseBoolean,
    capsFieldName: 'disconnectSwitch'
  },
  [SPEC_TYPE_IDS.DISCONNECT_TYPE]: {
    capsPath: 'electrical.disconnectSwitch.enclosureRating',
    transform: parseDisconnectType,
    capsFieldName: 'enclosureRating'
  },
};

export interface CapsFieldMapping {
  /** Dot-notation path in CAPS selection structure */
  capsPath: string;
  
  /** Function to transform the value */
  transform: (value: string | number | boolean) => unknown;
  
  /** Field name for reference */
  capsFieldName: string;
  
  /** Additional fields to set when this spec is present */
  additionalMappings?: Record<string, unknown>;
}

// ============================================
// VALUE TRANSFORMATION FUNCTIONS
// ============================================

function parseNumber(value: string | number | boolean): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'boolean') return value ? 1 : 0;
  const cleaned = String(value).replace(/[,\s]/g, '');
  return parseFloat(cleaned) || 0;
}

function parseCfm(value: string | number | boolean): number {
  const num = parseNumber(value);
  return Math.round(num);
}

function parseVoltage(value: string | number | boolean): number {
  const str = String(value).toLowerCase();
  
  // Handle common voltage specifications
  if (str.includes('480') || str.includes('460')) return 460;
  if (str.includes('208')) return 208;
  if (str.includes('230')) return 230;
  if (str.includes('115') || str.includes('120')) return 115;
  if (str.includes('277')) return 277;
  if (str.includes('575') || str.includes('600')) return 575;
  
  return parseNumber(value);
}

function parsePhase(value: string | number | boolean): 1 | 3 {
  const str = String(value).toLowerCase();
  
  if (str.includes('3') || str.includes('three')) return 3;
  if (str.includes('1') || str.includes('single')) return 1;
  
  return 1; // Default to single phase
}

function normalizeHorsepower(value: string | number | boolean): string {
  const str = String(value).toLowerCase().trim();
  
  // Handle fractional HP
  if (str.includes('1/4') || str === '0.25') return '1/4';
  if (str.includes('1/3') || str === '0.33') return '1/3';
  if (str.includes('1/2') || str === '0.5') return '1/2';
  if (str.includes('3/4') || str === '0.75') return '3/4';
  if (str.includes('1/6') || str === '0.167') return '1/6';
  if (str.includes('1/8') || str === '0.125') return '1/8';
  if (str.includes('1/15') || str === '0.067') return '1/15';
  
  // Handle whole numbers
  const num = parseFloat(str);
  if (!isNaN(num)) {
    if (num < 1) {
      // Convert decimal to fraction
      if (num <= 0.1) return '1/15';
      if (num <= 0.2) return '1/6';
      if (num <= 0.3) return '1/4';
      if (num <= 0.4) return '1/3';
      if (num <= 0.6) return '1/2';
      return '3/4';
    }
    return String(Math.round(num));
  }
  
  return str;
}

function parseEfficiency(value: string | number | boolean): string {
  const str = String(value).toLowerCase();
  
  if (str.includes('premium')) return 'Premium';
  if (str.includes('high') || str.includes('epact')) return 'High';
  
  return 'Standard';
}

function parseEnclosure(value: string | number | boolean): string {
  const str = String(value).toUpperCase();
  
  if (str.includes('TENV')) return 'TENV';
  if (str.includes('TEFC')) return 'TEFC';
  if (str.includes('ODP') || str.includes('OPEN')) return 'ODP';
  if (str.includes('IP55')) return 'IP55';
  
  return 'TENV'; // Default
}

function parseDriveType(value: string | number | boolean): string {
  const str = String(value).toLowerCase();
  
  if (str.includes('direct') || str.includes('dd')) return 'Direct';
  if (str.includes('belt') || str.includes('bd')) return 'Belt';
  if (str.includes('vg') || str.includes('varigreen') || str.includes('ec')) return 'VG Only';
  
  return 'Any';
}

function parseBoolean(value: string | number | boolean): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  
  const str = String(value).toLowerCase();
  return str === 'yes' || str === 'true' || str === '1' || str === 'y';
}

function parseActuatorType(value: string | number | boolean): string {
  const str = String(value).toLowerCase();
  
  if (str.includes('gravity') || str.includes('backdraft')) return 'Gravity';
  if (str.includes('motor') || str.includes('electric')) return 'Motorized';
  if (str.includes('spring') || str.includes('return')) return 'Spring Return';
  
  return 'Gravity';
}

function parseDisconnectType(value: string | number | boolean): string {
  const str = String(value).toUpperCase();
  
  if (str.includes('3R') || str.includes('WEATHERPROOF') || str.includes('WP')) return 'NEMA-3R';
  if (str.includes('4X')) return 'NEMA-4X';
  if (str.includes('4') && !str.includes('4X')) return 'NEMA-4';
  
  return 'NEMA-1';
}

// ============================================
// EXPORTS
// ============================================

export type SpecTypeId = typeof SPEC_TYPE_IDS[keyof typeof SPEC_TYPE_IDS];
