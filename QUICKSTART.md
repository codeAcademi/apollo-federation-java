# 🚀 Quick Start Guide

Get the Apollo Federation demo running in 5 minutes!

## Prerequisites

Verify you have these installed:

```bash
java -version    # Should show 17+
mvn -version     # Should show 3.6+
node -version    # Should show 18+
npm -version     # Should show 9+
```

## Installation

### Option 1: Automated (Recommended)

```bash
# Clone the repository
git clone https://github.com/codeAcademi/apollo-federation-java.git
cd apollo-federation-java

# Build and start all services
mvn clean install
./start-all.sh

# Open the demo
open http://localhost:3000
```

### Option 2: Manual

If you prefer to start services individually for debugging:

```bash
# Terminal 1: Products Service
cd services/products-service
mvn spring-boot:run

# Terminal 2: Orders Service  
cd services/orders-service
mvn spring-boot:run

# Terminal 3: Customers Service
cd services/customers-service
mvn spring-boot:run

# Terminal 4: Apollo Gateway
cd gateway
npm install && npm start

# Terminal 5: MCP Server
cd mcp-server
npm install && npm start

# Terminal 6: Web UI
cd web-ui
npm install && npm start
```

## Verify Services

Check that all services are running:

```bash
curl http://localhost:8081/actuator/health  # Products ✓
curl http://localhost:8082/actuator/health  # Orders ✓
curl http://localhost:8083/actuator/health  # Customers ✓
curl http://localhost:4000/.well-known/apollo/server-health  # Gateway ✓
curl http://localhost:5001/api/health       # MCP Server ✓
curl http://localhost:3000                  # Web UI ✓
```

## Access Points

| Service | URL | Description |
|---------|-----|-------------|
| **Web UI** | http://localhost:3000 | Main demo interface |
| **GraphQL Playground** | http://localhost:4000 | Apollo Gateway playground |
| **Products API** | http://localhost:8081/graphql | Products subgraph |
| **Orders API** | http://localhost:8082/graphql | Orders subgraph |
| **Customers API** | http://localhost:8083/graphql | Customers subgraph |
| **MCP Server** | http://localhost:5001 | AI-powered query interface |

## Try Example Queries

### Via Web UI (Natural Language)

Open http://localhost:3000 and try:

- "Show me all products"
- "List electronics"
- "What orders does Alice have?"
- "Find platinum customers"

### Via GraphQL Playground

Open http://localhost:4000 and try:

```graphql
# Basic query
query {
  products {
    id
    name
    price
  }
}

# Federated query (spans multiple services)
query {
  orders {
    id
    status
    product {      # From Products Service
      name
      price
    }
    customer {     # From Customers Service
      name
      tier
    }
  }
}
```

## Stop Services

```bash
./stop-all.sh
```

This will terminate all background processes and clean up PID files.

## Troubleshooting

### Build Fails

**Issue**: Lombok compatibility errors

**Fix**: Ensure you're using Java 17. Check with `java -version`

```bash
# macOS with multiple Java versions
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
java -version
mvn clean install
```

### Gateway Won't Start

**Issue**: `ECONNREFUSED` errors

**Fix**: Start Spring Boot services first, wait 10-15 seconds, then start Gateway

```bash
# Start services individually and wait
cd services/products-service && mvn spring-boot:run &
sleep 5
cd services/orders-service && mvn spring-boot:run &
sleep 5
cd services/customers-service && mvn spring-boot:run &
sleep 10

# Now start gateway
cd gateway && npm start
```

### Services Already Running

**Issue**: Port already in use

**Fix**: Stop all services first

```bash
./stop-all.sh
# Kill any remaining processes
lsof -ti:8081,8082,8083,4000,5001,3000 | xargs kill -9
# Start fresh
./start-all.sh
```

## Next Steps

- Check out the [main README](README.md) for architecture details
- Review [MCP Server setup](mcp-server/README.md) for AI configuration
- Explore [Gateway configuration](gateway/README.md) for customization
- See [Web UI docs](web-ui/README.md) for frontend details

## AI Configuration (Optional)

To enable Claude AI-powered query understanding:

1. Get an API key: https://console.anthropic.com/settings/keys
2. Create `mcp-server/.env`:
   ```bash
   ANTHROPIC_API_KEY=sk-ant-api03-...
   ```
3. Restart: `./stop-all.sh && ./start-all.sh`

Without an API key, the system uses keyword-based fallback mode.

---

**Need help?** Check the troubleshooting section or review service logs in the `logs/` directory.
