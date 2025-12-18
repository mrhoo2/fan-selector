/**
 * Greenheck CAPS Integration
 * 
 * Build Vision integration with Greenheck CAPS fan selection software
 * 
 * @module greenheck-caps-integration
 * @version 1.0.0
 * @author Build Vision
 */

// ============================================
// TYPE EXPORTS
// ============================================

// CAPS Selection Types
export type {
  SparkResistanceType,
  DriveType,
  MotorPhase,
  Voltage,
  MotorDesign,
  EnclosureType,
  EfficiencyRating,
  DisconnectEnclosureRating,
  DisconnectProtection,
  DisconnectType,
  BirdscreenMaterial,
  FastenerType,
  WarrantyType,
  DamperBladeAction,
  ActuatorType,
  DamperMountingType,
  VariGreenControlType,
  TransformerHoaType,
  MotorMfgLocation,
  BasicInputs,
  ApplicationInputs,
  AdvancedInputs,
  StaticPressureCorrections,
  SizingInputs,
  MotorConfig,
  ControlOptions,
  ElectricalAccessories,
  DisconnectSwitchOptions,
  MotorAdvancedOptions,
  ElectricalMotor,
  ConstructionOptions,
  GeneralAccessories,
  DamperOptions,
  MountingAccessories,
  ConfigurationConstruction,
  PerformanceRequirements,
  CapsSelectionInput,
  SoundData,
  CapsSelectionOutput,
  GSeriesSize,
  GSeriesModel,
  GBSeriesModel,
  FanModel,
} from './types/caps-selection.js';

// Terminology Types
export type {
  VoltagePhaseMapping,
  ElectricalMappings,
  DisconnectMapping,
  DisconnectMappings,
  DamperMapping,
  DamperMappings,
  ConstructionSpecial,
  ConstructionMappings,
  DriveTypeMappings,
  MountingCurbMapping,
  MountingTieDownMapping,
  MountingMappings,
  VfdMapping,
  ControlMappings,
  ElectricalAccessoryMapping,
  SecurityMapping,
  AccessoryMappings,
  EquipmentTagMappings,
  FanSeriesInfo,
  FanSeriesMappings,
  DictionaryMetadata,
  TerminologyDictionary,
  TerminologyMatch,
  NotesParseResult,
  FlattenedTerm,
  TerminologySearchOptions,
} from './types/terminology.js';

// Build Vision Spec Types
export type {
  BuildVisionSpecType,
  BuildVisionSpecValue,
  CapsFieldMapping,
  SpecTypeId,
} from './data/buildvision-spec-mapping.js';

// Parser Types
export type {
  BuildVisionEquipmentItem,
  BuildVisionExtractionInput,
  ParsedEquipmentItem,
  ScheduleParseResult,
} from './extraction/schedule-parser.js';

// Export Types
export type {
  CsvOptions,
  CapsInputRow,
} from './export/caps-clipboard.js';

// ============================================
// VALUE EXPORTS
// ============================================

// Default configurations
export {
  DEFAULT_SIZING_INPUTS,
  DEFAULT_ELECTRICAL,
  DEFAULT_CONFIGURATION,
} from './types/caps-selection.js';

// Spec type mappings
export {
  SPEC_TYPE_IDS,
  SPEC_TYPE_BY_NAME,
  SPEC_TO_CAPS_MAPPING,
} from './data/buildvision-spec-mapping.js';

// ============================================
// CLASS EXPORTS
// ============================================

// Schedule Parser
export { ScheduleParser } from './extraction/schedule-parser.js';

// ============================================
// FUNCTION EXPORTS
// ============================================

// Parser functions
export {
  createSpecValue,
  createSpecsFromObject,
  parseEquipmentList,
  isValidEquipmentItem,
  isValidExtractionInput,
} from './extraction/schedule-parser.js';

// Export functions
export {
  generateCapsInputCsv,
  generateCapsOutputCsv,
  toJsonExport,
  toInputRows,
  parseCapsOutputCsv,
  CAPS_EXPORT_COLUMNS,
  CAPS_INPUT_COLUMNS,
} from './export/caps-clipboard.js';
