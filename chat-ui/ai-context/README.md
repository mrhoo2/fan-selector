# AI Context Files for Per-Section Generation

## Overview

This directory contains detailed context files for AI-driven parameter generation for Greenheck exhaust fans. Instead of making one large LLM call to generate all parameters at once, we make **one LLM call per section**, using focused context to generate accurate, well-reasoned selections.

## Structure

```
ai-context/
├── README.md                    # This file - per-section generation overview
├── EQUIPMENT_SELECTION_GUIDE.md # Quick reference for AI during generation
├── exhaust-fans/                # Context files for G/GB series exhaust fans
│   ├── performance.md           # CFM, Static Pressure, Elevation, Temperature
│   ├── electrical.md            # Voltage, Phase, Frequency, Motor settings
│   ├── drive-type.md            # Direct vs Belt, VariGreen, sizing options
│   ├── accessories.md           # Damper, Disconnect, Coatings, Birdscreen
│   └── environment.md           # Special requirements, Warranty, Mounting
```

## File Format

Each markdown file represents one **section** of the equipment configuration. Each file contains:

### 1. Section Overview
Brief description of what this section controls.

### 2. Field Definitions
For each field in the section:
- **Field ID and Name**
- **Required/Optional status**
- **AUTO-GENERATE vs ASK HUMAN** designation
- **Available Options** with IDs and descriptions
- **Selection Logic** - business rules for choosing options
- **AI Generation Strategy** - specific instructions for the AI
  - When to use defaults
  - When to ask the human
  - Conditional logic based on other fields

### 3. Dependencies
Other sections/fields that affect or are affected by this section.

### 4. Common Scenarios
Real-world examples showing complete section configurations with reasoning.

### 5. Human Input Summary
Clear guidance on which fields require human input vs. can be auto-generated.

## Design Principles

### Minimize Human Questions
The goal is to **accurately AI-generate as much as possible** while only asking humans for truly critical information:

**ALWAYS ASK:**
- CFM (airflow volume) - Core performance requirement
- Static Pressure (SP) - Core performance requirement
- Voltage/Phase (if not standard commercial)

**MAYBE ASK:**
- Drive Type (if user seems to have preference)
- Damper (if application suggests need)
- Special environments (coastal, high altitude, hazardous)

**NEVER ASK:**
- Frequency (use 60Hz for US)
- Motor enclosure (use TEFC default)
- Birdscreen material (use Galvanized default)
- Fasteners (use Standard default)
- Most accessories (default to None/false)

### Smart Defaults for Greenheck G/GB Fans
Each field specifies intelligent defaults based on:
- Industry best practices (e.g., TEFC enclosure, 460V/3-phase)
- Most common selections (e.g., Galvanized birdscreen)
- Safety/code requirements (e.g., gravity backdraft damper)
- Application type (e.g., spark resistance for labs)
- Previously determined parameters (e.g., belt drive for high CFM)

### Context Awareness
AI generation considers:
- **Previous selections** in earlier sections
- **Project location** (climate, codes, elevation)
- **Application type** (general exhaust, kitchen, lab, parking)
- **User-provided information** from conversation

## Usage in Code

The AI generation process:

1. **Load section context** from markdown file
2. **Gather relevant previous selections** (e.g., CFM determines G vs GB)
3. **Make focused LLM API call** for this section only
   - Include: section context, previous selections, user requirements
   - Request: selections for fields in this section with reasoning
4. **Store results** for use as context in subsequent sections
5. **Repeat** for each section in order

## Section Processing Order

Sections should be processed in dependency order:

1. **Performance** (CFM, SP) → User MUST provide these
2. **Drive Type** (Direct/Belt/VG) → Determines series (G vs GB)
3. **Electrical** (Voltage, Phase, Motor) → Depends on drive type
4. **Environment** (Elevation, Temperature, Special) → Application-specific
5. **Accessories** (Damper, Disconnect, Coatings) → Defaults with overrides

## Benefits of This Approach

1. **Higher Accuracy**: Focused context leads to better decisions
2. **Better Reasoning**: Can explain each choice individually
3. **Easier Debugging**: See exactly which section had issues
4. **Progressive Refinement**: Each decision informs the next
5. **Maintainability**: Easy to update context for specific fields
6. **Flexibility**: Can skip/modify sections based on equipment type
7. **Better Defaults**: Each section has optimized defaults for its domain

## G vs GB Series Quick Reference

| Criteria | G Series (Direct Drive) | GB Series (Belt Drive) |
|----------|------------------------|------------------------|
| CFM Range | < 10,000 CFM | Any, best for > 10,000 |
| Maintenance | Lower | Higher (belts) |
| Noise | Quieter | Louder |
| Flexibility | Fixed speed options | More motor/speed options |
| VariGreen | G-XXX-VG models | Not available |
| Sizes | 060-203 | 80-360 |

## Maintenance

When updating context files:
- Keep language clear and technical
- Provide concrete examples in scenarios
- Update based on real-world feedback
- Ensure consistency with CAPS field definitions
- Test changes with sample configurations

## Related Files

- `chat-ui/lib/fan-context.ts` - CAPS_FIELDS definitions and system prompt
- `chat-ui/lib/caps-generator.ts` - CAPS clipboard generation
- `memory-bank/caps-field-verification.md` - Complete field audit
