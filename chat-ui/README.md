# Greenheck Fan Selector Chat UI

AI-powered chat interface for testing Greenheck CAPS (Computerized Automated Product Selection) software for G and GB series roof exhaust fans.

## Features

- 💬 **Conversational Interface** - Natural language input for fan requirements
- 🤖 **Claude Sonnet 4.5** - Powered by Anthropic's latest model
- 📋 **CAPS Integration** - Generates clipboard-ready data for CAPS testing
- 🎨 **BuildVision Design** - Styled with BV design system tokens

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS + BuildVision Design Tokens
- **AI:** Anthropic Claude SDK (streaming)
- **Package Manager:** Bun

## Getting Started

### 1. Install Dependencies

```bash
cd chat-ui
bun install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Anthropic API key:

```env
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
```

### 3. Run Development Server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variable: `ANTHROPIC_API_KEY`
4. Deploy

## Usage

### Example Prompts

- "I need a roof exhaust fan for 5000 CFM at 1.5" static pressure, 460V/3-phase, direct drive"
- "Restaurant kitchen exhaust, 3000 CFM, belt drive with backdraft damper"
- "Generate CAPS clipboard for G-163 at 4500 CFM"

### Supported Parameters

| Parameter | Description | Example Values |
|-----------|-------------|----------------|
| CFM | Airflow volume | 3000, 5000, 10000 |
| SP | Static Pressure | 0.5", 1.0", 1.5" |
| Voltage | Electrical | 115, 208, 230, 460, 575 |
| Phase | Electrical | 1, 3 |
| Drive Type | Fan drive | Direct, Belt, VariGreen |
| Damper | Backdraft | Yes, No, Gravity |

## Project Structure

```
chat-ui/
├── app/
│   ├── api/chat/route.ts    # Claude streaming API
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Main chat page
│   └── globals.css          # BV design tokens
├── components/
│   ├── ui/                  # Reusable UI components
│   └── message-bubble.tsx   # Chat message component
├── lib/
│   ├── fan-context.ts       # AI system prompt & helpers
│   └── utils.ts             # Utility functions
└── .env.example             # Environment template
```

## Related Projects

- `../fan-selector/` - TypeScript library for CAPS data mapping
- `../memory-bank/` - Project documentation and context

## License

Internal use only - BuildVision
