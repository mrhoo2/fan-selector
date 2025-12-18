/**
 * Schedule Parser
 * 
 * Parses Build Vision extracted equipment data (JSON) and converts
 * to CAPS selection inputs using the spec type mapping system
 * 
 * @version 1.0.0
 * @author Build Vision
 */

import type {
  CapsSelectionInput,
  PerformanceRequirements,
  SizingInputs,
  ElectricalMotor,
  ConfigurationConstruction,
} from '../types/caps-selection.js';

import {
  DEFAULT_SIZING_INPUTS,
  DEFAULT_ELECTRICAL,
  DEFAULT_CONFIGURATION,
} from '../types/caps-selection.js';

import {
  BuildVisionSpecValue,
  SPEC_TYPE_IDS,
  SPEC_TO_CAPS_MAPPING,
  SPEC_TYPE_BY_NAME,
} from '../data/buildvision-spec-mapping.js';

// ============================================
// INPUT TYPES (Build Vision JSON Format)
// ============================================

/**
 * A single equipment item extracted from Build Vision
 */
export interface BuildVisionEquipmentItem {
  /** Unique identifier for this equipment item */
  id?: string;
  
  /** Equipment mark/tag from schedule (e.g., "EF-1", "TEF-2") */
  mark: string;
  
  /** Alternative: tag field */
  tag?: string;
  
  /** Quantity of units */
  quantity?: number;
  
  /** Equipment type/category */
  equipmentType?: string;
  
  /** Manufacturer (if specified) */
  manufacturer?: string;
  
  /** Model number (if specified) */
  model?: string;
  
  /** Array of spec values extracted from the document */
  specs: BuildVisionSpecValue[];
  
  /** Raw notes/remarks (for terminology matching fallback) */
  notes?: string;
  
  /** Source document reference */
  source?: {
    documentId?: string;
    documentName?: string;
    pageNumber?: number;
    tableId?: string;
  };
}

/**
 * Complete Build Vision extraction input
 */
export interface BuildVisionExtractionInput {
  /** Project identifier */
  projectId?: string;
  
  /** Project name */
  projectName?: string;
  
  /** Array of equipment items */
  equipment: BuildVisionEquipmentItem[];
  
  /** Default specs to apply to all items */
  defaults?: BuildVisionSpecValue[];
  
  /** Extraction metadata */
  metadata?: {
    extractedAt?: string;
    extractionVersion?: string;
    confidence?: number;
  };
}

// ============================================
// OUTPUT TYPES
// ============================================

/**
 * Parsed equipment item ready for CAPS
 */
export interface ParsedEquipmentItem {
  /** Original Build Vision ID */
  sourceId?: string;
  
  /** Equipment mark/tag */
  mark: string;
  
  /** Quantity */
  quantity: number;
  
  /** Performance requirements extracted from specs */
  performance: PerformanceRequirements;
  
  /** CAPS-compatible selection input */
  capsInput: CapsSelectionInput;
  
  /** Specs that were successfully mapped */
  mappedSpecs: Array<{
    specTypeId: string;
    specTypeName?: string;
    capsPath: string;
    originalValue: unknown;
    transformedValue: unknown;
  }>;
  
  /** Specs that could not be mapped */
  unmappedSpecs: BuildVisionSpecValue[];
  
  /** Validation warnings */
  warnings: string[];
  
  /** Whether this item has all required fields */
  isComplete: boolean;
}

/**
 * Complete parse result
 */
export interface ScheduleParseResult {
  /** Successfully parsed items */
  items: ParsedEquipmentItem[];
  
  /** Items that failed to parse */
  errors: Array<{
    mark: string;
    error: string;
    originalItem: BuildVisionEquipmentItem;
  }>;
  
  /** Parse statistics */
  stats: {
    totalItems: number;
    successfulParses: number;
    failedParses: number;
    incompleteItems: number;
    totalSpecsMapped: number;
    totalSpecsUnmapped: number;
  };
}

// ============================================
// SCHEDULE PARSER CLASS
// ============================================

export class ScheduleParser {
  private defaultSpecs: BuildVisionSpecValue[] = [];
  
  constructor(defaultSpecs?: BuildVisionSpecValue[]) {
    if (defaultSpecs) {
      this.defaultSpecs = defaultSpecs;
    }
  }
  
  /**
   * Parse a complete Build Vision extraction
   */
  parseExtraction(input: BuildVisionExtractionInput): ScheduleParseResult {
    const items: ParsedEquipmentItem[] = [];
    const errors: ScheduleParseResult['errors'] = [];
    
    // Merge global defaults with any input defaults
    const defaults = [...this.defaultSpecs, ...(input.defaults || [])];
    
    for (const equipment of input.equipment) {
      try {
        const parsed = this.parseEquipmentItem(equipment, defaults);
        items.push(parsed);
      } catch (error) {
        errors.push({
          mark: equipment.mark || equipment.tag || 'UNKNOWN',
          error: error instanceof Error ? error.message : 'Unknown error',
          originalItem: equipment,
        });
      }
    }
    
    // Calculate statistics
    const totalSpecsMapped = items.reduce((sum, item) => sum + item.mappedSpecs.length, 0);
    const totalSpecsUnmapped = items.reduce((sum, item) => sum + item.unmappedSpecs.length, 0);
    
    return {
      items,
      errors,
      stats: {
        totalItems: input.equipment.length,
        successfulParses: items.length,
        failedParses: errors.length,
        incompleteItems: items.filter(i => !i.isComplete).length,
        totalSpecsMapped,
        totalSpecsUnmapped,
      },
    };
  }
  
  /**
   * Parse a single equipment item
   */
  parseEquipmentItem(
    item: BuildVisionEquipmentItem,
    defaults: BuildVisionSpecValue[] = []
  ): ParsedEquipmentItem {
    const warnings: string[] = [];
    const mappedSpecs: ParsedEquipmentItem['mappedSpecs'] = [];
    const unmappedSpecs: BuildVisionSpecValue[] = [];
    
    // Get equipment mark
    const mark = item.mark || item.tag || '';
    if (!mark) {
      throw new Error('Equipment item missing mark/tag identifier');
    }
    
    // Get quantity
    const quantity = item.quantity || 1;
    
    // Combine defaults with item specs (item specs override defaults)
    const allSpecs = this.mergeSpecs(defaults, item.specs);
    
    // Initialize CAPS structures with defaults
    const performance: PerformanceRequirements = { cfm: 0, staticPressure: 0 };
    const sizing = JSON.parse(JSON.stringify(DEFAULT_SIZING_INPUTS)) as SizingInputs;
    const electrical = JSON.parse(JSON.stringify(DEFAULT_ELECTRICAL)) as ElectricalMotor;
    const configuration = JSON.parse(JSON.stringify(DEFAULT_CONFIGURATION)) as ConfigurationConstruction;
    
    // Process each spec value
    for (const spec of allSpecs) {
      const mapping = SPEC_TO_CAPS_MAPPING[spec.specTypeId];
      
      if (mapping) {
        // Apply the transformation
        const transformedValue = mapping.transform(spec.value);
        
        // Set the value at the CAPS path
        this.setNestedValue(
          { performance, sizing, electrical, configuration },
          mapping.capsPath,
          transformedValue
        );
        
        // Apply any additional mappings
        if (mapping.additionalMappings) {
          for (const [path, value] of Object.entries(mapping.additionalMappings)) {
            this.setNestedValue(
              { performance, sizing, electrical, configuration },
              path,
              value
            );
          }
        }
        
        mappedSpecs.push({
          specTypeId: spec.specTypeId,
          specTypeName: spec.specTypeName,
          capsPath: mapping.capsPath,
          originalValue: spec.value,
          transformedValue,
        });
      } else {
        unmappedSpecs.push(spec);
      }
    }
    
    // Validate required fields
    if (performance.cfm === 0) {
      warnings.push('CFM not specified - required for fan selection');
    }
    if (performance.staticPressure === 0) {
      warnings.push('Static Pressure not specified - required for fan selection');
    }
    
    const isComplete = performance.cfm > 0 && performance.staticPressure > 0;
    
    // Build the complete CAPS input
    const capsInput: CapsSelectionInput = {
      mark,
      quantity,
      performance,
      sizing,
      electrical,
      configuration,
    };
    
    return {
      sourceId: item.id,
      mark,
      quantity,
      performance,
      capsInput,
      mappedSpecs,
      unmappedSpecs,
      warnings,
      isComplete,
    };
  }
  
  /**
   * Merge default specs with item specs (item specs take priority)
   */
  private mergeSpecs(
    defaults: BuildVisionSpecValue[],
    itemSpecs: BuildVisionSpecValue[]
  ): BuildVisionSpecValue[] {
    const specMap = new Map<string, BuildVisionSpecValue>();
    
    // Add defaults first
    for (const spec of defaults) {
      specMap.set(spec.specTypeId, spec);
    }
    
    // Override with item specs
    for (const spec of itemSpecs) {
      specMap.set(spec.specTypeId, spec);
    }
    
    return Array.from(specMap.values());
  }
  
  /**
   * Set a value at a dot-notation path in an object
   */
  private setNestedValue(
    obj: Record<string, unknown>,
    path: string,
    value: unknown
  ): void {
    const parts = path.split('.');
    let current: Record<string, unknown> = obj;
    
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!(part in current) || typeof current[part] !== 'object') {
        current[part] = {};
      }
      current = current[part] as Record<string, unknown>;
    }
    
    current[parts[parts.length - 1]] = value;
  }
}

// ============================================
// CONVENIENCE FUNCTIONS
// ============================================

/**
 * Create a spec value from a spec type name and value
 */
export function createSpecValue(
  specTypeName: string,
  value: string | number | boolean,
  options?: {
    unit?: string;
    confidence?: number;
  }
): BuildVisionSpecValue | null {
  const specTypeId = SPEC_TYPE_BY_NAME[specTypeName];
  
  if (!specTypeId) {
    console.warn(`Unknown spec type name: ${specTypeName}`);
    return null;
  }
  
  return {
    specTypeId,
    specTypeName,
    value,
    unit: options?.unit,
    confidence: options?.confidence,
  };
}

/**
 * Create spec values from a simple key-value object
 */
export function createSpecsFromObject(
  obj: Record<string, string | number | boolean>
): BuildVisionSpecValue[] {
  const specs: BuildVisionSpecValue[] = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const spec = createSpecValue(key, value);
    if (spec) {
      specs.push(spec);
    }
  }
  
  return specs;
}

/**
 * Quick parse function for simple use cases
 */
export function parseEquipmentList(
  items: BuildVisionEquipmentItem[]
): ScheduleParseResult {
  const parser = new ScheduleParser();
  return parser.parseExtraction({ equipment: items });
}

// ============================================
// EXAMPLE USAGE / TYPE GUARDS
// ============================================

/**
 * Validate that an object conforms to BuildVisionEquipmentItem
 */
export function isValidEquipmentItem(obj: unknown): obj is BuildVisionEquipmentItem {
  if (typeof obj !== 'object' || obj === null) return false;
  
  const item = obj as Record<string, unknown>;
  
  // Must have mark or tag
  if (!item.mark && !item.tag) return false;
  
  // Must have specs array
  if (!Array.isArray(item.specs)) return false;
  
  return true;
}

/**
 * Validate extraction input
 */
export function isValidExtractionInput(obj: unknown): obj is BuildVisionExtractionInput {
  if (typeof obj !== 'object' || obj === null) return false;
  
  const input = obj as Record<string, unknown>;
  
  // Must have equipment array
  if (!Array.isArray(input.equipment)) return false;
  
  // All equipment items must be valid
  return input.equipment.every(isValidEquipmentItem);
}

// ============================================
// RE-EXPORT SPEC TYPE IDS FOR CONVENIENCE
// ============================================

export { SPEC_TYPE_IDS, SPEC_TYPE_BY_NAME } from '../data/buildvision-spec-mapping.js';
