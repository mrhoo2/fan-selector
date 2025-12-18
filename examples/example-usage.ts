/**
 * Example Usage: Build Vision to CAPS Integration
 * 
 * Demonstrates how to:
 * 1. Parse Build Vision extracted equipment data
 * 2. Convert to CAPS selection inputs
 * 3. Export to CAPS-compatible CSV format
 */

import {
  ScheduleParser,
  SPEC_TYPE_IDS,
  generateCapsInputCsv,
  toJsonExport,
  type BuildVisionExtractionInput,
  type BuildVisionSpecValue,
} from '../src/index.js';

// ============================================
// EXAMPLE 1: Parse Build Vision Extraction JSON
// ============================================

/**
 * Example Build Vision extraction data
 * This is the format that would come from the Build Vision document extraction
 */
const buildVisionExtraction: BuildVisionExtractionInput = {
  projectId: 'proj-123456',
  projectName: 'Office Building HVAC',
  
  // Default specs to apply to all equipment (project-wide specs)
  defaults: [
    {
      specTypeId: SPEC_TYPE_IDS.VOLTAGE,
      specTypeName: 'Voltage',
      value: 460,
    },
    {
      specTypeId: SPEC_TYPE_IDS.PHASE,
      specTypeName: 'Phase',
      value: 3,
    },
  ],
  
  // Individual equipment items extracted from schedules
  equipment: [
    {
      id: 'equip-001',
      mark: 'EF-1',
      quantity: 1,
      equipmentType: 'Exhaust Fan',
      specs: [
        {
          specTypeId: SPEC_TYPE_IDS.FAN_CFM,
          specTypeName: 'Fan CFM',
          value: 2500,
          unit: 'CFM',
          confidence: 0.95,
        },
        {
          specTypeId: SPEC_TYPE_IDS.EXTERNAL_STATIC_PRESSURE,
          specTypeName: 'External Static Pressure',
          value: 0.5,
          unit: 'in. wg',
          confidence: 0.92,
        },
        {
          specTypeId: SPEC_TYPE_IDS.MOTOR_HORSEPOWER,
          specTypeName: 'Motor HP',
          value: '1',
        },
        {
          specTypeId: SPEC_TYPE_IDS.DRIVE_TYPE,
          specTypeName: 'Drive Type',
          value: 'Direct Drive',
        },
        {
          specTypeId: SPEC_TYPE_IDS.BACKDRAFT_DAMPER,
          specTypeName: 'Backdraft Damper',
          value: true,
        },
        {
          specTypeId: SPEC_TYPE_IDS.DISCONNECT_SWITCH,
          specTypeName: 'Disconnect Switch',
          value: true,
        },
      ],
      notes: 'Roof mounted, weatherproof disconnect',
      source: {
        documentId: 'doc-m101',
        documentName: 'M1.01 - Mechanical Schedules',
        pageNumber: 3,
      },
    },
    {
      id: 'equip-002',
      mark: 'EF-2',
      quantity: 2,
      equipmentType: 'Exhaust Fan',
      specs: [
        {
          specTypeId: SPEC_TYPE_IDS.FAN_CFM,
          specTypeName: 'Fan CFM',
          value: 1200,
        },
        {
          specTypeId: SPEC_TYPE_IDS.EXTERNAL_STATIC_PRESSURE,
          specTypeName: 'External Static Pressure',
          value: 0.375,
        },
        {
          specTypeId: SPEC_TYPE_IDS.MOTOR_HORSEPOWER,
          specTypeName: 'Motor HP',
          value: '1/2',
        },
        {
          specTypeId: SPEC_TYPE_IDS.DRIVE_TYPE,
          specTypeName: 'Drive Type',
          value: 'VG', // VariGreen
        },
        // Override voltage for this fan (uses 115V instead of project default 460V)
        {
          specTypeId: SPEC_TYPE_IDS.VOLTAGE,
          specTypeName: 'Voltage',
          value: 115,
        },
        {
          specTypeId: SPEC_TYPE_IDS.PHASE,
          specTypeName: 'Phase',
          value: 1,
        },
      ],
    },
    {
      id: 'equip-003',
      mark: 'TEF-1',
      quantity: 4,
      equipmentType: 'Toilet Exhaust Fan',
      specs: [
        {
          specTypeId: SPEC_TYPE_IDS.FAN_CFM,
          specTypeName: 'Fan CFM',
          value: 300,
        },
        {
          specTypeId: SPEC_TYPE_IDS.EXTERNAL_STATIC_PRESSURE,
          specTypeName: 'External Static Pressure',
          value: 0.25,
        },
        {
          specTypeId: SPEC_TYPE_IDS.DRIVE_TYPE,
          specTypeName: 'Drive Type',
          value: 'VariGreen',
        },
        {
          specTypeId: SPEC_TYPE_IDS.VOLTAGE,
          specTypeName: 'Voltage',
          value: 115,
        },
        {
          specTypeId: SPEC_TYPE_IDS.PHASE,
          specTypeName: 'Phase',
          value: 1,
        },
      ],
    },
  ],
  
  metadata: {
    extractedAt: '2025-12-18T10:00:00Z',
    extractionVersion: '2.1.0',
    confidence: 0.89,
  },
};

// ============================================
// Parse the extraction
// ============================================

console.log('=== Parsing Build Vision Extraction ===\n');

const parser = new ScheduleParser();
const result = parser.parseExtraction(buildVisionExtraction);

// Display statistics
console.log('Parse Statistics:');
console.log(`  Total items: ${result.stats.totalItems}`);
console.log(`  Successful: ${result.stats.successfulParses}`);
console.log(`  Failed: ${result.stats.failedParses}`);
console.log(`  Incomplete: ${result.stats.incompleteItems}`);
console.log(`  Specs mapped: ${result.stats.totalSpecsMapped}`);
console.log(`  Specs unmapped: ${result.stats.totalSpecsUnmapped}`);
console.log('');

// Display parsed items
console.log('=== Parsed Equipment Items ===\n');

for (const item of result.items) {
  console.log(`${item.mark} (Qty: ${item.quantity})`);
  console.log(`  CFM: ${item.performance.cfm}`);
  console.log(`  SP: ${item.performance.staticPressure} in. wg`);
  console.log(`  Complete: ${item.isComplete}`);
  
  if (item.warnings.length > 0) {
    console.log(`  Warnings: ${item.warnings.join(', ')}`);
  }
  
  console.log(`  Mapped specs: ${item.mappedSpecs.length}`);
  for (const spec of item.mappedSpecs) {
    console.log(`    - ${spec.specTypeName || spec.specTypeId}: ${spec.originalValue} → ${spec.transformedValue}`);
  }
  
  console.log('');
}

// ============================================
// Generate CAPS-compatible CSV
// ============================================

console.log('=== CAPS CSV Export ===\n');

const capsInputs = result.items.map(item => item.capsInput);
const csv = generateCapsInputCsv(capsInputs, {
  delimiter: '\t',  // Tab-delimited for Excel clipboard paste
  includeHeader: true,
});

console.log('CSV Output (tab-delimited):');
console.log(csv);
console.log('');

// ============================================
// Generate JSON Export
// ============================================

console.log('=== JSON Export ===\n');

const jsonExport = toJsonExport(capsInputs);
console.log(jsonExport);

// ============================================
// EXAMPLE 2: Simple Usage with createSpecsFromObject
// ============================================

console.log('\n=== Example 2: Simple Object-Based Input ===\n');

import { createSpecsFromObject, parseEquipmentList } from '../src/index.js';

// For simpler cases, you can create specs from a plain object
const simpleSpecs = createSpecsFromObject({
  'CFM': 1500,
  'Static Pressure': 0.5,
  'Voltage': 208,
  'Phase': 3,
  'Motor HP': '3/4',
  'Backdraft Damper': true,
});

const simpleEquipment = [
  {
    mark: 'SF-1',
    quantity: 1,
    specs: simpleSpecs,
  },
];

const simpleResult = parseEquipmentList(simpleEquipment);

console.log('Simple parse result:');
console.log(`  Mark: ${simpleResult.items[0]?.mark}`);
console.log(`  CFM: ${simpleResult.items[0]?.performance.cfm}`);
console.log(`  SP: ${simpleResult.items[0]?.performance.staticPressure}`);
console.log(`  Complete: ${simpleResult.items[0]?.isComplete}`);

// ============================================
// EXAMPLE 3: Working with Default Specs
// ============================================

console.log('\n=== Example 3: Parser with Default Specs ===\n');

// Create a parser with project-wide defaults
const defaultSpecs: BuildVisionSpecValue[] = [
  { specTypeId: SPEC_TYPE_IDS.VOLTAGE, value: 460 },
  { specTypeId: SPEC_TYPE_IDS.PHASE, value: 3 },
  { specTypeId: SPEC_TYPE_IDS.MOTOR_ENCLOSURE, value: 'TEFC' },
];

const parserWithDefaults = new ScheduleParser(defaultSpecs);

// Parse equipment - will inherit defaults unless overridden
const equipmentWithDefaults = parserWithDefaults.parseEquipmentItem({
  mark: 'RF-1',
  specs: [
    { specTypeId: SPEC_TYPE_IDS.FAN_CFM, value: 5000 },
    { specTypeId: SPEC_TYPE_IDS.EXTERNAL_STATIC_PRESSURE, value: 1.5 },
    // Voltage and Phase will come from defaults
  ],
});

console.log('Equipment with defaults:');
console.log(`  Mark: ${equipmentWithDefaults.mark}`);
console.log(`  Voltage: ${equipmentWithDefaults.capsInput.electrical.motor.voltage} (from default)`);
console.log(`  Phase: ${equipmentWithDefaults.capsInput.electrical.motor.phase} (from default)`);
console.log(`  Enclosure: ${equipmentWithDefaults.capsInput.electrical.motor.enclosure} (from default)`);
