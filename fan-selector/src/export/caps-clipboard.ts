/**
 * CAPS Clipboard Export
 * 
 * Generates CAPS-compatible clipboard import format (CSV)
 * Based on the actual CAPS export format from Equipment Schedule exports
 * 
 * @version 1.0.0
 * @author Build Vision
 */

import type { CapsSelectionInput, CapsSelectionOutput } from '../types/caps-selection.js';

// ============================================
// CAPS CSV COLUMN DEFINITIONS
// ============================================

/**
 * Column headers used in CAPS Equipment Schedule export
 * These are the output columns - for import we need a subset
 */
export const CAPS_EXPORT_COLUMNS = [
  'Mark',
  'Quantity',
  'Model',
  'Drive Type',
  'Volume (CFM)',
  'External SP (in. wg)',
  'Total External SP (in. wg)',
  'Fan Speed (RPM)',
  'Outlet Velocity (ft/min)',
  'Inlet dBA',
  'Inlet Sones',
  'Outlet dBA',
  'Outlet Sones',
  'FEI',
  'Operating Power (hp)',
  'Motor Size (hp)',
  'FEP Input Power (kW)',
  'Enclosure',
  'Voltage',
  'Cycle',
  'Phase',
  'Total Weight (lb)',
  'EC Motor',
] as const;

/**
 * Columns that can be used for CAPS import/clipboard paste
 * These are the input columns that CAPS accepts
 */
export const CAPS_INPUT_COLUMNS = [
  'Mark',
  'Quantity',
  'CFM',
  'SP',
  'Voltage',
  'Phase',
  'Motor HP',
  'Drive Type',
  'Enclosure',
  'Notes',
] as const;

// ============================================
// CSV GENERATION FOR CAPS IMPORT
// ============================================

/**
 * Options for CSV generation
 */
export interface CsvOptions {
  /** Include header row */
  includeHeader?: boolean;
  
  /** Column delimiter (default: tab for Excel clipboard compatibility) */
  delimiter?: string;
  
  /** Line ending (default: \r\n for Windows compatibility) */
  lineEnding?: string;
  
  /** Quote character for fields with special characters */
  quote?: string;
  
  /** Include CAPS header lines (Greenheck\nFan\n) */
  includeCapsHeader?: boolean;
}

const DEFAULT_CSV_OPTIONS: Required<CsvOptions> = {
  includeHeader: true,
  delimiter: '\t',
  lineEnding: '\r\n',
  quote: '"',
  includeCapsHeader: false,
};

/**
 * Input row structure for CAPS import
 */
export interface CapsInputRow {
  mark: string;
  quantity: number;
  cfm: number;
  staticPressure: number;
  voltage: number;
  phase: number;
  motorHp?: string;
  driveType?: string;
  enclosure?: string;
  notes?: string;
}

/**
 * Generate CAPS-compatible CSV from selection inputs
 */
export function generateCapsInputCsv(
  inputs: CapsSelectionInput[],
  options?: CsvOptions
): string {
  const opts = { ...DEFAULT_CSV_OPTIONS, ...options };
  const lines: string[] = [];
  
  // Add CAPS header if requested
  if (opts.includeCapsHeader) {
    lines.push('Greenheck');
    lines.push('Fan');
  }
  
  // Add column headers
  if (opts.includeHeader) {
    lines.push(CAPS_INPUT_COLUMNS.join(opts.delimiter));
  }
  
  // Add data rows
  for (const input of inputs) {
    const row = formatInputRow(input, opts);
    lines.push(row);
  }
  
  return lines.join(opts.lineEnding);
}

/**
 * Format a single input row
 */
function formatInputRow(input: CapsSelectionInput, opts: Required<CsvOptions>): string {
  const fields: string[] = [
    escapeField(input.mark, opts),
    String(input.quantity),
    String(input.performance.cfm),
    String(input.performance.staticPressure),
    String(input.electrical.motor.voltage),
    String(input.electrical.motor.phase),
    escapeField(input.electrical.motor.motorSizeHp, opts),
    escapeField(input.sizing.advanced.driveType, opts),
    escapeField(input.electrical.motor.enclosure, opts),
    escapeField(buildNotesField(input), opts),
  ];
  
  return fields.join(opts.delimiter);
}

/**
 * Build a notes field from selection options
 */
function buildNotesField(input: CapsSelectionInput): string {
  const notes: string[] = [];
  
  // Add disconnect switch info
  if (input.electrical.electricalAccessories.disconnectSwitch) {
    if (input.electrical.disconnectSwitch?.enclosureRating) {
      notes.push(`${input.electrical.disconnectSwitch.enclosureRating} Disconnect`);
    } else {
      notes.push('Disconnect Switch');
    }
  }
  
  // Add damper info
  if (input.configuration.accessories.damper) {
    if (input.configuration.damper?.actuatorType === 'Gravity') {
      notes.push('Backdraft Damper');
    } else if (input.configuration.damper?.actuatorType === 'Motorized') {
      notes.push('Motorized Damper');
    } else {
      notes.push('Damper');
    }
  }
  
  // Add VFD
  if (input.sizing.advanced.applyVfd) {
    notes.push('VFD');
  }
  
  // Add curb
  if (input.configuration.mounting.roofCurbs) {
    notes.push('Roof Curb');
  }
  
  // Add spark resistance
  if (input.sizing.application.sparkResistance !== 'None') {
    notes.push(`Spark Resistant ${input.sizing.application.sparkResistance}`);
  }
  
  // Add seismic
  if (input.sizing.application.seismicRated) {
    notes.push('Seismic');
  }
  
  // Add high wind
  if (input.sizing.application.highWindRated) {
    notes.push('High Wind');
  }
  
  return notes.join('; ');
}

/**
 * Escape a field for CSV
 */
function escapeField(value: string | undefined, opts: Required<CsvOptions>): string {
  if (!value) return '';
  
  const str = String(value);
  
  // Check if quoting is needed
  if (
    str.includes(opts.delimiter) ||
    str.includes(opts.quote) ||
    str.includes('\n') ||
    str.includes('\r')
  ) {
    // Escape quotes by doubling them
    const escaped = str.replace(new RegExp(opts.quote, 'g'), opts.quote + opts.quote);
    return opts.quote + escaped + opts.quote;
  }
  
  return str;
}

// ============================================
// OUTPUT CSV (CAPS EXPORT FORMAT)
// ============================================

/**
 * Generate CSV matching CAPS output/export format
 * This is for generating reports or comparison data
 */
export function generateCapsOutputCsv(
  outputs: CapsSelectionOutput[],
  options?: CsvOptions
): string {
  const opts = { ...DEFAULT_CSV_OPTIONS, ...options };
  const lines: string[] = [];
  
  // Add CAPS header if requested
  if (opts.includeCapsHeader) {
    lines.push('Greenheck');
    lines.push('Fan');
  }
  
  // Add column headers
  if (opts.includeHeader) {
    lines.push(CAPS_EXPORT_COLUMNS.join(opts.delimiter));
  }
  
  // Add data rows
  for (const output of outputs) {
    const row = formatOutputRow(output, opts);
    lines.push(row);
  }
  
  return lines.join(opts.lineEnding);
}

/**
 * Format a single output row
 */
function formatOutputRow(output: CapsSelectionOutput, opts: Required<CsvOptions>): string {
  const fields: string[] = [
    escapeField(output.mark, opts),
    String(output.quantity),
    escapeField(output.model, opts),
    escapeField(output.driveType, opts),
    formatNumber(output.volumeCfm),
    formatNumber(output.externalSP, 2),
    formatNumber(output.totalExternalSP, 2),
    formatNumber(output.fanSpeedRpm),
    formatNumber(output.outletVelocity),
    formatNumber(output.inletSound.dba),
    formatNumber(output.inletSound.sones, 1),
    formatNumber(output.outletSound.dba),
    formatNumber(output.outletSound.sones, 1),
    output.fei !== null ? formatNumber(output.fei, 2) : '-',
    formatNumber(output.operatingPowerHp, 2),
    escapeField(output.motorSizeHp, opts),
    formatNumber(output.fepInputPowerKw, 2),
    escapeField(output.enclosure, opts),
    String(output.voltage),
    escapeField(output.cycle, opts),
    String(output.phase),
    formatNumber(output.totalWeightLb),
    escapeField(output.ecMotor || '', opts),
  ];
  
  return fields.join(opts.delimiter);
}

/**
 * Format a number with optional decimal places
 */
function formatNumber(value: number, decimals = 0): string {
  if (decimals === 0) {
    return String(Math.round(value));
  }
  return value.toFixed(decimals);
}

// ============================================
// JSON FORMAT (ALTERNATIVE EXPORT)
// ============================================

/**
 * Convert inputs to JSON format for CAPS or other systems
 */
export function toJsonExport(inputs: CapsSelectionInput[]): string {
  const exportData = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    source: 'Build Vision',
    equipment: inputs.map(input => ({
      mark: input.mark,
      quantity: input.quantity,
      performance: {
        cfm: input.performance.cfm,
        staticPressure: input.performance.staticPressure,
      },
      electrical: {
        voltage: input.electrical.motor.voltage,
        phase: input.electrical.motor.phase,
        motorHp: input.electrical.motor.motorSizeHp,
        enclosure: input.electrical.motor.enclosure,
      },
      options: {
        driveType: input.sizing.advanced.driveType,
        disconnect: input.electrical.electricalAccessories.disconnectSwitch,
        damper: input.configuration.accessories.damper,
        vfd: input.sizing.advanced.applyVfd,
      },
    })),
  };
  
  return JSON.stringify(exportData, null, 2);
}

// ============================================
// CONVERSION UTILITIES
// ============================================

/**
 * Convert CapsSelectionInput array to CapsInputRow array
 */
export function toInputRows(inputs: CapsSelectionInput[]): CapsInputRow[] {
  return inputs.map(input => ({
    mark: input.mark,
    quantity: input.quantity,
    cfm: input.performance.cfm,
    staticPressure: input.performance.staticPressure,
    voltage: input.electrical.motor.voltage,
    phase: input.electrical.motor.phase,
    motorHp: input.electrical.motor.motorSizeHp,
    driveType: input.sizing.advanced.driveType,
    enclosure: input.electrical.motor.enclosure,
    notes: buildNotesField(input),
  }));
}

/**
 * Parse a CAPS output CSV back to structured data
 */
export function parseCapsOutputCsv(
  csv: string,
  options?: { delimiter?: string }
): CapsSelectionOutput[] {
  const delimiter = options?.delimiter || ',';
  const lines = csv.split(/\r?\n/).filter(line => line.trim());
  
  // Skip CAPS headers (Greenheck, Fan)
  let startIndex = 0;
  if (lines[0]?.trim() === 'Greenheck') startIndex++;
  if (lines[startIndex]?.trim() === 'Fan') startIndex++;
  
  // Get column headers
  const headerLine = lines[startIndex];
  if (!headerLine) return [];
  
  const headers = parseCSVLine(headerLine, delimiter);
  const results: CapsSelectionOutput[] = [];
  
  // Parse data rows
  for (let i = startIndex + 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i], delimiter);
    if (values.length === 0) continue;
    
    const row = createOutputFromRow(headers, values);
    if (row) results.push(row);
  }
  
  return results;
}

/**
 * Parse a CSV line handling quoted fields
 */
function parseCSVLine(line: string, delimiter: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

/**
 * Create CapsSelectionOutput from parsed row
 */
function createOutputFromRow(
  headers: string[],
  values: string[]
): CapsSelectionOutput | null {
  const getValue = (header: string): string => {
    const index = headers.findIndex(h => 
      h.toLowerCase().includes(header.toLowerCase())
    );
    return index >= 0 ? values[index] || '' : '';
  };
  
  const mark = getValue('Mark');
  if (!mark) return null;
  
  return {
    mark,
    quantity: parseInt(getValue('Quantity')) || 1,
    model: getValue('Model'),
    driveType: getValue('Drive Type') as 'Direct' | 'Belt',
    volumeCfm: parseFloat(getValue('Volume')) || 0,
    externalSP: parseFloat(getValue('External SP')) || 0,
    totalExternalSP: parseFloat(getValue('Total External SP')) || 0,
    fanSpeedRpm: parseFloat(getValue('Fan Speed')) || 0,
    outletVelocity: parseFloat(getValue('Outlet Velocity')) || 0,
    inletSound: {
      dba: parseFloat(getValue('Inlet dBA')) || 0,
      sones: parseFloat(getValue('Inlet Sones')) || 0,
    },
    outletSound: {
      dba: parseFloat(getValue('Outlet dBA')) || 0,
      sones: parseFloat(getValue('Outlet Sones')) || 0,
    },
    fei: getValue('FEI') === '-' ? null : parseFloat(getValue('FEI')) || null,
    operatingPowerHp: parseFloat(getValue('Operating Power')) || 0,
    motorSizeHp: getValue('Motor Size'),
    fepInputPowerKw: parseFloat(getValue('FEP Input')) || 0,
    enclosure: getValue('Enclosure') as CapsSelectionOutput['enclosure'],
    voltage: parseInt(getValue('Voltage')) as CapsSelectionOutput['voltage'],
    cycle: getValue('Cycle') as '50 Cycle' | '60 Cycle',
    phase: parseInt(getValue('Phase')) as 1 | 3,
    totalWeightLb: parseFloat(getValue('Weight')) || 0,
    ecMotor: getValue('EC Motor') || null,
  };
}
