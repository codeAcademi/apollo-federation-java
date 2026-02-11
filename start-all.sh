#!/bin/bash

echo "════════════════════════════════════════════════════════════"
echo "  🚀 Apollo Federation Demo - Complete Stack Launcher"
echo "════════════════════════════════════════════════════════════"
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check prerequisites
echo "🔍 Checking prerequisites..."
echo ""

if ! command -v java &> /dev/null; then
    echo "❌ Java not found. Please install Java 17+"
    exit 1
fi
echo "✓ Java: $(java -version 2>&1 | head -n 1)"

if ! command -v mvn &> /dev/null; then
    echo "❌ Maven not found. Please install Maven 3.6+"
    exit 1
fi
echo "✓ Maven: $(mvn -version | head -n 1)"

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi
echo "✓ Node.js: $(node -v)"

if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install npm"
    exit 1
fi
echo "✓ npm: $(npm -v)"

echo ""
echo "════════════════════════════════════════════════════════════"
echo ""

# Build Java services
echo "📦 Building Spring Boot services..."
echo ""
mvn clean install -DskipTests

if [ $? -ne 0 ]; then
    echo "❌ Maven build failed"
    exit 1
fi

echo ""
echo "✅ All Java services built successfully!"
echo ""

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
echo ""

echo "  Installing gateway dependencies..."
cd "$SCRIPT_DIR/gateway"
npm install --silent

echo "  Installing MCP server dependencies..."
cd "$SCRIPT_DIR/mcp-server"
npm install --silent

echo "  Installing web UI dependencies..."
cd "$SCRIPT_DIR/web-ui"
npm install --silent

cd "$SCRIPT_DIR"

echo ""
echo "✅ All Node.js dependencies installed!"
echo ""
echo "════════════════════════════════════════════════════════════"
echo ""
echo "🚀 Starting services..."
echo ""

# Create logs directory
mkdir -p logs

# Function to start a service in background
start_service() {
    local name=$1
    local dir=$2
    local command=$3
    local log_file="logs/${name}.log"
    
    echo "  Starting ${name}..."
    cd "$SCRIPT_DIR/$dir"
    $command > "$SCRIPT_DIR/$log_file" 2>&1 &
    local pid=$!
    echo $pid > "$SCRIPT_DIR/logs/${name}.pid"
    echo "    ✓ ${name} started (PID: $pid)"
    cd "$SCRIPT_DIR"
}

# Start Spring Boot services
start_service "products-service" "services/products-service" "mvn spring-boot:run"
start_service "orders-service" "services/orders-service" "mvn spring-boot:run"
start_service "customers-service" "services/customers-service" "mvn spring-boot:run"

echo ""
echo "  ⏳ Waiting for Spring Boot services to start (30 seconds)..."
sleep 30

# Start Node.js services
start_service "gateway" "gateway" "npm start"
sleep 5
start_service "mcp-server" "mcp-server" "npm start"
sleep 2
start_service "web-ui" "web-ui" "npm start"

echo ""
echo "════════════════════════════════════════════════════════════"
echo ""
echo "✨ All services started successfully!"
echo ""
echo "📊 Service URLs:"
echo "  • Products Service:  http://localhost:8081/graphql"
echo "  • Orders Service:    http://localhost:8082/graphql"
echo "  • Customers Service: http://localhost:8083/graphql"
echo "  • Apollo Gateway:    http://localhost:4000"
echo "  • Web UI:            http://localhost:3000"
echo ""
echo "📝 Logs are available in the 'logs' directory"
echo ""
echo "🌐 Open http://localhost:3000 in your browser!"
echo ""
echo "To stop all services, run: ./stop-all.sh"
echo ""
echo "════════════════════════════════════════════════════════════"
echo ""
