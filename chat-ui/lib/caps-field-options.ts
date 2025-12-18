/**
 * CAPS Field Options Reference for G/GB Series Roof Exhaust Fans
 * Organized by native Windows app interface screens
 */

export interface FieldOption {
  value: string;
  label: string;
  description?: string;
}

export interface CapsField {
  name: string;
  label: string;
  type: "boolean" | "enum" | "numeric" | "string";
  options?: FieldOption[];
  required: boolean;
  notes?: string;
  source?: string;
}

export interface FieldSection {
  name: string;
  fields: CapsField[];
}

export interface CapsScreen {
  id: string;
  name: string;
  icon: string;
  sections: FieldSection[];
}

// ============================================================================
// SCREEN 1: SIZING / INPUTS
// ============================================================================

const sizingInputsScreen: CapsScreen = {
  id: "sizing",
  name: "Sizing / Inputs",
  icon: "📐",
  sections: [
    {
      name: "Basic Inputs (Required)",
      fields: [
        // Source: Decompiled/Cfs.Fans.FanSelector/Cfs.Fans.FanSelector/AvailableSizes.cs
        // REVIEW: UI shows "Optimized" but enum has "Recommended" - may be same option with different label
        {
          name: "availableSizes",
          label: "Available Sizes",
          type: "enum",
          required: true,
          options: [
            { value: "recommended", label: "Recommended", description: "UI may show as 'Optimized'" },
            { value: "all", label: "All" },
            { value: "unsafe", label: "Unsafe" },
            { value: "specific", label: "Specific" },
          ],
          source: "AvailableSizes.cs",
          notes: "REVIEW: Verify 'Optimized' vs 'Recommended' mapping in native CAPS UI",
        },
      ],
    },
    {
      name: "Application Inputs (Optional)",
      fields: [
        // Source: Decompiled/Cfs.Fans.FanSelector/Cfs.Fans.FanSelector/SparkResistanceOptions.cs
        {
          name: "sparkResistance",
          label: "Spark Resistance",
          type: "enum",
          required: false,
          options: [
            { value: "none", label: "None" },
            { value: "sparkA", label: "Spark A", description: "All-aluminum construction" },
            { value: "sparkB", label: "Spark B", description: "Non-sparking wheel, steel housing" },
            { value: "sparkC", label: "Spark C", description: "Non-sparking wheel and housing" },
          ],
          source: "SparkResistanceOptions.cs",
        },
        // Source: Decompiled/Cfs.Fans.FanSelector/Cfs.Fans.FanSelector/IFanSelector.cs - RequiresHighWind property
        {
          name: "highWindRated",
          label: "High Wind Rated",
          type: "boolean",
          required: false,
          options: [
            { value: "no", label: "No" },
            { value: "yes", label: "Yes" },
          ],
        },
        // Source: Decompiled/Cfs.Fans.FanSelector/Cfs.Fans.FanSelector/IFanSelector.cs - RequiresSeismic property
        {
          name: "seismicRated",
          label: "Seismic Rated",
          type: "boolean",
          required: false,
          options: [
            { value: "no", label: "No" },
            { value: "yes", label: "Yes" },
          ],
        },
        // Source: Decompiled/Cfs.Fans.FanSelector.Wrapper/Cfs.Fans.FanSelector.Wrapper/IFanSelectorWrapper.cs - EfficiencyCode string property
        // Actual enum options may be stored in database - these are common values observed in UI
        {
          name: "efficiencyCodeReq",
          label: "Efficiency Code Req",
          type: "enum",
          required: false,
          options: [
            { value: "no", label: "No" },
            { value: "title24", label: "Title 24/California" },
            { value: "washington", label: "Washington St Energy Code" },
            { value: "ashrae", label: "ANSI/ASHRAE/IES 90.1" },
          ],
          source: "IFanSelectorWrapper.cs",
          notes: "EfficiencyCode is string property - actual option values may be in database",
        },
        // Source: Decompiled/Cfs.Fans.FanSelector/Cfs.Fans.FanSelector/IFanSelector.cs - CalculateFEI boolean property
        // CA Title 20 compliance uses FEI (Fan Energy Index) calculation
        {
          name: "caTitle20Req",
          label: "CA Title 20 Req.",
          type: "boolean",
          required: false,
          options: [
            { value: "no", label: "No" },
            { value: "yes", label: "Yes" },
          ],
          source: "IFanSelector.cs",
          notes: "Maps to CalculateFEI property - triggers FEI calculation for Title 20 compliance",
        },
      ],
    },
    {
      name: "Advanced Inputs (Optional)",
      fields: [
        // Source: Decompiled/Cfs.Fans.FanSelector/Cfs.Fans.FanSelector/DriveType.cs
        {
          name: "driveType",
          label: "Drive Type",
          type: "enum",
          required: false,
          options: [
            { value: "any", label: "Any" },
            { value: "belt", label: "Belt", description: "GB series" },
            { value: "direct", label: "Direct", description: "G series" },
            { value: "vgOnly", label: "VG Only", description: "VariGreen direct drive" },
          ],
          source: "DriveType.cs",
        },
        // Source: Decompiled/Cfs.Fans.FanSelector/Cfs.Fans.FanSelector/AllowVfd.cs
        {
          name: "applyVfd",
          label: "Apply VFD",
          type: "enum",
          required: false,
          options: [
            { value: "no", label: "No" },
            { value: "underSpeed", label: "Under Speed" },
            { value: "overSpeed", label: "Over Speed" },
            { value: "both", label: "Both" },
          ],
          source: "AllowVfd.cs",
        },
        // Source: Decompiled/Cfs.Fans.FanSelector/Cfs.Fans.FanSelector/IFanSelector.cs - AllowSpeedController property
        {
          name: "speedController",
          label: "Speed Controller",
          type: "boolean",
          required: false,
          options: [
            { value: "no", label: "No" },
            { value: "yes", label: "Yes" },
          ],
        },
        // Source: Decompiled/Cfs.Fans.FanSelector/Cfs.Fans.FanSelector/IFanSelector.cs - AllowPerformanceBaffle property
        {
          name: "performanceBaffle",
          label: "Performance Baffle",
          type: "boolean",
          required: false,
          options: [
            { value: "no", label: "No" },
            { value: "yes", label: "Yes" },
          ],
        },
      ],
    },
    {
      name: "Static Pressure Corrections",
      fields: [
        // Source: Decompiled/Cfs.Fans.FanSelector/Cfs.Fans.FanSelector/DamperTypes.cs
        {
          name: "damperCorrection",
          label: "Damper",
          type: "enum",
          required: false,
          options: [
            { value: "none", label: "None" },
            { value: "backdraft", label: "Backdraft" },
            { value: "control", label: "Control" },
          ],
          source: "DamperTypes.cs",
        },
      ],
    },
  ],
};

// ============================================================================
// SCREEN 2: ELECTRICAL / MOTOR
// ============================================================================

const electricalMotorScreen: CapsScreen = {
  id: "electrical",
  name: "Electrical / Motor",
  icon: "⚡",
  sections: [
    {
      name: "Motor (Required)",
      fields: [
        // Source: UI-Verified by Mackenzie (2024-12-18)
        {
          name: "includeMotorDrive",
          label: "Include Motor & Drive",
          type: "boolean",
          required: true,
          options: [
            { value: "yes", label: "Yes" },
          ],
          source: "UI-Verified by Mackenzie",
          notes: "Only 'Yes' option available in current UI",
        },
        // Source: Decompiled/Cfs.Fans.MotorSelector2/Cfs.Fans.MotorSelector2/IMotorSelector.cs - standard HP values
        {
          name: "motorSize",
          label: "Motor Size (hp)",
          type: "enum",
          required: true,
          options: [
            { value: "0.25", label: "1/4" },
            { value: "0.333", label: "1/3" },
            { value: "0.5", label: "1/2" },
            { value: "0.75", label: "3/4" },
            { value: "1", label: "1" },
            { value: "1.5", label: "1.5" },
            { value: "2", label: "2" },
            { value: "3", label: "3" },
            { value: "5", label: "5" },
            { value: "7.5", label: "7.5" },
            { value: "10", label: "10" },
            { value: "15", label: "15" },
            { value: "20", label: "20" },
            { value: "25", label: "25" },
            { value: "30", label: "30" },
            { value: "40", label: "40" },
            { value: "50", label: "50" },
            { value: "60", label: "60" },
            { value: "75", label: "75" },
            { value: "100", label: "100" },
          ],
        },
        // Source: Decompiled/Cfs.Fans.FanSelector/Cfs.Fans.FanSelector/IFanSelector.cs - Phase property (string)
        {
          name: "phase",
          label: "Phase",
          type: "enum",
          required: true,
          options: [
            { value: "1", label: "1" },
            { value: "3", label: "3" },
          ],
        },
        // Source: Decompiled/Cfs.Fans.FanSelector/Cfs.Fans.FanSelector/IFanSelector.cs - Voltage property (string)
        {
          name: "voltage",
          label: "Voltage",
          type: "enum",
          required: true,
          options: [
            { value: "115", label: "115" },
            { value: "208", label: "208" },
            { value: "230", label: "230" },
            { value: "460", label: "460" },
            { value: "575", label: "575" },
          ],
        },
        // Source: Decompiled/Cfs.Fans.MotorSelector2/Cfs.Fans.MotorSelector2.Common/MotorType.cs
        {
          name: "motorDesign",
          label: "Motor Design",
          type: "enum",
          required: true,
          options: [
            { value: "nema", label: "NEMA" },
            { value: "iec", label: "IEC" },
          ],
          source: "MotorType.cs",
          notes: "Enum also includes: BrushlessDirectCurrent, ShadedPole, PermanentSplitCapacitor, SynchronousReluctance",
        },
        // Source: Decompiled/Cfs.Fans.MotorSelector2/Cfs.Fans.MotorSelector2.Common/EnclosureType.cs
        {
          name: "enclosure",
          label: "Enclosure",
          type: "enum",
          required: true,
          options: [
            { value: "none", label: "None" },
            { value: "dp", label: "Drip Proof (DP)" },
            { value: "oao", label: "Open Air Over (OAO)" },
            { value: "teao", label: "TEAO" },
            { value: "tebc", label: "TEBC" },
            { value: "tefc", label: "TEFC" },
            { value: "tenv", label: "TENV" },
            { value: "te", label: "Totally Enclosed" },
            { value: "noPref", label: "No Preference" },
          ],
          source: "EnclosureType.cs",
        },
        // Source: Decompiled/Cfs.Fans.FanSelector/Cfs.Fans.FanSelector/IFanSelector.cs - RequiresUL762 property
        {
          name: "ulListed",
          label: "UL Listed",
          type: "enum",
          required: false,
          options: [
            { value: "705", label: "705" },
            { value: "507", label: "507" },
            { value: "none", label: "None" },
          ],
        },
        // Source: UI-Verified by Mackenzie (2024-12-18)
        {
          name: "efficiencyRating",
          label: "Efficiency Rating",
          type: "enum",
          required: false,
          options: [
            { value: "standard", label: "Standard" },
            { value: "high", label: "High" },
            { value: "energyEfficiency", label: "Energy Efficiency" },
            { value: "nemaPremium", label: "NEMA Premium" },
            { value: "other", label: "Other Efficiency" },
          ],
          source: "UI-Verified by Mackenzie",
        },
      ],
    },
    {
      name: "Control Options (VG Series)",
      fields: [
        // Source: UI-Verified by Mackenzie (2024-12-18)
        {
          name: "variGreenControl",
          label: "Vari-Green Control",
          type: "enum",
          required: false,
          options: [
            { value: "remoteDial", label: "Remote Dial" },
            { value: "touchRemote", label: "Touch Remote" },
            { value: "iaqTempHumidity", label: "IAQ-Temp/Humidity" },
            { value: "iaqVoc", label: "IAQ-VOC" },
            { value: "dialOnMotor", label: "Dial On Motor" },
            { value: "handOffAuto", label: "Hand/Off/Auto" },
            { value: "0-10vdc", label: "0-10 VDC" },
            { value: "2speed", label: "2-Speed" },
            { value: "constantPressure", label: "Constant Pressure" },
            { value: "constantAirflow", label: "Constant Airflow" },
          ],
          source: "UI-Verified by Mackenzie",
          notes: "Only applicable for VariGreen motors",
        },
        // Source: UI-Verified by Mackenzie (2024-12-18)
        {
          name: "transformerHoa",
          label: "Transformer/HOA",
          type: "enum",
          required: false,
          options: [
            { value: "none", label: "None" },
            { value: "transformerMounted", label: "Transformer Mounted" },
            { value: "hoaLoose", label: "HOA Loose" },
            { value: "hoaWithEnclosure", label: "HOA w/Enclosure" },
          ],
          source: "UI-Verified by Mackenzie",
        },
        // Source: UI-Verified by Mackenzie (2024-12-18)
        {
          name: "includeBalanceDial",
          label: "Incl. Balance Dial",
          type: "boolean",
          required: false,
          options: [
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ],
          source: "UI-Verified by Mackenzie",
        },
      ],
    },
    {
      name: "Electrical Accessories",
      fields: [
        // Source: UI-Verified by Mackenzie (2024-12-18)
        {
          name: "disconnectSwitch",
          label: "Disconnect Switch",
          type: "boolean",
          required: false,
          options: [
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ],
          source: "UI-Verified by Mackenzie",
        },
        // Source: UI-Verified by Mackenzie (2024-12-18)
        {
          name: "motorStarter",
          label: "Motor Starter",
          type: "boolean",
          required: false,
          options: [
            { value: "no", label: "No" },
          ],
          source: "UI-Verified by Mackenzie",
          notes: "Only 'No' option available in current UI",
        },
        // Source: UI-Verified by Mackenzie (2024-12-18)
        {
          name: "wiringPigtail",
          label: "Wiring Pigtail Accessory",
          type: "boolean",
          required: false,
          options: [
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ],
          source: "UI-Verified by Mackenzie",
        },
      ],
    },
    {
      name: "Disconnect Switch Options",
      fields: [
        // Source: UI-Verified by Mackenzie (2024-12-18)
        {
          name: "dsEnclosureRating",
          label: "Enclosure Rating",
          type: "enum",
          required: false,
          options: [
            { value: "nema1", label: "NEMA-1" },
            { value: "nema3r", label: "NEMA-3R" },
            { value: "nema4", label: "NEMA-4" },
            { value: "nema4x", label: "NEMA-4X" },
            { value: "nema12", label: "NEMA-12" },
          ],
          source: "UI-Verified by Mackenzie",
          notes: "Only if Disconnect Switch = Yes",
        },
        // Source: UI-Verified by Mackenzie (2024-12-18)
        {
          name: "dsProtection",
          label: "Protection",
          type: "enum",
          required: false,
          options: [
            { value: "none", label: "None" },
            { value: "fused", label: "Fused" },
          ],
          source: "UI-Verified by Mackenzie",
        },
        // Source: UI-Verified by Mackenzie (2024-12-18)
        {
          name: "dsType",
          label: "Type",
          type: "enum",
          required: false,
          options: [
            { value: "toggle", label: "Toggle" },
            { value: "heavyDuty", label: "Heavy Duty" },
          ],
          source: "UI-Verified by Mackenzie",
        },
        // Source: UI-Verified by Mackenzie (2024-12-18)
        {
          name: "dsJunctionBoxMtg",
          label: "Junction Box Mtg.",
          type: "enum",
          required: false,
          options: [
            { value: "mountedAndWired", label: "Mounted And Wired" },
            { value: "shipWithUnit", label: "Ship With Unit" },
            { value: "shipSeparate", label: "Ship Separate" },
          ],
          source: "UI-Verified by Mackenzie",
        },
        // Source: UI-Verified by Mackenzie (2024-12-18)
        {
          name: "dsSwitchWiring",
          label: "Switch Wiring",
          type: "enum",
          required: false,
          options: [
            { value: "none", label: "None" },
          ],
          source: "UI-Verified by Mackenzie",
          notes: "Only 'None' option available in current UI",
        },
        // Source: UI-Verified by Mackenzie (2024-12-18)
        {
          name: "dsAuxiliaryContact",
          label: "Auxiliary Contact",
          type: "boolean",
          required: false,
          options: [
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ],
          source: "UI-Verified by Mackenzie",
        },
        // Source: UI-Verified by Mackenzie (2024-12-18)
        {
          name: "dsAuxiliaryContactQty",
          label: "Auxiliary Contact Qty",
          type: "enum",
          required: false,
          options: [
            { value: "0", label: "0" },
            { value: "2", label: "2" },
          ],
          source: "UI-Verified by Mackenzie",
        },
      ],
    },
    {
      name: "Motor (Advanced)",
      fields: [
        // Source: Decompiled/Cfs.Fans.MotorSelector2/Cfs.Fans.MotorSelector2.Common/ManufacturingLocation.cs
        {
          name: "motorMfgLocation",
          label: "Motor Mfg Location",
          type: "enum",
          required: false,
          options: [
            { value: "noPref", label: "No Preference" },
            { value: "americasEurope", label: "Americas/Europe" },
            { value: "usa", label: "USA" },
          ],
          source: "ManufacturingLocation.cs",
        },
        // Source: UI-Verified by Mackenzie (2024-12-18)
        {
          name: "specialMotor",
          label: "Special Motor",
          type: "boolean",
          required: false,
          options: [
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ],
          source: "UI-Verified by Mackenzie",
        },
      ],
    },
  ],
};

// ============================================================================
// SCREEN 3: CONFIGURATION / CONSTRUCTION
// ============================================================================

const configurationScreen: CapsScreen = {
  id: "configuration",
  name: "Configuration / Construction",
  icon: "🔧",
  sections: [
    {
      name: "Construction",
      fields: [
        // Source: UI-Verified by Mackenzie (2024-12-18)
        {
          name: "coatings",
          label: "Coatings",
          type: "boolean",
          required: false,
          options: [
            { value: "no", label: "No" },
            { value: "yes", label: "Yes" },
          ],
          source: "UI-Verified by Mackenzie",
          notes: "Opens coating sub-options if Yes",
        },
        // Source: UI-Verified by Mackenzie (2024-12-18) - Sub-option when coatings=Yes
        {
          name: "coatingType",
          label: "Coating Type",
          type: "enum",
          required: false,
          options: [
            { value: "permatector", label: "Permatector" },
            { value: "hiProPolyester", label: "Hi-Pro Polyester" },
            { value: "macropoxy", label: "Macropoxy" },
          ],
          source: "UI-Verified by Mackenzie",
          notes: "Only if Coatings = Yes",
        },
        // Source: UI-Verified by Mackenzie (2024-12-18) - Sub-option when coatings=Yes
        {
          name: "coatingColor",
          label: "Coating Color",
          type: "enum",
          required: false,
          options: [
            { value: "toBeSelected", label: "To Be Selected" },
            { value: "concreteGray", label: "Concrete Gray-RAL 7023" },
            { value: "ivory", label: "Ivory (031)" },
            { value: "desertSand", label: "Desert Sand (033)" },
            { value: "mediumBronze", label: "Medium Bronze (036)" },
            { value: "flatBlack", label: "Flat Black (044)" },
            { value: "boneWhite", label: "Bone White (GF102)" },
            { value: "hamptonBrown", label: "Hampton Brown (GF105)" },
            { value: "matchColorChip", label: "Match Color Chip" },
          ],
          source: "UI-Verified by Mackenzie",
          notes: "Only if Coatings = Yes",
        },
        // Source: UI-Verified by Mackenzie (2024-12-18) - Sub-option when coatings=Yes
        {
          name: "coatingArea",
          label: "Coating Area",
          type: "enum",
          required: false,
          options: [
            { value: "fanAndAttachedAcc", label: "Fan and Attached Acc" },
          ],
          source: "UI-Verified by Mackenzie",
          notes: "Only if Coatings = Yes",
        },
        // Source: UI-Verified by Mackenzie (2024-12-18) - Sub-option when coatings=Yes
        {
          name: "coatDamper",
          label: "Coat Damper",
          type: "boolean",
          required: false,
          options: [
            { value: "no", label: "No" },
          ],
          source: "UI-Verified by Mackenzie",
          notes: "Only if Coatings = Yes",
        },
        // Source: UI-Verified by Mackenzie (2024-12-18) - Sub-option when coatings=Yes
        {
          name: "coatRoofCurb",
          label: "Coat Roof Curb",
          type: "boolean",
          required: false,
          options: [
            { value: "no", label: "No" },
            { value: "yes", label: "Yes" },
          ],
          source: "UI-Verified by Mackenzie",
          notes: "Only if Coatings = Yes",
        },
        // Source: UI-Verified by Mackenzie (2024-12-18)
        {
          name: "hoodHasps",
          label: "Hood Hasps",
          type: "boolean",
          required: false,
          options: [
            { value: "no", label: "No" },
            { value: "yes", label: "Yes" },
          ],
          source: "UI-Verified by Mackenzie",
        },
        // Source: UI-Verified by Mackenzie (2024-12-18)
        {
          name: "conduitChaseQty",
          label: "Conduit Chase Qty",
          type: "enum",
          required: false,
          options: [
            { value: "0", label: "0" },
            { value: "1", label: "1" },
            { value: "2", label: "2" },
          ],
          source: "UI-Verified by Mackenzie",
        },
        // Source: Decompiled/Cfs.Fans.FanSelector/Cfs.Fans.FanSelector/Material.cs (subset)
        {
          name: "birdscreenMaterial",
          label: "Birdscreen Material",
          type: "enum",
          required: false,
          options: [
            { value: "galvanized", label: "Galvanized" },
            { value: "aluminum", label: "Aluminum" },
            { value: "stainless", label: "Stainless Steel" },
            { value: "none", label: "None" },
          ],
        },
        // Source: UI-Verified by Mackenzie (2024-12-18)
        {
          name: "fasteners",
          label: "Fasteners",
          type: "enum",
          required: false,
          options: [
            { value: "standard", label: "Standard" },
            { value: "stainlessSteel", label: "Stainless Steel" },
          ],
          source: "UI-Verified by Mackenzie",
        },
      ],
    },
    {
      name: "Accessories",
      fields: [
        // Source: Decompiled/Cfs.Fans.FanSelector/Cfs.Fans.FanSelector/IFanSelector.cs - HasDamper property
        {
          name: "damper",
          label: "Damper",
          type: "boolean",
          required: false,
          options: [
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ],
        },
        // Source: UI-Verified by Mackenzie (2024-12-18)
        {
          name: "unitWarranty",
          label: "Unit Warranty",
          type: "enum",
          required: false,
          options: [
            { value: "1yr", label: "1 Yr (Standard)" },
            { value: "2yrExt", label: "2 Yrs (1 Yr Ext)" },
            { value: "3yrExt", label: "3 Yrs (2 Yrs Ext)" },
            { value: "4yrExt", label: "4 Yrs (3 Yrs Ext)" },
            { value: "5yrExt", label: "5 Yrs (4 Yrs Ext)" },
          ],
          source: "UI-Verified by Mackenzie",
        },
        // Source: UI-Verified by Mackenzie (2024-12-18)
        {
          name: "specialNameplate",
          label: "Special Nameplate",
          type: "boolean",
          required: false,
          options: [
            { value: "no", label: "No" },
            { value: "yes", label: "Yes" },
          ],
          source: "UI-Verified by Mackenzie",
        },
      ],
    },
    {
      name: "Damper Options",
      fields: [
        // Source: UI-Verified by Mackenzie (2024-12-18)
        {
          name: "damperModel",
          label: "Model",
          type: "enum",
          required: false,
          options: [
            { value: "bd100", label: "BD-100" },
            { value: "wd100", label: "WD-100" },
            { value: "vcd20", label: "VCD-20" },
            { value: "vcd23", label: "VCD-23" },
            { value: "vcd33", label: "VCD-33" },
            { value: "vcd34", label: "VCD-34" },
            { value: "vcd42", label: "VCD-42" },
            { value: "vcd43", label: "VCD-43" },
          ],
          source: "UI-Verified by Mackenzie",
          notes: "Only if Damper = Yes",
        },
        // Source: UI-Verified by Mackenzie (2024-12-18)
        {
          name: "damperMounting",
          label: "Damper Mounting",
          type: "enum",
          required: false,
          options: [
            { value: "loose", label: "Loose" },
          ],
          source: "UI-Verified by Mackenzie",
          notes: "Only 'Loose' option available in current UI",
        },
        // Source: UI-Verified by Mackenzie (2024-12-18)
        {
          name: "damperQuantity",
          label: "Damper Quantity",
          type: "enum",
          required: false,
          options: [
            { value: "1", label: "1" },
          ],
          source: "UI-Verified by Mackenzie",
          notes: "Only '1' option available in current UI",
        },
        // Source: UI-Verified by Mackenzie (2024-12-18)
        {
          name: "bladeAction",
          label: "Blade Action",
          type: "enum",
          required: false,
          options: [
            { value: "parallel", label: "Parallel" },
          ],
          source: "UI-Verified by Mackenzie",
          notes: "Only 'Parallel' option available in current UI",
        },
        // Source: UI-Verified by Mackenzie (2024-12-18)
        {
          name: "damperMountingType",
          label: "Damper Mounting Type",
          type: "enum",
          required: false,
          options: [
            { value: "channel", label: "Channel" },
          ],
          source: "UI-Verified by Mackenzie",
          notes: "Only 'Channel' option available in current UI",
        },
        // Source: UI-Verified by Mackenzie (2024-12-18)
        {
          name: "actuatorType",
          label: "Actuator Type",
          type: "enum",
          required: false,
          options: [
            { value: "gravity", label: "Gravity" },
          ],
          source: "UI-Verified by Mackenzie",
          notes: "Only 'Gravity' option available in current UI",
        },
        // Source: UI-Verified by Mackenzie (2024-12-18)
        {
          name: "endSwitch",
          label: "End Switch",
          type: "boolean",
          required: false,
          options: [
            { value: "no", label: "No" },
            { value: "yes", label: "Yes" },
          ],
          source: "UI-Verified by Mackenzie",
        },
      ],
    },
    {
      name: "Mounting Accessories",
      fields: [
        // Source: UI-Verified by Mackenzie (2024-12-18)
        {
          name: "roofCurbs",
          label: "Roof Curbs",
          type: "boolean",
          required: false,
          options: [
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ],
          source: "UI-Verified by Mackenzie",
          notes: "Triggers separate configuration",
        },
        // Source: UI-Verified by Mackenzie (2024-12-18)
        {
          name: "curbExtension",
          label: "Curb Extension",
          type: "boolean",
          required: false,
          options: [
            { value: "no", label: "No" },
            { value: "yes", label: "Yes" },
          ],
          source: "UI-Verified by Mackenzie",
        },
        // Source: UI-Verified by Mackenzie (2024-12-18)
        {
          name: "curbCapAdapter",
          label: "Curb Cap Adapter",
          type: "boolean",
          required: false,
          options: [
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ],
          source: "UI-Verified by Mackenzie",
        },
        // Source: UI-Verified by Mackenzie (2024-12-18)
        {
          name: "hingedCurbCap",
          label: "Hinged Curb Cap",
          type: "enum",
          required: false,
          options: [
            { value: "none", label: "None" },
            { value: "factoryInstalled", label: "Factory Installed" },
            { value: "shippedLoose", label: "Shipped Loose" },
          ],
          source: "UI-Verified by Mackenzie",
        },
        // Source: UI-Verified by Mackenzie (2024-12-18)
        {
          name: "curbSeal",
          label: "Curb Seal",
          type: "enum",
          required: false,
          options: [
            { value: "no", label: "No" },
            { value: "foamApplied", label: "Foam - Applied" },
            { value: "foamLoose", label: "Foam - Loose" },
          ],
          source: "UI-Verified by Mackenzie",
        },
        // Source: UI-Verified by Mackenzie (2024-12-18)
        {
          name: "tieDownPoints",
          label: "Tie Down Points",
          type: "boolean",
          required: false,
          options: [
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ],
          source: "UI-Verified by Mackenzie",
        },
      ],
    },
  ],
};

// ============================================================================
// EXPORT ALL SCREENS
// ============================================================================

export const capsScreens: CapsScreen[] = [
  sizingInputsScreen,
  electricalMotorScreen,
  configurationScreen,
];

// Helper functions
export function getFieldByName(name: string): CapsField | undefined {
  for (const screen of capsScreens) {
    for (const section of screen.sections) {
      const field = section.fields.find((f) => f.name === name);
      if (field) return field;
    }
  }
  return undefined;
}

export function getAllFields(): CapsField[] {
  const fields: CapsField[] = [];
  for (const screen of capsScreens) {
    for (const section of screen.sections) {
      fields.push(...section.fields);
    }
  }
  return fields;
}

export function getRequiredFields(): CapsField[] {
  return getAllFields().filter((f) => f.required);
}

export function getTotalFieldCount(): number {
  return getAllFields().length;
}
