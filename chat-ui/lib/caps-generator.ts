/**
 * CAPS Generator
 * 
 * Parses AI responses to extract fan parameters and generates CAPS-compatible
 * clipboard CSV for import into Greenheck CAPS software.
 * 
 * @version 1.0.0
 */

// ============================================
// TYPES
// ============================================

/**
 * Fan selection parameters extracted from AI response
 * Supports both flat format (legacy) and nested format (new)
 */
export interface FanSelection {
  // Core
  mark?: string;
  quantity?: number;
  model?: string;
  series?: 'G' | 'GB';
  size?: string;
  
  // Performance
  cfm: number;
  staticPressure: number;
  elevation?: number;
  temperature?: number;
  
  // Electrical
  voltage?: number;
  phase?: number;
  frequency?: number;
  motorHp?: string;
  motorDesign?: string;
  enclosure?: string;
  ulListed?: string;
  efficiencyRating?: string;
  
  // VariGreen Control
  variGreenControl?: string;
  transformerHoa?: string;
  includeBalanceDial?: boolean;
  
  // Electrical Accessories
  disconnectSwitch?: boolean;
  motorStarter?: boolean;
  wiringPigtail?: boolean;
  disconnectRating?: string;
  disconnectProtection?: string;
  disconnectType?: string;
  motorMfgLocation?: string;
  specialMotor?: boolean;
  
  // Sizing
  availableSizes?: string;
  sparkResistance?: string;
  highWindRated?: boolean;
  seismicRated?: boolean;
  efficiencyCodeReq?: boolean;
  caTitle20Req?: boolean;
  driveType?: 'Direct' | 'Belt' | 'VariGreen' | 'VG Only' | 'Any';
  applyVfd?: boolean;
  speedController?: boolean;
  performanceBaffle?: boolean;
  damperSpCorrection?: string;
  
  // Configuration - Construction
  coatings?: boolean | string;
  hoodHasps?: boolean;
  conduitChaseQty?: number;
  birdscreenMaterial?: string;
  fasteners?: string;
  
  // Configuration - Accessories
  damper?: boolean;
  damperActuator?: string;
  damperMounting?: string;
  damperBladeAction?: string;
  unitWarranty?: string;
  specialNameplate?: boolean;
  
  // Configuration - Mounting
  roofCurbs?: boolean;
  curbExtension?: boolean;
  curbCapAdapter?: boolean;
  hingedCurbCap?: string;
  curbSeal?: boolean;
  tieDownPoints?: boolean;
  
  // Legacy fields (backward compatibility)
  backdraftDamper?: boolean;
  disconnect?: boolean;
}

/**
 * Result of parsing an AI response
 */
export interface ParseResult {
  /** Whether fan selection data was found */
  found: boolean;
  /** Extracted fan selections */
  selections: FanSelection[];
  /** Generated CAPS clipboard CSV (tab-delimited) */
  capsClipboard: string | null;
  /** Original JSON found in response (for debugging) */
  rawJson?: string;
}

// ============================================
// PARSING
// ============================================

/**
 * Parse AI response to extract fan selection data
 * Looks for JSON code blocks with caps data
 */
export function parseAiResponse(content: string): ParseResult {
  const result: ParseResult = {
    found: false,
    selections: [],
    capsClipboard: null,
  };

  // Look for JSON code blocks (```json or ```json:caps or ```caps)
  const jsonBlockRegex = /```(?:json(?::caps)?|caps)\s*([\s\S]*?)```/gi;
  const matches = content.matchAll(jsonBlockRegex);

  for (const match of matches) {
    try {
      const jsonStr = match[1].trim();
      const parsed = JSON.parse(jsonStr);
      result.rawJson = jsonStr;

      // Handle array or single object
      const selectionsData = Array.isArray(parsed) ? parsed : [parsed];
      
      for (const data of selectionsData) {
        const selection = normalizeSelection(data);
        if (isValidSelection(selection)) {
          result.selections.push(selection);
          result.found = true;
        }
      }
    } catch {
      // Try fallback parsing for non-JSON format
      const fallbackSelection = parseFallbackFormat(content);
      if (fallbackSelection) {
        result.selections.push(fallbackSelection);
        result.found = true;
      }
    }
  }

  // If no JSON blocks found, try to extract from markdown tables or text
  if (!result.found) {
    const tableSelection = parseMarkdownTable(content);
    if (tableSelection) {
      result.selections.push(tableSelection);
      result.found = true;
    }
  }

  // Generate CAPS clipboard if selections found
  if (result.found && result.selections.length > 0) {
    result.capsClipboard = generateCapsClipboard(result.selections);
  }

  return result;
}

/**
 * Normalize selection data from various formats
 * Handles both flat format and nested format (performance, sizing, electrical, configuration, selection)
 */
function normalizeSelection(data: Record<string, unknown>): FanSelection {
  // Extract nested objects if present
  const performance = (data.performance as Record<string, unknown>) || {};
  const sizing = (data.sizing as Record<string, unknown>) || {};
  const electrical = (data.electrical as Record<string, unknown>) || {};
  const configuration = (data.configuration as Record<string, unknown>) || {};
  const selection = (data.selection as Record<string, unknown>) || {};
  
  // Merge all sources for lookups
  const allData = { ...data, ...performance, ...sizing, ...electrical, ...configuration, ...selection };
  
  return {
    // Core
    mark: getString(data, ['mark', 'tag', 'Mark', 'Tag']),
    quantity: getNumber(data, ['quantity', 'qty', 'Quantity', 'Qty']) || 1,
    model: getString(allData, ['model', 'Model']),
    series: getSeriesFromData(allData),
    size: getString(allData, ['size', 'Size', 'designatedSize', 'DesignatedSize']),
    
    // Performance
    cfm: getNumber(allData, ['cfm', 'CFM', 'airflow', 'Airflow', 'volume', 'Volume']) || 0,
    staticPressure: getNumber(allData, ['staticPressure', 'sp', 'SP', 'StaticPressure', 'static_pressure', 'externalSP']) || 0,
    elevation: getNumber(allData, ['elevation', 'Elevation', 'altitude']),
    temperature: getNumber(allData, ['temperature', 'temp', 'Temperature', 'Temp']),
    
    // Electrical
    voltage: getNumber(allData, ['voltage', 'Voltage', 'volts', 'Volts']),
    phase: getNumber(allData, ['phase', 'Phase', 'phases']),
    frequency: getNumber(allData, ['frequency', 'freq', 'Frequency', 'Freq', 'hz', 'Hz']) || 60,
    motorHp: getString(allData, ['motorHp', 'motorHP', 'MotorHP', 'motor_hp', 'hp', 'HP', 'horsepower']),
    motorDesign: getString(allData, ['motorDesign', 'MotorDesign']),
    enclosure: getString(allData, ['enclosure', 'Enclosure', 'motorEnclosure']),
    ulListed: getString(allData, ['ulListed', 'ULListed', 'ul']),
    efficiencyRating: getString(allData, ['efficiencyRating', 'EfficiencyRating', 'efficiency']),
    
    // VariGreen Control
    variGreenControl: getString(allData, ['variGreenControl', 'VariGreenControl', 'vgControl']),
    transformerHoa: getString(allData, ['transformerHoa', 'TransformerHoa', 'transformer']),
    includeBalanceDial: getBoolean(allData, ['includeBalanceDial', 'balanceDial']),
    
    // Electrical Accessories
    disconnectSwitch: getBoolean(allData, ['disconnectSwitch', 'DisconnectSwitch', 'disconnect', 'Disconnect']),
    motorStarter: getBoolean(allData, ['motorStarter', 'MotorStarter']),
    wiringPigtail: getBoolean(allData, ['wiringPigtail', 'WiringPigtail']),
    disconnectRating: getString(allData, ['disconnectRating', 'DisconnectRating']),
    disconnectProtection: getString(allData, ['disconnectProtection', 'DisconnectProtection']),
    disconnectType: getString(allData, ['disconnectType', 'DisconnectType']),
    motorMfgLocation: getString(allData, ['motorMfgLocation', 'MotorMfgLocation']),
    specialMotor: getBoolean(allData, ['specialMotor', 'SpecialMotor']),
    
    // Sizing
    availableSizes: getString(allData, ['availableSizes', 'AvailableSizes']),
    sparkResistance: getString(allData, ['sparkResistance', 'SparkResistance']),
    highWindRated: getBoolean(allData, ['highWindRated', 'HighWindRated', 'highWind']),
    seismicRated: getBoolean(allData, ['seismicRated', 'SeismicRated', 'seismic']),
    efficiencyCodeReq: getBoolean(allData, ['efficiencyCodeReq', 'EfficiencyCodeReq']),
    caTitle20Req: getBoolean(allData, ['caTitle20Req', 'CaTitle20Req', 'title20']),
    driveType: getDriveType(allData),
    applyVfd: getBoolean(allData, ['applyVfd', 'ApplyVfd', 'vfd']),
    speedController: getBoolean(allData, ['speedController', 'SpeedController']),
    performanceBaffle: getBoolean(allData, ['performanceBaffle', 'PerformanceBaffle']),
    damperSpCorrection: getString(allData, ['damperSpCorrection', 'DamperSpCorrection']),
    
    // Configuration - Construction
    coatings: getBoolean(allData, ['coatings', 'Coatings', 'coating']),
    hoodHasps: getBoolean(allData, ['hoodHasps', 'HoodHasps']),
    conduitChaseQty: getNumber(allData, ['conduitChaseQty', 'ConduitChaseQty']),
    birdscreenMaterial: getString(allData, ['birdscreenMaterial', 'BirdscreenMaterial', 'birdscreen']),
    fasteners: getString(allData, ['fasteners', 'Fasteners']),
    
    // Configuration - Accessories
    damper: getBoolean(allData, ['damper', 'Damper', 'backdraftDamper', 'BackdraftDamper']),
    damperActuator: getString(allData, ['damperActuator', 'DamperActuator', 'actuator']),
    damperMounting: getString(allData, ['damperMounting', 'DamperMounting']),
    damperBladeAction: getString(allData, ['damperBladeAction', 'DamperBladeAction', 'bladeAction']),
    unitWarranty: getString(allData, ['unitWarranty', 'UnitWarranty', 'warranty']),
    specialNameplate: getBoolean(allData, ['specialNameplate', 'SpecialNameplate']),
    
    // Configuration - Mounting
    roofCurbs: getBoolean(allData, ['roofCurbs', 'RoofCurbs', 'curb']),
    curbExtension: getBoolean(allData, ['curbExtension', 'CurbExtension']),
    curbCapAdapter: getBoolean(allData, ['curbCapAdapter', 'CurbCapAdapter']),
    hingedCurbCap: getString(allData, ['hingedCurbCap', 'HingedCurbCap']),
    curbSeal: getBoolean(allData, ['curbSeal', 'CurbSeal']),
    tieDownPoints: getBoolean(allData, ['tieDownPoints', 'TieDownPoints']),
    
    // Legacy compatibility
    backdraftDamper: getBoolean(allData, ['backdraftDamper', 'BackdraftDamper', 'damper', 'Damper']),
    disconnect: getBoolean(allData, ['disconnect', 'Disconnect', 'disconnectSwitch', 'DisconnectSwitch']),
  };
}

/**
 * Get string value from object with multiple possible keys
 */
function getString(data: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    if (data[key] !== undefined && data[key] !== null) {
      return String(data[key]);
    }
  }
  return undefined;
}

/**
 * Get number value from object with multiple possible keys
 */
function getNumber(data: Record<string, unknown>, keys: string[]): number | undefined {
  for (const key of keys) {
    const val = data[key];
    if (val !== undefined && val !== null) {
      const num = typeof val === 'number' ? val : parseFloat(String(val));
      if (!isNaN(num)) return num;
    }
  }
  return undefined;
}

/**
 * Get boolean value from object with multiple possible keys
 */
function getBoolean(data: Record<string, unknown>, keys: string[]): boolean | undefined {
  for (const key of keys) {
    const val = data[key];
    if (val !== undefined && val !== null) {
      if (typeof val === 'boolean') return val;
      if (typeof val === 'string') {
        const lower = val.toLowerCase();
        if (['yes', 'true', '1', 'y'].includes(lower)) return true;
        if (['no', 'false', '0', 'n', 'none'].includes(lower)) return false;
      }
    }
  }
  return undefined;
}

/**
 * Extract series (G or GB) from data
 */
function getSeriesFromData(data: Record<string, unknown>): 'G' | 'GB' | undefined {
  const series = getString(data, ['series', 'Series', 'productSeries']);
  if (series === 'G' || series === 'GB') return series;
  
  // Try to extract from model
  const model = getString(data, ['model', 'Model']);
  if (model) {
    if (model.startsWith('GB')) return 'GB';
    if (model.startsWith('G')) return 'G';
  }
  
  // Infer from drive type
  const driveType = getDriveType(data);
  if (driveType === 'Belt') return 'GB';
  if (driveType === 'Direct' || driveType === 'VariGreen') return 'G';
  
  return undefined;
}

/**
 * Extract drive type from data
 */
function getDriveType(data: Record<string, unknown>): 'Direct' | 'Belt' | 'VariGreen' | undefined {
  const drive = getString(data, ['driveType', 'DriveType', 'drive', 'Drive', 'drive_type']);
  if (!drive) return undefined;
  
  const lower = drive.toLowerCase();
  if (lower.includes('belt')) return 'Belt';
  if (lower.includes('varigreen') || lower.includes('vg') || lower.includes('variable')) return 'VariGreen';
  if (lower.includes('direct')) return 'Direct';
  
  return undefined;
}

/**
 * Check if selection has minimum required data
 */
function isValidSelection(selection: FanSelection): boolean {
  return selection.cfm > 0 && selection.staticPressure > 0;
}

/**
 * Fallback parsing for non-JSON structured content
 */
function parseFallbackFormat(content: string): FanSelection | null {
  const selection: Partial<FanSelection> = {};
  
  // Extract CFM
  const cfmMatch = content.match(/(\d+(?:,\d+)?)\s*(?:CFM|cfm)/);
  if (cfmMatch) {
    selection.cfm = parseInt(cfmMatch[1].replace(',', ''));
  }
  
  // Extract Static Pressure
  const spMatch = content.match(/(\d+(?:\.\d+)?)\s*(?:"|in\.?\s*(?:wg|WG|w\.?g\.?)|inches?\s*(?:wg|WG|water))/);
  if (spMatch) {
    selection.staticPressure = parseFloat(spMatch[1]);
  }
  
  // Extract Voltage
  const voltMatch = content.match(/(\d{3})\s*(?:V|v|volt)/i);
  if (voltMatch) {
    selection.voltage = parseInt(voltMatch[1]);
  }
  
  // Extract Phase
  const phaseMatch = content.match(/(\d)\s*(?:-?\s*)?phase/i);
  if (phaseMatch) {
    selection.phase = parseInt(phaseMatch[1]);
  }
  
  // Extract Model
  const modelMatch = content.match(/\b(G[B]?-\d{2,3}(?:HP)?(?:-VG)?)\b/);
  if (modelMatch) {
    selection.model = modelMatch[1];
    selection.series = modelMatch[1].startsWith('GB') ? 'GB' : 'G';
  }
  
  // Extract Drive Type
  if (content.toLowerCase().includes('belt drive')) {
    selection.driveType = 'Belt';
    selection.series = 'GB';
  } else if (content.toLowerCase().includes('varigreen') || content.toLowerCase().includes('vg')) {
    selection.driveType = 'VariGreen';
    selection.series = 'G';
  } else if (content.toLowerCase().includes('direct drive')) {
    selection.driveType = 'Direct';
    selection.series = 'G';
  }
  
  // Check if we have minimum required data
  if (selection.cfm && selection.staticPressure) {
    return {
      cfm: selection.cfm,
      staticPressure: selection.staticPressure,
      voltage: selection.voltage,
      phase: selection.phase,
      model: selection.model,
      series: selection.series,
      driveType: selection.driveType,
      quantity: 1,
    };
  }
  
  return null;
}

/**
 * Parse markdown table for fan parameters
 */
function parseMarkdownTable(content: string): FanSelection | null {
  // Look for tables with CFM and SP columns
  const tableRowRegex = /\|\s*(?:CFM|Airflow)\s*\|\s*(\d+(?:,\d+)?)\s*\|/gi;
  const cfmMatch = content.match(/\|\s*(\d+(?:,\d+)?)\s*\|.*?(?:CFM|cfm)/);
  
  if (cfmMatch) {
    return parseFallbackFormat(content);
  }
  
  return null;
}

// ============================================
// CAPS CSV GENERATION
// ============================================

/**
 * CAPS input column headers - Extended with all fields
 */
const CAPS_HEADERS_EXTENDED = [
  // Core
  'Mark',
  'Quantity',
  'Series',
  'Size',
  'Model',
  // Performance
  'CFM',
  'SP',
  'Elevation',
  'Temperature',
  // Electrical
  'Voltage',
  'Phase',
  'Frequency',
  'Motor HP',
  'Motor Design',
  'Enclosure',
  'UL Listed',
  'Efficiency Rating',
  // VariGreen
  'VG Control',
  'Transformer HOA',
  'Balance Dial',
  // Electrical Accessories
  'Disconnect',
  'Disconnect Rating',
  'Disconnect Protection',
  'Disconnect Type',
  'Motor Starter',
  'Wiring Pigtail',
  'Motor Mfg Location',
  'Special Motor',
  // Sizing Options
  'Available Sizes',
  'Spark Resistance',
  'High Wind',
  'Seismic',
  'Efficiency Code',
  'CA Title 20',
  'Drive Type',
  'Apply VFD',
  'Speed Controller',
  'Performance Baffle',
  'Damper SP Correction',
  // Construction
  'Coatings',
  'Hood Hasps',
  'Conduit Chase Qty',
  'Birdscreen Material',
  'Fasteners',
  // Accessories
  'Damper',
  'Damper Actuator',
  'Damper Mounting',
  'Blade Action',
  'Warranty',
  'Special Nameplate',
  // Mounting
  'Roof Curbs',
  'Curb Extension',
  'Curb Cap Adapter',
  'Hinged Curb Cap',
  'Curb Seal',
  'Tie Down Points',
];

/**
 * Basic CAPS headers for simple clipboard export
 */
const CAPS_HEADERS_BASIC = [
  'Mark',
  'Quantity', 
  'CFM',
  'SP',
  'Voltage',
  'Phase',
  'Frequency',
  'Drive Type',
  'Motor HP',
  'Enclosure',
  'Series',
  'Size',
  'Backdraft Damper',
  'Disconnect',
  'Elevation',
  'Temperature',
];

/**
 * Generate CAPS-compatible clipboard CSV from selections
 * Uses EXTENDED format with ALL input fields for complete export
 */
export function generateCapsClipboard(selections: FanSelection[]): string {
  // Use extended format to include all input fields
  return generateCapsClipboardExtended(selections);
}

/**
 * Generate extended CAPS CSV with ALL fields
 * For complete export and documentation
 */
export function generateCapsClipboardExtended(selections: FanSelection[]): string {
  const lines: string[] = [];
  
  // Add header row
  lines.push(CAPS_HEADERS_EXTENDED.join('\t'));
  
  // Add data rows
  for (let i = 0; i < selections.length; i++) {
    const sel = selections[i];
    const row = [
      // Core
      sel.mark || `EF-${i + 1}`,
      String(sel.quantity || 1),
      sel.series || inferSeries(sel),
      sel.size || '',
      sel.model || '',
      // Performance
      String(sel.cfm),
      String(sel.staticPressure),
      String(sel.elevation || 0),
      String(sel.temperature || 70),
      // Electrical
      String(sel.voltage || 460),
      String(sel.phase || 3),
      String(sel.frequency || 60),
      sel.motorHp || '',
      sel.motorDesign || 'NEMA',
      sel.enclosure || 'TEFC',
      sel.ulListed || '705',
      sel.efficiencyRating || 'High',
      // VariGreen
      sel.variGreenControl || 'None',
      sel.transformerHoa || 'None',
      sel.includeBalanceDial ? 'Yes' : 'No',
      // Electrical Accessories
      (sel.disconnect || sel.disconnectSwitch) ? 'Yes' : 'No',
      sel.disconnectRating || 'NEMA-1',
      sel.disconnectProtection || 'None',
      sel.disconnectType || 'Toggle',
      sel.motorStarter ? 'Yes' : 'No',
      sel.wiringPigtail ? 'Yes' : 'No',
      sel.motorMfgLocation || 'No Preference',
      sel.specialMotor ? 'Yes' : 'No',
      // Sizing Options
      sel.availableSizes || 'Optimized',
      sel.sparkResistance || 'None',
      sel.highWindRated ? 'Yes' : 'No',
      sel.seismicRated ? 'Yes' : 'No',
      sel.efficiencyCodeReq ? 'Yes' : 'No',
      sel.caTitle20Req ? 'Yes' : 'No',
      sel.driveType || inferDriveType(sel),
      sel.applyVfd ? 'Yes' : 'No',
      sel.speedController ? 'Yes' : 'No',
      sel.performanceBaffle ? 'Yes' : 'No',
      sel.damperSpCorrection || 'None',
      // Construction
      sel.coatings ? 'Yes' : 'No',
      sel.hoodHasps ? 'Yes' : 'No',
      String(sel.conduitChaseQty || 1),
      sel.birdscreenMaterial || 'Galvanized',
      sel.fasteners || 'Standard',
      // Accessories
      (sel.damper || sel.backdraftDamper) ? 'Yes' : 'No',
      sel.damperActuator || 'Gravity',
      sel.damperMounting || 'Factory',
      sel.damperBladeAction || 'Parallel',
      sel.unitWarranty || '1 Yr',
      sel.specialNameplate ? 'Yes' : 'No',
      // Mounting
      sel.roofCurbs ? 'Yes' : 'No',
      sel.curbExtension ? 'Yes' : 'No',
      sel.curbCapAdapter ? 'Yes' : 'No',
      sel.hingedCurbCap || 'None',
      sel.curbSeal ? 'Yes' : 'No',
      sel.tieDownPoints ? 'Yes' : 'No',
    ];
    lines.push(row.join('\t'));
  }
  
  return lines.join('\r\n');
}

/**
 * Generate JSON export with all fields (flat format)
 */
export function generateJsonExport(selections: FanSelection[]): string {
  return JSON.stringify(selections, null, 2);
}

/**
 * Structured JSON format organized by CAPS UI screens
 * This format matches the native Windows CAPS application layout
 */
export interface StructuredCapsInput {
  mark: string;
  quantity: number;
  
  // Screen 1: Sizing / Inputs
  sizing: {
    basicInputs: {
      cfm: number;
      staticPressure: number;
      elevation: number;
      temperature: number;
      availableSizes: string;
    };
    applicationInputs: {
      sparkResistance: string;
      highWindRated: boolean;
      seismicRated: boolean;
      efficiencyCodeReq: boolean;
      caTitle20Req: boolean;
    };
    advancedInputs: {
      driveType: string;
      applyVfd: boolean;
      speedController: boolean;
      performanceBaffle: boolean;
      damperSpCorrection: string;
    };
  };
  
  // Screen 2: Electrical / Motor
  electrical: {
    motor: {
      voltage: number;
      phase: number;
      frequency: number;
      motorHp: string;
      motorDesign: string;
      enclosure: string;
      ulListed: string;
      efficiencyRating: string;
    };
    variGreenControl: {
      variGreenControl: string;
      transformerHoa: string;
      includeBalanceDial: boolean;
    };
    electricalAccessories: {
      disconnectSwitch: boolean;
      disconnectRating: string;
      disconnectProtection: string;
      disconnectType: string;
      motorStarter: boolean;
      wiringPigtail: boolean;
      motorMfgLocation: string;
      specialMotor: boolean;
    };
  };
  
  // Screen 3: Configuration / Construction
  configuration: {
    construction: {
      coatings: boolean;
      hoodHasps: boolean;
      conduitChaseQty: number;
      birdscreenMaterial: string;
      fasteners: string;
    };
    accessories: {
      damper: boolean;
      damperActuator: string;
      damperMounting: string;
      damperBladeAction: string;
      unitWarranty: string;
      specialNameplate: boolean;
    };
    mounting: {
      roofCurbs: boolean;
      curbExtension: boolean;
      curbCapAdapter: boolean;
      hingedCurbCap: string;
      curbSeal: boolean;
      tieDownPoints: boolean;
    };
  };
  
  // Selection Output
  selection: {
    series: string;
    size: string;
    model: string;
  };
}

/**
 * Convert flat FanSelection to structured CAPS input format
 */
export function toStructuredCapsInput(sel: FanSelection, index: number = 0): StructuredCapsInput {
  return {
    mark: sel.mark || `EF-${index + 1}`,
    quantity: sel.quantity || 1,
    
    sizing: {
      basicInputs: {
        cfm: sel.cfm,
        staticPressure: sel.staticPressure,
        elevation: sel.elevation || 0,
        temperature: sel.temperature || 70,
        availableSizes: sel.availableSizes || 'Optimized',
      },
      applicationInputs: {
        sparkResistance: sel.sparkResistance || 'None',
        highWindRated: sel.highWindRated || false,
        seismicRated: sel.seismicRated || false,
        efficiencyCodeReq: sel.efficiencyCodeReq || false,
        caTitle20Req: sel.caTitle20Req || false,
      },
      advancedInputs: {
        driveType: sel.driveType || inferDriveType(sel),
        applyVfd: sel.applyVfd || false,
        speedController: sel.speedController || false,
        performanceBaffle: sel.performanceBaffle || false,
        damperSpCorrection: sel.damperSpCorrection || 'None',
      },
    },
    
    electrical: {
      motor: {
        voltage: sel.voltage || 460,
        phase: sel.phase || 3,
        frequency: sel.frequency || 60,
        motorHp: sel.motorHp || '',
        motorDesign: sel.motorDesign || 'NEMA',
        enclosure: sel.enclosure || 'TEFC',
        ulListed: sel.ulListed || '705',
        efficiencyRating: sel.efficiencyRating || 'High',
      },
      variGreenControl: {
        variGreenControl: sel.variGreenControl || 'None',
        transformerHoa: sel.transformerHoa || 'None',
        includeBalanceDial: sel.includeBalanceDial || false,
      },
      electricalAccessories: {
        disconnectSwitch: sel.disconnectSwitch || sel.disconnect || false,
        disconnectRating: sel.disconnectRating || 'NEMA-1',
        disconnectProtection: sel.disconnectProtection || 'None',
        disconnectType: sel.disconnectType || 'Toggle',
        motorStarter: sel.motorStarter || false,
        wiringPigtail: sel.wiringPigtail || false,
        motorMfgLocation: sel.motorMfgLocation || 'No Preference',
        specialMotor: sel.specialMotor || false,
      },
    },
    
    configuration: {
      construction: {
        coatings: typeof sel.coatings === 'boolean' ? sel.coatings : false,
        hoodHasps: sel.hoodHasps || false,
        conduitChaseQty: sel.conduitChaseQty || 1,
        birdscreenMaterial: sel.birdscreenMaterial || 'Galvanized',
        fasteners: sel.fasteners || 'Standard',
      },
      accessories: {
        damper: sel.damper || sel.backdraftDamper || false,
        damperActuator: sel.damperActuator || 'Gravity',
        damperMounting: sel.damperMounting || 'Factory',
        damperBladeAction: sel.damperBladeAction || 'Parallel',
        unitWarranty: sel.unitWarranty || '1 Yr',
        specialNameplate: sel.specialNameplate || false,
      },
      mounting: {
        roofCurbs: sel.roofCurbs || false,
        curbExtension: sel.curbExtension || false,
        curbCapAdapter: sel.curbCapAdapter || false,
        hingedCurbCap: sel.hingedCurbCap || 'None',
        curbSeal: sel.curbSeal || false,
        tieDownPoints: sel.tieDownPoints || false,
      },
    },
    
    selection: {
      series: sel.series || inferSeries(sel),
      size: sel.size || '',
      model: sel.model || '',
    },
  };
}

/**
 * Generate structured JSON export organized by CAPS UI screens
 */
export function generateStructuredJsonExport(selections: FanSelection[]): string {
  const structured = selections.map((sel, i) => toStructuredCapsInput(sel, i));
  return JSON.stringify(structured.length === 1 ? structured[0] : structured, null, 2);
}

/**
 * Export data structure for UI display
 */
export interface SelectionExportData {
  /** Flat JSON representation */
  flatJson: string;
  /** Structured JSON organized by CAPS UI screens */
  structuredJson: string;
  /** Tab-delimited CSV with all fields */
  csv: string;
  /** Summary string for quick reference */
  summary: string;
  /** Number of selections */
  count: number;
  /** List of field counts by category */
  fieldCounts: {
    sizing: number;
    electrical: number;
    configuration: number;
    total: number;
  };
}

/**
 * Generate all export formats for selections
 */
export function generateAllExports(selections: FanSelection[]): SelectionExportData {
  return {
    flatJson: generateJsonExport(selections),
    structuredJson: generateStructuredJsonExport(selections),
    csv: generateCapsClipboardExtended(selections),
    summary: selections.map(s => formatSelectionSummary(s)).join('; '),
    count: selections.length,
    fieldCounts: {
      sizing: 15,        // CFM, SP, Elevation, Temperature, Available Sizes, Spark, High Wind, Seismic, Efficiency Code, CA Title 20, Drive Type, VFD, Speed Controller, Perf Baffle, Damper SP
      electrical: 18,    // Voltage, Phase, Frequency, Motor HP, Design, Enclosure, UL, Efficiency, VG Control, Transformer, Balance Dial, Disconnect (6 fields), Starter, Pigtail, Mfg Location, Special Motor
      configuration: 15, // Coatings, Hood Hasps, Conduit, Birdscreen, Fasteners, Damper (6 fields), Warranty, Nameplate, Curbs (6 fields)
      total: 56,
    },
  };
}

/**
 * Infer drive type from selection data
 */
function inferDriveType(sel: FanSelection): string {
  if (sel.series === 'GB') return 'Belt';
  if (sel.series === 'G') return 'Direct';
  // Default to direct for lower CFM, belt for higher
  return sel.cfm > 10000 ? 'Belt' : 'Direct';
}

/**
 * Infer series from selection data
 */
function inferSeries(sel: FanSelection): string {
  if (sel.driveType === 'Belt') return 'GB';
  if (sel.driveType === 'Direct' || sel.driveType === 'VariGreen') return 'G';
  // Default based on CFM
  return sel.cfm > 10000 ? 'GB' : 'G';
}

/**
 * Generate a simple display string for the selection
 */
export function formatSelectionSummary(selection: FanSelection): string {
  const parts = [
    `${selection.cfm} CFM`,
    `${selection.staticPressure}" SP`,
  ];
  
  if (selection.voltage && selection.phase) {
    parts.push(`${selection.voltage}V/${selection.phase}ph`);
  }
  
  if (selection.driveType) {
    parts.push(selection.driveType);
  }
  
  if (selection.model) {
    parts.push(selection.model);
  }
  
  return parts.join(', ');
}
