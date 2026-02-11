# 🚀 Quick Start Guide

Get the complete Apollo Federation demo running in under 5 minutes!

## Prerequisites

Before you begin, ensure you have:

- ✅ **Java 17+** - `java -version`
- ✅ **Maven 3.6+** - `mvn -version`
- ✅ **Node.js 18+** - `node -version`
- ✅ **npm 9+** - `npm -version`

## Option 1: Automated Start (Recommended)

### 1. Make scripts executable
```bash
chmod +x start-all.sh stop-all.sh
```

### 2. Start all services
```bash
./start-all.sh
```

This will:
- ✓ Check prerequisites
- ✓ Build all Java services
- ✓ Install Node.js dependencies
- ✓ Start all 6 services in the background
- ✓ Create logs in the `logs/` directory

### 3. Open the demo
```bash
open http://localhost:3000
```

### 4. Stop all services
```bash
./stop-all.sh
```

## Option 2: Manual Start

### Terminal 1: Products Service
```bash
cd services/products-service
mvn spring-boot:run
```
Wait for: "Products Service (Subgraph)" message

### Terminal 2: Orders Service
```bash
cd services/orders-service
mvn spring-boot:run
```
Wait for: "Orders Service (Subgraph)" message

### Terminal 3: Customers Service
```bash
cd services/customers-service
mvn spring-boot:run
```
Wait for: "Customers Service (Subgraph)" message

### Terminal 4: Apollo Gateway
```bash
cd gateway
npm install
npm start
```
Wait for: "Apollo Federation Gateway ready" message

### Terminal 5: Web UI
```bash
cd web-ui
npm install
npm start
```
Wait for: "Web UI Server" message

### Terminal 6: MCP Server (Optional)
```bash
cd mcp-server
npm install
npm start
```

## 🎯 What to Do Next

### 1. Explore the Web UI
Open http://localhost:3000 to:
- View service status
- Execute GraphQL queries
- See federation in action

### 2. Try Example Queries

**Get all products:**
```graphql
query {
  products {
    id
    name
    price
    stock
  }
}
```

**Cross-service query (Customer with Orders):**
```graphql
query {
  customer(id: "1") {
    name
    email
    orders {
      id
      totalAmount
      status
      items {
        product {
          name
          price
        }
        quantity
      }
    }
  }
}
```

### 3. Test with GraphQL Playground
Visit http://localhost:4000 for the Apollo Gateway playground

### 4. Connect Claude AI (Optional)

**macOS:** Edit `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows:** Edit `%APPDATA%\Claude\claude_desktop_config.json`

Add:
```json
{
  "mcpServers": {
    "apollo-graphql": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-server/index.js"]
    }
  }
}
```

Restart Claude Desktop, then ask:
- "Show me all electronics products"
- "List Alice Johnson's orders"
- "Create an order for customer 1"

## 📊 Service Ports

| Service | Port | URL |
|---------|------|-----|
| Products | 8081 | http://localhost:8081/graphql |
| Orders | 8082 | http://localhost:8082/graphql |
| Customers | 8083 | http://localhost:8083/graphql |
| Gateway | 4000 | http://localhost:4000 |
| Web UI | 3000 | http://localhost:3000 |

## 🐛 Troubleshooting

### Port already in use
```bash
# Find and kill process on port 8081 (example)
lsof -ti:8081 | xargs kill -9
```

### Services won't start
```bash
# Clean build
mvn clean install

# Check Java version
java -version  # Should be 17+
```

### Gateway can't connect to services
- Ensure all 3 Spring Boot services are running
- Check logs: `tail -f logs/products-service.log`
- Verify ports: `lsof -i :8081,8082,8083`

### Node modules issues
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## 📚 Next Steps

1. Read [README.md](README.md) for architecture details
2. Check [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) for technical details
3. Explore service code in `services/`
4. Customize schemas in `src/main/resources/schema/`

## 💡 Tips

- Use the Web UI for quick testing
- GraphQL Playground has built-in documentation
- Check logs in `logs/` directory when debugging
- Each service has its own README in its directory

---

**Need help?** Check the logs or review the service-specific README files!
