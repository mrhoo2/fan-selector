# Active Context: Current Focus & Working Memory

## Current Focus
**Task 5: CAPS Field Options Browser Display** ✅ COMPLETE

Created an interactive field options modal for the chat-ui that displays all CAPS input fields organized by the native Windows app screens.

---

## 🎯 Recently Completed Work

### CAPS Field Options Browser Display (2024-12-18)

**Files Created/Modified:**

1. **`chat-ui/lib/caps-field-options.ts`** - TypeScript data file with:
   - 58 total fields organized by 3 screens
   - Each field has an inline source comment for audit/validation
   - Source types: Decompiled C# enums, Database references, UI Sample observations
   - Helper functions: `getFieldByName()`, `getAllFields()`, `getRequiredFields()`, `getTotalFieldCount()`

2. **`chat-ui/components/field-options-modal.tsx`** - Interactive modal component:
   - Tabbed navigation for 3 screens (Sizing/Inputs, Electrical/Motor, Configuration/Construction)
   - Collapsible sections for each field group
   - Expandable option display per field
   - Shows field type, required status, source references

3. **`chat-ui/app/page.tsx`** - Updated main page:
   - Added "Display Input Fields" button in Quick Actions sidebar
   - Integrated modal with state management

### Source Reference Types Used

| Source Type | Description | Example |
|-------------|-------------|---------|
| `Decompiled/*.cs` | From decompiled C# enums | SparkResistanceOptions.cs, DriveType.cs |
| `Database (Fans.zip)` | SQLite tables inside Data/Core/English/Fans.zip | Efficiency codes, VariGreen options |
| `UI Sample` | Observed in native CAPS Windows app | Boolean toggles, numeric fields |

### Fields by Screen

| Screen | Sections | Fields |
|--------|----------|--------|
| **1. Sizing/Inputs** | 4 | 11 fields |
| **2. Electrical/Motor** | 6 | 26 fields |
| **3. Configuration/Construction** | 4 | 21 fields |
| **Total** | 14 | **58 fields** |

---

## 🔄 Previous Task: Field Mapping from Decompiled Code

### Found Decompiled Enums (Verified Sources)
| Enum File | Path | Options |
|-----------|------|---------|
| `SparkResistanceOptions.cs` | Decompiled/Cfs.Fans.FanSelector/Cfs.Fans.FanSelector/ | None, SparkA, SparkB, SparkC |
| `DriveType.cs` | Decompiled/Cfs.Fans.FanSelector/Cfs.Fans.FanSelector/ | Any, Belt, Direct |
| `DamperTypes.cs` | Decompiled/Cfs.Fans.FanSelector/Cfs.Fans.FanSelector/ | None, Backdraft, Control |
| `AllowVfd.cs` | Decompiled/Cfs.Fans.FanSelector/Cfs.Fans.FanSelector/ | No, UnderSpeed, OverSpeed, Both |
| `Material.cs` | Decompiled/Cfs.Fans.FanSelector/Cfs.Fans.FanSelector/ | Galvanized, Aluminum, StainlessSteel, etc. |
| `EnclosureType.cs` | Decompiled/Cfs.Fans.MotorSelector2/Cfs.Fans.MotorSelector2.Common/ | None, DP, OAO, TEAO, TEBC, TEFC, TENV, etc. |
| `ManufacturingLocation.cs` | Decompiled/Cfs.Fans.MotorSelector2/Cfs.Fans.MotorSelector2.Common/ | NoPreference, AmericasEurope, Usa |

### Interface Properties (IFanSelector.cs)
Located at: `Decompiled/Cfs.Fans.FanSelector/Cfs.Fans.FanSelector/IFanSelector.cs`

Key properties referenced:
- `RequiresHighWind` (bool)
- `RequiresSeismic` (bool)
- `AllowSpeedController` (bool)
- `AllowPerformanceBaffle` (bool)
- `HasDamper` (DamperTypes enum)
- `Voltage` (string)
- `Phase` (string)
- `RequiresUL762` (bool)

---

## 📋 Remaining Work (Future Tasks)

### Database Extraction (Lower Priority)
Some field options are stored in SQLite database inside `Data/Core/English/Fans.zip`:
- Efficiency code options (Title 24, Washington St, ASHRAE)
- VariGreen control options
- Damper model options
- Warranty options

To extract:
```bash
cd Data/Core/English
unzip Fans.zip -d Fans_extracted/
sqlite3 <database.db> ".tables"
```

### Validation Tasks
- [ ] Verify efficiency code options against native CAPS app
- [ ] Verify VariGreen control options against database
- [ ] Cross-check all field options with actual CAPS UI

---

## 📁 Key Project Files

### Chat UI (Active Development)
```
chat-ui/
├── app/page.tsx              # Main page with modal integration
├── components/
│   └── field-options-modal.tsx  # Field options display modal
├── lib/
│   ├── caps-field-options.ts    # Field definitions with source comments
│   ├── caps-generator.ts        # CAPS clipboard generation
│   └── fan-context.ts           # AI context loading
└── ai-context/                  # AI training documents
```

### Decompiled Sources (Reference)
```
Decompiled/
├── Cfs.Fans.FanSelector/         # Core selection enums
└── Cfs.Fans.MotorSelector2/      # Motor enums
```

---

## 📝 Notes for Future Work

1. **Source Comments Format**: Each field in caps-field-options.ts has a one-line comment above it showing the exact source file path for validation/audit.

2. **Database Extraction**: Fields marked "Database (Data/Core/English/Fans.zip)" need SQLite extraction to verify complete option lists.

3. **UI Sample Sources**: Fields marked "UI Sample" were observed from native CAPS Windows app screenshots - may need verification against actual software.

---

## Version History

| Date | Update |
|------|--------|
| 2024-12-18 | Created field options modal with source comments |
| 2024-12-18 | Mapped 58 fields across 3 screens to decompiled/database sources |
