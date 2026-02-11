# Apollo Federation Demo - Spring Boot Microservices

## 🎯 Architecture Overview

This demo implements the **exact architecture from your presentation slides**:

```
User Prompt → Anthropic Claude Sonnet 4.5 → Apollo MCP Server → Apollo Gateway → Microservices
```

### Components

| Component | Technology | Port | Purpose |
|-----------|------------|------|---------|
| **Products Service** | Spring Boot + Netflix DGS | 8081 | Product catalog subgraph |
| **Orders Service** | Spring Boot + Netflix DGS | 8082 | Order management subgraph |
| **Customers Service** | Spring Boot + Netflix DGS | 8083 | Customer data subgraph |
| **Apollo Gateway** | Node.js + @apollo/gateway | 4000 | Federation gateway (schema stitching) |
| **Apollo MCP Server** | Node.js + MCP SDK + Claude Sonnet 4.5 | 5001 | AI-powered intent detection & MCP protocol |
| **Web UI** | HTML/CSS/JS | 3000 | Interactive demo interface |

## 🏗️ Why This Stack?

### Spring Boot for Microservices
- ✅ **Industry standard** for Java microservices
- ✅ **Netflix DGS** (Domain Graph Service) provides first-class GraphQL Federation support
- ✅ **Production-ready** with built-in monitoring, logging, security
- ✅ **Easy to understand** for Java developers

### Apollo Gateway (Node.js)
- ✅ **Official Apollo Federation implementation** - most mature and stable
- ✅ **Used by Netflix, Expedia, PayPal** in production
- ✅ **Automatic schema composition** from subgraphs
- ✅ **Query planning** and optimization built-in

### Apollo MCP Server (Node.js)
- ✅ **AI-Powered Intent Detection** using Anthropic Claude Sonnet 4.5
- ✅ **Natural Language Processing** - understands queries like "Show me Alice's orders"
- ✅ **Real MCP protocol** following spec exactly
- ✅ **Smart GraphQL Query Generation** - only fetches requested fields
- ✅ **Exposes GraphQL as AI tools** with automatic parameter extraction

## 📁 Project Structure

```
apollo-federation-java/
├── services/
│   ├── products-service/     # Spring Boot microservice (port 8081)
│   ├── orders-service/        # Spring Boot microservice (port 8082)
│   └── customers-service/     # Spring Boot microservice (port 8083)
├── gateway/                   # Apollo Gateway (Node.js, port 4000)
├── mcp-server/                # Apollo MCP Server (Node.js, port 5001)
├── web-ui/                    # Demo frontend (port 3000)
└── pom.xml                    # Parent POM for all Java services
```

## 🚀 Quick Start

### Prerequisites

- **Java 17** (`java -version`) - **⚠️ Java 17 specifically required for Lombok compatibility**
- **Maven 3.6+** (`mvn -version`)
- **Node.js 18+** (`node -version`)
- **npm 9+** (`npm -version`)

> **Note:** If you're using Java 21+ and encounter build errors, see [BUILD_NOTES.md](BUILD_NOTES.md) for solutions.

### Step 1: Build Java Services

```bash
cd apollo-federation-java
mvn clean install
```

If the build fails, check your Java version and see [BUILD_NOTES.md](BUILD_NOTES.md).

### Step 2: Install Node Dependencies

```bash
# Gateway
cd gateway
npm install

# MCP Server
cd ../mcp-server
npm install

# Web UI
cd ../web-ui
npm install
```

### Step 3: Start All Services

**Option A: Manual (for debugging)**

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
npm start

# Terminal 5: MCP Server
cd mcp-server
npm start

# Terminal 6: Web UI
cd web-ui
npm start
```

**Option B: Using the startup script**

```bash
./start-all.sh
```

### Step 4: Verify Services

```bash
# Check all services are up
curl http://localhost:8081/actuator/health  # Products
curl http://localhost:8082/actuator/health  # Orders
curl http://localhost:8083/actuator/health  # Customers
curl http://localhost:4000/health           # Gateway
curl http://localhost:5001/api/health       # MCP Server
```

## 🎬 Demo Flow

### 1. Open the Web UI
http://localhost:3000

### 2. Try Example Prompts

```
"Show me all products"
→ MCP selects: list_products tool
→ Gateway queries: Products Service
→ Result: All products from catalog

"Find electronics under $200"
→ MCP selects: search_by_category_and_price tool
→ Gateway queries: Products Service with filters
→ Result: Filtered product list

"Create an order for product 1"
→ MCP selects: create_order tool
→ Gateway queries: Orders Service (creates order)
→ Gateway queries: Products Service (via federation, gets product details)
→ Result: Order confirmation with product info
```

### 3. View GraphQL Federation in Action

Open Apollo Sandbox: http://localhost:4000/graphql

Try this **federated query** that spans multiple services:

```graphql
query FederatedOrderDetails {
  orders {
    id
    quantity
    status
    product {          # ← From Products Service via Federation
      name
      price
      category
    }
    customer {         # ← From Customers Service via Federation
      name
      email
      tier
    }
  }
}
```

**This is the magic**: The query starts in Orders Service, but Apollo Gateway automatically fetches related data from Products and Customers services using Federation!

## 🔍 Understanding the Flow

### Without AI (Direct GraphQL)

```
User
  ↓ writes GraphQL query
Apollo Gateway
  ↓ validates schema
  ↓ plans query across subgraphs
Products/Orders/Customers Services
  ↓ execute
Result
```

### With AI + MCP (Your Demo)

```
User
  ↓ "Show me cheap electronics"
Claude AI
  ↓ interprets intent
  ↓ queries MCP Server for available tools
Apollo MCP Server
  ↓ exposes GraphQL operations as MCP tools
  ↓ returns: search_by_category_and_price tool
Claude AI
  ↓ generates GraphQL query from tool definition
Apollo Gateway
  ↓ validates & executes across subgraphs
Products/Orders/Customers Services
  ↓ return data
Result returned to user
```

## 📊 Service Details

### Products Service (Spring Boot)

**GraphQL Schema:**
```graphql
type Product @key(fields: "id") {
  id: ID!
  name: String!
  category: String!
  price: Float!
  stock: Int!
}
```

**Queries:**
- `products` - Get all
- `product(id)` - Get by ID
- `productsByCategory(category)` - Filter by category
- `productsUnderPrice(maxPrice)` - Filter by price

### Orders Service (Spring Boot)

**GraphQL Schema:**
```graphql
type Order @key(fields: "id") {
  id: ID!
  product: Product!      # Federation reference
  customer: Customer!    # Federation reference
  quantity: Int!
  status: OrderStatus!
}
```

### Customers Service (Spring Boot)

**GraphQL Schema:**
```graphql
type Customer @key(fields: "id") {
  id: ID!
  name: String!
  email: String!
  tier: CustomerTier!
}
```

### Apollo Gateway

- **Composes schemas** from all subgraphs automatically
- **Plans queries** across services
- **Validates** against unified schema
- **Resolves federation** (@key directives)

### Apollo MCP Server

- **Exposes GraphQL operations** as MCP tools
- **Provides tool discovery** for AI agents
- **Maps user intents** to GraphQL queries
- **Integrates with Claude** via Anthropic SDK

## 🛡️ Governance Features

| Feature | Implementation | Location |
|---------|----------------|----------|
| **Schema Validation** | GraphQL type system | Apollo Gateway |
| **Query Depth Limiting** | MaxDepth directive | Gateway config |
| **Field-level Auth** | @auth directive | Each service |
| **Rate Limiting** | Spring rate limiter | Each service |
| **Audit Logging** | RequestInterceptor | Gateway |
| **Query Cost Analysis** | Cost calculator | Gateway |

## 🔌 Extending the Demo

### Add a New Service

1. **Create Spring Boot project**:
```bash
cd services
spring init --dependencies=web,lombok new-service
```

2. **Add Netflix DGS**:
```xml
<dependency>
    <groupId>com.netflix.graphql.dgs</groupId>
    <artifactId>graphql-dgs-spring-boot-starter</artifactId>
</dependency>
```

3. **Create GraphQL schema** with `@key` directive
4. **Register in gateway**:
```javascript
subgraphs: [
  // ...existing
  { name: 'new-service', url: 'http://localhost:8084/graphql' }
]
```

### Add MCP Tools

Edit `mcp-server/tools.json`:
```json
{
  "name": "my_new_tool",
  "description": "What it does",
  "inputSchema": { /* JSON schema */ },
  "graphqlOperation": "query { ... }"
}
```

## 🐛 Troubleshooting

### Gateway can't find subgraphs

**Problem**: `ECONNREFUSED` errors

**Solution**: Make sure all Spring Boot services are running first, then start gateway

### Federation errors

**Problem**: `Cannot query field "product" on type "Order"`

**Solution**: Check that `@key` directives match between services

### MCP Server not working

**Problem**: Tools not appearing

**Solution**: Verify GraphQL operations are valid by testing in Apollo Sandbox first

## 📚 Further Reading

- [Netflix DGS Framework](https://netflix.github.io/dgs/)
- [Apollo Federation](https://www.apollographql.com/docs/federation/)
- [Apollo MCP Server](https://github.com/apollographql/apollo-mcp-server)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Spring Boot GraphQL](https://docs.spring.io/spring-boot/reference/web/spring-graphql.html)

## 🎓 Presentation Tips

1. **Start with services** - show 3 independent microservices
2. **Add Gateway** - demonstrate schema composition
3. **Show Federation** - run cross-service query
4. **Add MCP** - introduce AI layer
5. **Run demo** - natural language → governed API

This architecture is **production-ready** and aligns **exactly** with your slides!
