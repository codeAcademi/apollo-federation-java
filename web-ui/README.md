# Web UI

Interactive web interface for the Apollo Federation demo.

## Overview

This web UI provides:
- Service status monitoring
- GraphQL query playground
- Example queries
- AI integration instructions

## Installation

```bash
npm install
```

## Running

```bash
npm start
```

The UI will be available at: http://localhost:3000

## Features

### Service Status Monitor
Real-time status checks for all services:
- Products Service (8081)
- Orders Service (8082)
- Customers Service (8083)
- Apollo Gateway (4000)

### GraphQL Playground
Execute GraphQL queries directly against the federation gateway with:
- Pre-built example queries
- Syntax highlighting
- Formatted JSON results

### AI Integration Guide
Step-by-step instructions for connecting Claude Desktop to the MCP server.

## Example Queries

The UI includes several pre-built queries:
- Get all products
- Get all customers
- Get all orders
- Get customer with orders (cross-service)
- Complex federation query

## Development

```bash
npm run dev
```

Uses nodemon for auto-reload on file changes.
