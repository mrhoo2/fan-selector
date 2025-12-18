/**
 * Terminology Dictionary Types
 * 
 * Type definitions for the terminology dictionary that maps
 * engineer specification notes to CAPS options
 * 
 * @version 1.0.0
 * @author Build Vision
 */

import type { 
  Voltage, 
  MotorPhase, 
  EnclosureType, 
  EfficiencyRating,
  DisconnectEnclosureRating,
  DisconnectProtection,
  SparkResistanceType,
  BirdscreenMaterial,
  FastenerType,
  DriveType,
  ActuatorType,
  DamperBladeAction,
  VariGreenControlType,
  WarrantyType
} from './caps-selection.js';

// ============================================
// ELECTRICAL MAPPINGS
// ============================================

export interface VoltagePhaseMapping {
  voltage: Voltage;
  phase: MotorPhase;
  frequency: 50 | 60;
}

export interface ElectricalMappings {
  voltagePhase: Record<string, VoltagePhaseMapping>;
  enclosure: Record<string, EnclosureType>;
  efficiency: Record<string, EfficiencyRating>;
}

// ============================================
// DISCONNECT MAPPINGS
// ============================================

export interface DisconnectMapping {
  disconnectSwitch: boolean;
  enclosureRating?: DisconnectEnclosureRating;
  protection?: DisconnectProtection;
}

export interface DisconnectMappings {
  variations: Record<string, DisconnectMapping>;
  enclosureRatings: Record<string, DisconnectEnclosureRating>;
}

// ============================================
// DAMPER MAPPINGS
// ============================================

export interface DamperMapping {
  damper: boolean;
  actuatorType?: ActuatorType;
  bladeAction?: DamperBladeAction;
  damperMounting?: 'Loose' | 'Factory Mounted';
}

export interface DamperMappings {
  variations: Record<string, DamperMapping>;
  models: Record<string, string>;
}

// ============================================
// CONSTRUCTION MAPPINGS
// ============================================

export interface ConstructionSpecial {
  highWindRated?: boolean;
  seismicRated?: boolean;
}

export interface ConstructionMappings {
  sparkResistance: Record<string, SparkResistanceType>;
  special: Record<string, ConstructionSpecial>;
  coatings: Record<string, boolean>;
  birdscreen: Record<string, BirdscreenMaterial>;
  fasteners: Record<string, FastenerType>;
}

// ============================================
// DRIVE TYPE MAPPINGS
// ============================================

export interface DriveTypeMappings {
  variations: Record<string, DriveType>;
}

// ============================================
// MOUNTING MAPPINGS
// ============================================

export interface MountingCurbMapping {
  roofCurbs?: boolean;
  curbExtension?: boolean;
  curbSeal?: boolean;
  curbCapAdapter?: boolean;
  hingedCurbCap?: string;
}

export interface MountingTieDownMapping {
  tieDownPoints: boolean;
  seismicRated?: boolean;
}

export interface MountingMappings {
  curb: Record<string, MountingCurbMapping>;
  tieDown: Record<string, MountingTieDownMapping>;
}

// ============================================
// CONTROL MAPPINGS
// ============================================

export interface VfdMapping {
  applyVfd: boolean;
}

export interface ControlMappings {
  variGreen: Record<string, VariGreenControlType>;
  vfd: Record<string, VfdMapping>;
}

// ============================================
// ACCESSORY MAPPINGS
// ============================================

export interface ElectricalAccessoryMapping {
  motorStarter?: boolean;
  wiringPigtailAccessory?: boolean;
  conduitChaseQty?: number;
}

export interface SecurityMapping {
  hoodHasps: boolean;
}

export interface AccessoryMappings {
  electrical: Record<string, ElectricalAccessoryMapping>;
  security: Record<string, SecurityMapping>;
  warranty: Record<string, WarrantyType>;
}

// ============================================
// EQUIPMENT TAG MAPPINGS
// ============================================

export interface EquipmentTagMappings {
  prefixes: Record<string, string>;
}

// ============================================
// FAN SERIES INFO
// ============================================

export interface FanSeriesInfo {
  description: string;
  driveType: 'Direct' | 'Belt';
  greenheckModel: string;
  accurexModel: string;
}

export interface FanSeriesMappings {
  [seriesCode: string]: FanSeriesInfo;
}

// ============================================
// DICTIONARY METADATA
// ============================================

export interface DictionaryMetadata {
  version: string;
  lastUpdated: string;
  description: string;
  notes: string[];
}

// ============================================
// COMPLETE DICTIONARY TYPE
// ============================================

export interface TerminologyDictionary {
  $schema?: string;
  $comment?: string;
  electrical: ElectricalMappings;
  disconnect: DisconnectMappings;
  damper: DamperMappings;
  construction: ConstructionMappings;
  driveType: DriveTypeMappings;
  mounting: MountingMappings;
  controls: ControlMappings;
  accessories: AccessoryMappings;
  equipmentTags: EquipmentTagMappings;
  fanSeries: FanSeriesMappings;
  _metadata: DictionaryMetadata;
}

// ============================================
// MATCH RESULT TYPES
// ============================================

/**
 * Result from terminology lookup
 */
export interface TerminologyMatch {
  /** The original text that was matched */
  matchedText: string;
  
  /** The category in the dictionary where match was found */
  category: keyof TerminologyDictionary;
  
  /** Sub-category within the main category */
  subCategory?: string;
  
  /** The CAPS field(s) and value(s) to set */
  capsMapping: Record<string, unknown>;
  
  /** Confidence score 0-1 (1 = exact match) */
  confidence: number;
}

/**
 * Result from parsing a notes/remarks field
 */
export interface NotesParseResult {
  /** All terminology matches found */
  matches: TerminologyMatch[];
  
  /** Text segments that were not matched */
  unmatchedSegments: string[];
  
  /** Combined CAPS options from all matches */
  combinedOptions: Record<string, unknown>;
}

// ============================================
// UTILITY TYPES
// ============================================

/**
 * Flattened view of all searchable terms
 */
export interface FlattenedTerm {
  term: string;
  category: string;
  subCategory: string;
  value: unknown;
}

/**
 * Search options for terminology lookup
 */
export interface TerminologySearchOptions {
  /** Case-insensitive matching (default: true) */
  caseInsensitive?: boolean;
  
  /** Allow partial/fuzzy matching (default: false) */
  fuzzyMatch?: boolean;
  
  /** Minimum confidence for fuzzy matches (default: 0.8) */
  minFuzzyConfidence?: number;
  
  /** Categories to search (default: all) */
  categories?: (keyof TerminologyDictionary)[];
}
