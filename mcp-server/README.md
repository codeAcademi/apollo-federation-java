# Apollo MCP Server with Claude Sonnet 4.5

Model Context Protocol server with **AI-powered intent detection** using Anthropic Claude Sonnet 4.5.

## Overview

This MCP server uses **Anthropic Claude Sonnet 4.5** for intelligent natural language understanding. It converts user queries like "Show me Alice's orders" into optimized GraphQL queries, automatically:
- Detecting user intent (search, list, filter)
- Extracting parameters (customer names, categories, tiers)
- Selecting only requested fields (e.g., just "name" when asked)
- Resolving natural references ("Alice" → "Alice Johnson")

## Installation

```bash
npm install
```

## AI Configuration

**Required:** Configure your Anthropic API key. See [AI_SETUP.md](AI_SETUP.md) for details.

```bash
cp .env.example .env
# Edit .env and add your Anthropic API key
```

## Running

```bash
npm start
```

## Prerequisites

The Apollo Gateway must be running at http://localhost:4000

## Available Tools

The MCP server exposes these tools to AI clients:

### Query Tools
- **get_products** - List all products or filter by category
- **search_products** - Search products by name or SKU
- **get_customers** - List all customers or filter by tier
- **get_customer_orders** - Get order history for a customer
- **get_orders** - List all orders or filter by status

### Mutation Tools
- **create_order** - Create a new order
- **update_order_status** - Update an order's status

## Integration with Claude

To use this with Claude Desktop, add to your Claude config:

### macOS
Edit: `~/Library/Application Support/Claude/claude_desktop_config.json`

### Windows
Edit: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "apollo-graphql": {
      "command": "node",
      "args": ["/path/to/apollo-federation-java/mcp-server/index.js"]
    }
  }
}
```

## Example Usage

Once connected, you can ask Claude:
- "Show me all electronics products"
- "What orders does customer Alice Johnson have?"
- "Create an order for customer 1 with product 3"
- "Update order ORD-005 status to PROCESSING"

## Configuration

The gateway URL is configured in `index.js`. Update `GATEWAY_URL` if your gateway runs on a different port.
