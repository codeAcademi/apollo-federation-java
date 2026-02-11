# Apollo MCP Server - AI-Powered Intent Detection

The MCP server now uses **Anthropic's Claude AI** for intelligent intent detection instead of simple keyword matching.

## Setup

1. Get your Anthropic API key from https://console.anthropic.com/settings/keys

2. Create a `.env` file in the `mcp-server` directory:
```bash
cd mcp-server
cp .env.example .env
```

3. Edit `.env` and add your API key:
```
ANTHROPIC_API_KEY=sk-ant-api03-...
```

4. Restart the MCP server:
```bash
cd ..
./stop-all.sh
./start-all.sh
```

## How It Works

- When a user sends a message, Claude analyzes the intent and extracts parameters
- Claude understands natural language queries like:
  - "Show me all laptops" → searches for laptop products
  - "What orders does customer 3 have?" → gets customer orders
  - "List gold tier customers" → filters customers by tier
  - "Find electronics" → filters products by category

## Fallback Mode

If no API key is configured, the system automatically falls back to keyword-based detection so the app continues to work without AI.

## AI Model

- Uses: **Claude Sonnet 4.5** (claude-sonnet-4-20250514)
- Fast, accurate intent detection
- Natural language understanding
- Parameter extraction from conversational text
