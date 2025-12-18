/**
 * Greenheck CAPS Selection Types
 * 
 * Complete TypeScript definitions for G and GB series fan selections
 * Based on CAPS UI fields from Sizing, Electrical, and Configuration screens
 * 
 * @version 1.0.0
 * @author Build Vision
 */

// ============================================
// ENUMS - Predefined Option Values
// ============================================

export type SparkResistanceType = 'None' | 'TypeA' | 'TypeB' | 'TypeC';

export type DriveType = 'Direct' | 'Belt' | 'VG Only' | 'Any';

export type MotorPhase = 1 | 3;

export type Voltage = 115 | 200 | 208 | 230 | 265 | 277 | 380 | 400 | 460 | 575;

export type MotorDesign = 'NEMA' | 'IEC';

export type EnclosureType = 'TENV' | 'TEFC' | 'ODP' | 'TEAO' | 'IP55';

export type EfficiencyRating = 'Standard' | 'High' | 'Premium';

export type DisconnectEnclosureRating = 'NEMA-1' | 'NEMA-3R' | 'NEMA-4' | 'NEMA-4X';

export type DisconnectProtection = 'None' | 'Fused' | 'Circuit Breaker';

export type DisconnectType = 'Toggle' | 'Rotary';

export type BirdscreenMaterial = 'Galvanized' | 'Aluminum' | 'Stainless' | 'None';

export type FastenerType = 'Standard' | 'Stainless';

export type WarrantyType = '1 Yr (Standard)' | '3 Yr' | '5 Yr';

export type DamperBladeAction = 'Parallel' | 'Opposed';

export type ActuatorType = 'Gravity' | 'Motorized' | 'Spring Return';

export type DamperMountingType = 'Channel' | 'Flange';

export type VariGreenControlType = 'None' | 'Remote Dial' | 'Building Automation' | '0-10V' | '4-20mA';

export type TransformerHoaType = 'None' | 'Transformer Mounted' | 'Remote';

export type MotorMfgLocation = 'No Preference' | 'USA' | 'North America';

// ============================================
// 1. SIZING / INPUTS SCREEN
// ============================================

/**
 * Basic Inputs (Required)
 */
export interface BasicInputs {
  /** How to filter available sizes: 'Optimized' uses algorithm, or specify array */
  availableSizes: 'Optimized' | 'All' | string[];
}

/**
 * Application Inputs (Optional)
 * Special construction requirements from engineer specifications
 */
export interface ApplicationInputs {
  /** Spark resistance classification: None, TypeA, TypeB, TypeC */
  sparkResistance: SparkResistanceType;
  
  /** High wind rated construction */
  highWindRated: boolean;
  
  /** Seismic rated construction */
  seismicRated: boolean;
  
  /** Efficiency code requirement (DOE, etc.) */
  efficiencyCodeReq: boolean;
  
  /** California Title 20 requirement */
  caTitle20Req: boolean;
}

/**
 * Advanced Inputs (Optional)
 * Drive and performance options
 */
export interface AdvancedInputs {
  /** Drive type selection */
  driveType: DriveType;
  
  /** Apply Variable Frequency Drive */
  applyVfd: boolean;
  
  /** Include speed controller */
  speedController: boolean;
  
  /** Include performance baffle */
  performanceBaffle: boolean;
}

/**
 * Static Pressure Corrections
 * Adjustments for accessories affecting SP
 */
export interface StaticPressureCorrections {
  /** Damper type for SP correction: None, Backdraft, Motorized */
  damper: 'None' | 'Backdraft' | 'Motorized';
}

/**
 * Complete Sizing/Inputs Screen Configuration
 */
export interface SizingInputs {
  basic: BasicInputs;
  application: ApplicationInputs;
  advanced: AdvancedInputs;
  spCorrections: StaticPressureCorrections;
}

// ============================================
// 2. ELECTRICAL / MOTOR SCREEN
// ============================================

/**
 * Motor Configuration (Required)
 */
export interface MotorConfig {
  /** Include motor and drive assembly */
  includeMotorDrive: boolean;
  
  /** Motor size in horsepower (string for fractional HP like "1/4") */
  motorSizeHp: string;
  
  /** Electrical phase: 1 or 3 */
  phase: MotorPhase;
  
  /** Voltage rating */
  voltage: Voltage;
  
  /** Motor design standard */
  motorDesign: MotorDesign;
  
  /** Motor enclosure type */
  enclosure: EnclosureType;
  
  /** UL listing number */
  ulListed: string;
  
  /** Efficiency rating classification */
  efficiencyRating: EfficiencyRating;
}

/**
 * Control Options for VariGreen motors
 */
export interface ControlOptions {
  /** VariGreen control method */
  variGreenControl: VariGreenControlType;
  
  /** Transformer/HOA configuration */
  transformerHoa: TransformerHoaType;
  
  /** Include balance dial for airflow adjustment */
  includeBalanceDial: boolean;
}

/**
 * Electrical Accessories
 */
export interface ElectricalAccessories {
  /** Include factory disconnect switch */
  disconnectSwitch: boolean;
  
  /** Include motor starter */
  motorStarter: boolean;
  
  /** Include wiring pigtail accessory */
  wiringPigtailAccessory: boolean;
}

/**
 * Disconnect Switch Configuration (when disconnectSwitch is true)
 */
export interface DisconnectSwitchOptions {
  /** NEMA enclosure rating */
  enclosureRating: DisconnectEnclosureRating;
  
  /** Protection type: None, Fused, Circuit Breaker */
  protection: DisconnectProtection;
  
  /** Switch type: Toggle or Rotary */
  type: DisconnectType;
  
  /** Junction box mounting option */
  junctionBoxMtg: 'Mounted And Wired' | 'Loose' | string;
  
  /** Switch wiring configuration */
  switchWiring: 'None' | 'Prewired' | string;
  
  /** Include auxiliary contact */
  auxiliaryContact: boolean;
  
  /** Quantity of auxiliary contacts */
  auxiliaryContactQty: number;
}

/**
 * Advanced Motor Options
 */
export interface MotorAdvancedOptions {
  /** Motor manufacturing location preference */
  motorMfgLocation: MotorMfgLocation;
  
  /** Request special/custom motor */
  specialMotor: boolean;
}

/**
 * Complete Electrical/Motor Screen Configuration
 */
export interface ElectricalMotor {
  motor: MotorConfig;
  controlOptions: ControlOptions;
  electricalAccessories: ElectricalAccessories;
  disconnectSwitch?: DisconnectSwitchOptions;
  motorAdvanced: MotorAdvancedOptions;
}

// ============================================
// 3. CONFIGURATION / CONSTRUCTION SCREEN
// ============================================

/**
 * Construction Options
 */
export interface ConstructionOptions {
  /** Protective coatings */
  coatings: boolean | string;
  
  /** Include hood hasps for security */
  hoodHasps: boolean;
  
  /** Number of conduit chases */
  conduitChaseQty: number;
  
  /** Birdscreen material */
  birdscreenMaterial: BirdscreenMaterial;
  
  /** Fastener type */
  fasteners: FastenerType;
}

/**
 * General Accessories
 */
export interface GeneralAccessories {
  /** Include damper */
  damper: boolean;
  
  /** Unit warranty period */
  unitWarranty: WarrantyType;
  
  /** Special nameplate requirement */
  specialNameplate: boolean;
}

/**
 * Damper Configuration (when damper is true)
 */
export interface DamperOptions {
  /** Damper model number */
  model: string;
  
  /** Damper mounting method */
  damperMounting: 'Loose' | 'Factory Mounted' | string;
  
  /** Quantity of dampers */
  damperQuantity: number;
  
  /** Blade action type */
  bladeAction: DamperBladeAction;
  
  /** Damper mounting type */
  damperMountingType: DamperMountingType;
  
  /** Actuator type for damper operation */
  actuatorType: ActuatorType;
  
  /** Include end switch */
  endSwitch: boolean;
}

/**
 * Mounting Accessories
 */
export interface MountingAccessories {
  /** Include roof curb */
  roofCurbs: boolean;
  
  /** Include curb extension */
  curbExtension: boolean;
  
  /** Include curb cap adapter */
  curbCapAdapter: boolean;
  
  /** Hinged curb cap type */
  hingedCurbCap: 'None' | string;
  
  /** Include curb seal */
  curbSeal: boolean;
  
  /** Include tie down points */
  tieDownPoints: boolean;
}

/**
 * Complete Configuration/Construction Screen
 */
export interface ConfigurationConstruction {
  construction: ConstructionOptions;
  accessories: GeneralAccessories;
  damper?: DamperOptions;
  mounting: MountingAccessories;
}

// ============================================
// COMBINED SELECTION TYPES
// ============================================

/**
 * Performance Requirements from Engineer Schedule
 */
export interface PerformanceRequirements {
  /** Required airflow in CFM */
  cfm: number;
  
  /** Required static pressure in inches water gauge */
  staticPressure: number;
  
  /** Installation elevation in feet (affects air density) */
  elevation?: number;
  
  /** Airstream temperature in °F */
  airstreamTemperature?: number;
}

/**
 * Complete CAPS Selection Input
 * All fields needed to define a fan selection in CAPS
 */
export interface CapsSelectionInput {
  /** Equipment mark/tag from schedule (e.g., "EF-1", "TEF-2") */
  mark: string;
  
  /** Quantity of units */
  quantity: number;
  
  /** Performance requirements from engineer schedule */
  performance: PerformanceRequirements;
  
  /** Sizing/Inputs screen configuration */
  sizing: SizingInputs;
  
  /** Electrical/Motor screen configuration */
  electrical: ElectricalMotor;
  
  /** Configuration/Construction screen configuration */
  configuration: ConfigurationConstruction;
}

// ============================================
// CAPS OUTPUT / SELECTION RESULT TYPES
// ============================================

/**
 * Sound Data from selection
 */
export interface SoundData {
  /** Sound level in dBA */
  dba: number;
  
  /** Sound level in sones */
  sones: number;
}

/**
 * CAPS Selection Output
 * Fields from CAPS CSV export after selection is made
 */
export interface CapsSelectionOutput {
  /** Equipment mark from input */
  mark: string;
  
  /** Quantity from input */
  quantity: number;
  
  /** Selected model (e.g., "G-098-VG", "GB-143") */
  model: string;
  
  /** Drive type of selection */
  driveType: 'Direct' | 'Belt';
  
  /** Operating volume in CFM */
  volumeCfm: number;
  
  /** External static pressure */
  externalSP: number;
  
  /** Total external static pressure (with corrections) */
  totalExternalSP: number;
  
  /** Operating fan speed in RPM */
  fanSpeedRpm: number;
  
  /** Outlet velocity in ft/min */
  outletVelocity: number;
  
  /** Inlet sound data */
  inletSound: SoundData;
  
  /** Outlet sound data */
  outletSound: SoundData;
  
  /** Fan Energy Index (when applicable) */
  fei: number | null;
  
  /** Operating power in HP */
  operatingPowerHp: number;
  
  /** Motor size in HP */
  motorSizeHp: string;
  
  /** Fan Electrical Power input in kW */
  fepInputPowerKw: number;
  
  /** Motor enclosure type */
  enclosure: EnclosureType;
  
  /** Voltage rating */
  voltage: Voltage;
  
  /** Frequency (cycle) */
  cycle: '50 Cycle' | '60 Cycle';
  
  /** Phase */
  phase: MotorPhase;
  
  /** Total weight in pounds */
  totalWeightLb: number;
  
  /** EC Motor type (e.g., "VariGreen") */
  ecMotor: string | null;
}

// ============================================
// G/GB SERIES SPECIFIC TYPES
// ============================================

/**
 * G Series Size Codes
 */
export type GSeriesSize = '060' | '070' | '082' | '098' | '103' | '103HP' | 
                          '120' | '123' | '133' | '140' | '143' | '143HP' | 
                          '163' | '163HP' | '183' | '200' | '203';

/**
 * G Series Model with VariGreen
 */
export type GSeriesModel = `G-${GSeriesSize}` | `G-${GSeriesSize}-VG`;

/**
 * GB Series Model
 */
export type GBSeriesModel = `GB-${string}`;

/**
 * Combined fan model type
 */
export type FanModel = GSeriesModel | GBSeriesModel | string;

// ============================================
// DEFAULTS
// ============================================

/**
 * Default sizing inputs for new selections
 */
export const DEFAULT_SIZING_INPUTS: SizingInputs = {
  basic: {
    availableSizes: 'Optimized'
  },
  application: {
    sparkResistance: 'None',
    highWindRated: false,
    seismicRated: false,
    efficiencyCodeReq: false,
    caTitle20Req: false
  },
  advanced: {
    driveType: 'VG Only',
    applyVfd: false,
    speedController: false,
    performanceBaffle: false
  },
  spCorrections: {
    damper: 'None'
  }
};

/**
 * Default electrical configuration
 */
export const DEFAULT_ELECTRICAL: ElectricalMotor = {
  motor: {
    includeMotorDrive: true,
    motorSizeHp: '1/4',
    phase: 1,
    voltage: 115,
    motorDesign: 'NEMA',
    enclosure: 'TENV',
    ulListed: '705',
    efficiencyRating: 'High'
  },
  controlOptions: {
    variGreenControl: 'Remote Dial',
    transformerHoa: 'Transformer Mounted',
    includeBalanceDial: true
  },
  electricalAccessories: {
    disconnectSwitch: false,
    motorStarter: false,
    wiringPigtailAccessory: false
  },
  motorAdvanced: {
    motorMfgLocation: 'No Preference',
    specialMotor: false
  }
};

/**
 * Default configuration options
 */
export const DEFAULT_CONFIGURATION: ConfigurationConstruction = {
  construction: {
    coatings: false,
    hoodHasps: false,
    conduitChaseQty: 1,
    birdscreenMaterial: 'Galvanized',
    fasteners: 'Standard'
  },
  accessories: {
    damper: false,
    unitWarranty: '1 Yr (Standard)',
    specialNameplate: false
  },
  mounting: {
    roofCurbs: false,
    curbExtension: false,
    curbCapAdapter: false,
    hingedCurbCap: 'None',
    curbSeal: false,
    tieDownPoints: false
  }
};
