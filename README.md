# Apollo Federation Java Demo

A production-ready implementation of Apollo Federation using Spring Boot microservices, Apollo Gateway, and AI-powered Model Context Protocol (MCP) server with Claude Sonnet 4.5.

## 🎯 Architecture

```
User → Claude AI → MCP Server → Apollo Gateway → Spring Boot Microservices
```

### Components

| Component | Technology | Port | Purpose |
|-----------|------------|------|---------|
| **Products Service** | Spring Boot + Netflix DGS | 8081 | Product catalog subgraph |
| **Orders Service** | Spring Boot + Netflix DGS | 8082 | Order management subgraph |
| **Customers Service** | Spring Boot + Netflix DGS | 8083 | Customer data subgraph |
| **Apollo Gateway** | Node.js + @apollo/gateway | 4000 | Federation gateway (schema composition) |
| **MCP Server** | Node.js + Anthropic Claude | 5001 | AI-powered natural language interface |
| **Web UI** | Express + Static HTML | 3000 | Interactive demo interface |

## ✨ Features

- **GraphQL Federation** - Distributed schema across microservices
- **AI-Powered Queries** - Natural language to GraphQL using Claude Sonnet 4.5
- **Production-Ready** - Spring Boot with Netflix DGS for enterprise-grade GraphQL
- **Interactive UI** - Web interface with service monitoring and query playground
- **One-Command Setup** - Automated scripts to start/stop all services

## 🚀 Quick Start

### Prerequisites

- **Java 17+** - `java -version`
- **Maven 3.6+** - `mvn -version`
- **Node.js 18+** - `node -version`
- **npm 9+** - `npm -version`

### Installation

```bash
# Clone the repository
git clone https://github.com/codeAcademi/apollo-federation-java.git
cd apollo-federation-java

# Build Java services
mvn clean install

# Start all services
./start-all.sh

# Open the demo
open http://localhost:3000
```

### Stop Services

```bash
./stop-all.sh
```

## 🎬 Try It Out

### Natural Language Queries

Visit http://localhost:3000 and try:

- "Show me all products"
- "List electronics under $200"
- "What orders does Alice have?"
- "Find platinum tier customers"
- "Search for laptop"

### GraphQL Federation Example

Access http://localhost:4000 and run this federated query:

```graphql
query {
  orders {
    id
    status
    product {        # Automatically fetched from Products Service
      name
      price
    }
    customer {       # Automatically fetched from Customers Service
      name
      tier
    }
  }
}
```

## 📁 Project Structure

```
apollo-federation-java/
├── services/                  # Spring Boot microservices
│   ├── products-service/      # Product catalog (port 8081)
│   ├── orders-service/        # Order management (port 8082)
│   └── customers-service/     # Customer data (port 8083)
├── gateway/                   # Apollo Gateway (port 4000)
├── mcp-server/                # MCP Server with Claude AI (port 5001)
├── web-ui/                    # Demo interface (port 3000)
├── start-all.sh               # Start all services
├── stop-all.sh                # Stop all services
└── pom.xml                    # Maven parent POM
```

## 🔧 Configuration

### AI Setup (Optional)

The MCP server can use Claude AI for intelligent query understanding:

1. Get an API key from https://console.anthropic.com/settings/keys
2. Create `mcp-server/.env`:
```bash
ANTHROPIC_API_KEY=sk-ant-api03-...
```
3. Restart services: `./stop-all.sh && ./start-all.sh`

Without an API key, the system uses keyword-based matching as a fallback.

### Service Ports

All ports are configurable in their respective configuration files:

- Products: `services/products-service/src/main/resources/application.properties`
- Orders: `services/orders-service/src/main/resources/application.properties`
- Customers: `services/customers-service/src/main/resources/application.properties`
- Gateway: `gateway/index.js`
- MCP Server: `mcp-server/index.js`
- Web UI: `web-ui/server.js`

## 🏗️ How It Works

### GraphQL Federation

Each microservice owns its domain schema. The Apollo Gateway automatically composes them into a unified API.

**Example:**
- Products Service defines `Product` type
- Orders Service references `Product` via `@key`
- Gateway automatically resolves cross-service relationships

### MCP Integration

The Model Context Protocol server:
1. Receives natural language queries
2. Uses Claude AI to understand intent
3. Converts to GraphQL operations
4. Executes via Apollo Gateway
5. Returns formatted results

## 🐛 Troubleshooting

### Build Errors

**Java Version Issues**: This project is optimized for Java 17. If using Java 21+:
- Update Lombok to `edge-SNAPSHOT` in [pom.xml](pom.xml)
- Or switch to Java 17: `export JAVA_HOME=$(/usr/libexec/java_home -v 17)`

### Gateway Connection Errors

**Problem**: `ECONNREFUSED` when starting gateway

**Solution**: Ensure all Spring Boot services are running before starting the gateway

### Federation Errors

**Problem**: Cannot query field across services

**Solution**: Verify `@key` directives match between services in their GraphQL schemas

## 📚 Documentation

- [Quick Start Guide](QUICKSTART.md) - Step-by-step setup instructions
- [Gateway README](gateway/README.md) - Apollo Gateway configuration
- [MCP Server README](mcp-server/README.md) - MCP server and AI setup
- [Web UI README](web-ui/README.md) - Frontend documentation

## 🔗 Resources

- [Netflix DGS Framework](https://netflix.github.io/dgs/)
- [Apollo Federation](https://www.apollographql.com/docs/federation/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Spring Boot GraphQL](https://docs.spring.io/spring-boot/reference/web/spring-graphql.html)

## 📄 License

MIT License - feel free to use this for your presentations and demos!

## 🤝 Contributing

This is a demo project for presentations. Feel free to fork and adapt for your needs!

---

**Built with ❤️ using Spring Boot, Apollo Federation, and Claude AI**
