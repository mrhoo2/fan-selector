# G and GB Series Fan Selection Analysis

## Overview
Based on the decompiled code from the Greenheck/Accurex fan selection software, the **G** and **GB** series are roof-mounted fans:

| Model | Type | Description |
|-------|------|-------------|
| **G** | Direct Drive | Aluminum spun roof-mounted fan |
| **GB** | Belt Drive | Aluminum spun roof-mounted fan |

### Model Mapping (Accurex to Greenheck)
```
XRED → G   (Direct Drive)
XREB → GB  (Belt Drive)
```

---

## Input Parameters

### 1. Core Selection Inputs (from FanSelector.cs)
- **Volume** (CFM) - Air volume requirement
- **StaticPressure** - Required static pressure
- **TotalPressure** - Total pressure when applicable
- **Elevation** - Installation elevation
- **AirstreamTemperature** - Operating temperature (default: 70°F)
- **StartupTemperature** - Startup temperature (default: 70°F)
- **PowerFrequency** - 50Hz or 60Hz

### 2. Motor/Drive Configuration
- **DriveType** - Direct/Belt/Any
- **AllowVfd** - No/Yes/OverSpeed/Both
- **MotorSizingMethod** - At60HzSpeed
- **VariGreenOnly** - VG motor preference

### 3. Construction Options
- **Material** - Material type (default: Unspecified)
- **SparkResistance** - SparkResistanceOptions.None/TypeA/TypeB/TypeC
- **InsulatedHousing** - Boolean
- **RequiresHighWind** - High wind rating requirement
- **RequiresSeismic** - Seismic rating requirement

### 4. Mounting & Configuration
- **CurbMounted** - CurbMountedPreferenceType
- **WallHousing** - WallHousingOptions
- **Weatherhood** - WeatherhoodOptions
- **Discharge** - Discharges type

---

## G Series Specific Validation (Direct Drive)

### Size Options
From `BusinessLogicLayer.cs`, G model sizes include:
```
"103", "103HP", "123", "133", "143", "143HP", "163", "163HP", "183", "203"
```

### Motor Shaft Preference
```csharp
// LongMotorShaftPreferredCheck
if (fanModel == "G" && source.Contains(fanSize))
{
    return true; // Long motor shaft is preferred
}
```

### Speed Code "G" Validation
When SpeedCode is "G", the fan is flagged as direct-drive:
```csharp
switch (speedCode)
{
    case "D":
    case "G":
    case "E":
    case "P":
        flag2 = true;  // Direct drive flag
        break;
}
```

### Power Rating Check Skip
G series is included in models that skip power rating checks for certain motor types:
```csharp
string[] source = new string[10] { "G", "CW", "CUE", "SQ", "SE1", "SE2", "SS1", "SS2", "LD", "LDP" };
int[] speedsToSkip = new int[5] { 1050, 1290, 1300, 1425, 1550 };

if (motorType.Equals(MotorType.ShadedPole) || 
    motorType.Equals(MotorType.PermanentSplitCapacitor) ||
    motorType.Equals(MotorType.ShadedPoleOrPsc))
{
    if (source.Contains(fanModelName))
    {
        // Skip power rating check for specific speeds
    }
}
```

---

## GB Series Specific Validation (Belt Drive)

### Housing Material Override (IEC Motors)
```csharp
case EnclosureType.Ip55:
    housingMaterial = (
        ((coolingMethod == CoolingMethod.Ic410 || coolingMethod == CoolingMethod.Ic411) 
        && (insulationClass == InsulationClass.F || insulationClass == InsulationClass.H)) 
        ? HousingMaterial.AluminumPreferred 
        : ((speed.Count() != 1 || (!(fanModel == "GB") && !(fanModel == "BSQ"))) 
            ? HousingMaterial.IronPreferred 
            : HousingMaterial.Aluminum));
    break;
```

For GB series with IP55 enclosure and single speed:
- **Aluminum housing** is preferred when specific conditions are met

---

## Verification/Validation Checks

### 1. Temperature Checks
```csharp
ChecksMinMaxTemperature.CheckMinMaxTemperatures(
    selection.DriveType, 
    selector.AirstreamTemperature, 
    selector.StartupTemperature, 
    variGreenMotor, 
    _driveTypeTables.BeltDrive,  // For GB
    _driveTypeTables.VariGreen, 
    _driveTypeTables.DirectDrive  // For G
);
```

### 2. Speed Validation
- **Minimum Speed Check** - Ensures speed is above minimum for drive type
- **Maximum Speed Check** - Ensures speed is below class maximum
- **VFD Frequency Limits** - For VFD selections

### 3. Surge Line Checks
```csharp
AirPerformanceCalculations.CheckSurgeLines(...)
```
Validates operating point is not in unstable surge zone.

### 4. Volume Tolerance Checks
```csharp
AirPerformanceCalculations.CheckVolumeToleranceLimits(...)
```

### 5. Stability Warnings (from FanSelectorWrapper.cs)
For direct drive fans (G series):
```csharp
if (driveType == DriveType.Direct && num12 < 0f)
{
    selection.Stable = false;
    selection.StabilityMessages.Add("Operating volume below required volume by " + num12 + "%");
}

if (driveType == DriveType.Direct && num12 >= 25f)
{
    selection.Stable = false;
    selection.StabilityMessages.Add("Operating volume above required volume by " + num12 + "%");
}
```

For belt drive fans (GB series):
```csharp
if (driveType == DriveType.Belt && num4 > 0f && num10 <= 5f)
{
    selection.Stable = false;
    selection.StabilityMessages.Add("Operating speed within 5% of max RPM");
}
```

### 6. Rating Limits Check
```csharp
RatingLimits ratingLimits = AirPerformanceCalculations.CheckRatingLimits(
    _fanSelectorRepository, 
    selectionByModelAndSequence,
    ...
);
```
Includes:
- Min RPM validation
- Max RPM validation  
- Volume tolerance limits
- Surge line checks
- Performance baffle calculations

---

## Selection Output Properties

### Key Performance Outputs
- `OperatingVolume` - Actual operating CFM
- `OperatingStaticPressure` - Operating SP
- `OperatingPower` - BHP
- `Speed` / `SpeedNonAdjusted` - Fan RPM
- `SpeedMax` - Maximum allowable RPM
- `SpeedMin` - Minimum RPM
- `StaticEfficiency` / `TotalEfficiency`
- `FanClass` - AMCA Fan Class

### Motor Sizing Outputs
- `MinimumMotorSizeNema` - NEMA motor HP
- `MinimumMotorSizeIec` - IEC motor kW
- `MotorType` - Motor type code

### Sound Outputs
- `InletSound` - Sound summary
- `OutletSound` - Sound summary
- `RadiatedSound` - Radiated sound

---

## Error Codes Reference

| Code | Description |
|------|-------------|
| 1032 | Missing drive configuration data |
| 5018 | Unsupported drive type |
| 5053 | Recommended size calculation error |
| 5077 | Root pitch data missing |
| 5087 | Construction type not supported |
| 5106 | Requested construction type mismatch |
| 5111 | Unsupported exhaust system fan quantity |
| 5112 | Unsupported redundancy option |
| 6001 | QD availability not available |

---

## Database Tables/Data Sources

The selection logic queries these key data tables:
- `Selection` - Model/size combinations
- `Size` - Size properties and K-corrections
- `BeltDrive` - Belt drive configurations (GB)
- `DirectDrive` - Direct drive configurations (G)
- `VariGreen` - VariGreen motor data
- `AirTest` / `AirTestPoint` - Performance data
- `Sound` / `Sones` - Sound data
- `Class` - Fan class limits
- `FanSeriesMaxIp` / `FanSeriesMaxQei` / `FanSeriesMaxUsfa` - Series maximum limits

---

## Summary

For **G series** (direct drive) selections:
1. Validate requested volume/pressure against air data curves
2. Check direct drive speed availability for power frequency
3. Apply static pressure corrections for accessories
4. Calculate operating point and verify within system curve
5. Check stability (volume within ±25% of target)
6. Verify motor sizing and speed range

For **GB series** (belt drive) selections:
1. Same air performance validation
2. Check belt drive configuration availability
3. Verify speed range within belt drive limits
4. Check stability (operating speed > 5% below max)
5. Special housing material rules for IP55/IEC

Both series require:
- Temperature validation
- Spark resistance verification (if required)
- Sound calculations
- FEI calculations (if enabled)
- Manufacturing location checks
