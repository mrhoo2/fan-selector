# Product Context: Greenheck Fan Selection Software

## System Architecture

### Core Components
```
┌─────────────────────────────────────────────────────────────┐
│                    FanSelector.Wrapper                       │
│  (Post-processing, pricing, ranking, QD availability)        │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                      FanSelector                             │
│  (Core selection logic, air performance, validation)         │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│               FanSelectorRepository                          │
│  (Data access layer - SQLite database)                       │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                   MotorSelector2                             │
│  (Motor business rules, preprocessing)                       │
└─────────────────────────────────────────────────────────────┘
```

### Key DLLs Analyzed
| DLL | Purpose |
|-----|---------|
| `Cfs.Fans.FanSelector.dll` | Core selection algorithm |
| `Cfs.Fans.FanSelector.Wrapper.dll` | Extended functionality, post-processing |
| `Cfs.Fans.FanSelector.Data.dll` | Entity models for database |
| `Cfs.Fans.FanSelector.Data.Repo.dll` | Repository pattern data access |
| `Cfs.Fans.MotorSelector2.dll` | Motor selection business rules |
| `Cfs.Fans.DimensionWeightCalc.dll` | Dimension/weight calculations |

## Data Model

### Selection Hierarchy
```
Model (e.g., "G", "GB")
  └── Size (e.g., "103", "143HP", "203")
        └── Selection
              ├── DirectDrive (for G series)
              ├── BeltDrive (for GB series)
              └── VariGreen (for VG motor types)
```

### Key Database Tables
- `Selection` - Model/size combinations
- `Size` - Size properties, K-corrections, validation limits
- `BeltDrive` - Belt drive configurations
- `DirectDrive` - Direct drive motor data
- `VariGreen` - VariGreen motor specifications
- `AirTest` / `AirTestPoint` - Performance curves
- `Sound` / `Sones` - Sound data
- `Class` - Fan class speed limits

## Selection Flow

### 1. Input Reception
```
FanSelector receives:
- Volume (CFM)
- Static/Total Pressure
- Elevation, Temperature
- Drive preferences
- Construction options
```

### 2. Model/Size Loop
```csharp
// From FanCalcs.cs
for each model in requestedModels:
    for each size in model.sizes:
        if HasDriveTypeToRate(sizeId, driveType):
            PerformRating(selection, driveType, speed, speedMin)
```

### 3. Validation Pipeline
```
1. CheckMinMaxTemperature
2. CheckMaxStackedModules
3. CheckInletSupport (Damper, Guard, Box)
4. CheckOutletGuardSupported
5. CheckSilencerSupported
6. CalculateAirPerformance
7. CheckRatingLimits (Min/Max RPM, Volume tolerance, Surge lines)
8. CalculateSoundOutputs
9. CalculateFEI (if enabled)
```

### 4. Output Generation
```
Valid selections → FanSelections collection
Invalid selections → InvalidFanSelections with error codes
```

## Technology Stack
- **.NET Framework** (COM-visible for legacy integration)
- **Entity Framework** (Database ORM)
- **SQLite** (Performance data storage)
- **XML Serialization** (Configuration/state persistence)
- **JSON.NET** (API serialization)

## Integration Points
- COM interfaces for Delphi/legacy applications
- Web services (Greenheck.Atmos.Client)
- XML/JSON for data exchange
