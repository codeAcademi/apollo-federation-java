#!/bin/bash

echo "════════════════════════════════════════════════════════════"
echo "  🛑 Stopping Apollo Federation Demo Services"
echo "════════════════════════════════════════════════════════════"
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Function to stop a service
stop_service() {
    local name=$1
    local pid_file="logs/${name}.pid"
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p $pid > /dev/null 2>&1; then
            echo "  Stopping ${name} (PID: $pid)..."
            kill $pid
            rm "$pid_file"
            echo "    ✓ ${name} stopped"
        else
            echo "  ${name} not running (stale PID file)"
            rm "$pid_file"
        fi
    else
        echo "  ${name} not running (no PID file)"
    fi
}

# Stop all services
stop_service "web-ui"
stop_service "mcp-server"
stop_service "gateway"
stop_service "customers-service"
stop_service "orders-service"
stop_service "products-service"

echo ""
echo "════════════════════════════════════════════════════════════"
echo ""
echo "✅ All services stopped"
echo ""

# Clean up any orphaned Java processes
echo "Checking for orphaned Java processes..."
ORPHANED=$(ps aux | grep "spring-boot:run" | grep -v grep | awk '{print $2}')
if [ ! -z "$ORPHANED" ]; then
    echo "Found orphaned processes, cleaning up..."
    echo "$ORPHANED" | xargs kill 2>/dev/null
    echo "✓ Cleaned up orphaned processes"
else
    echo "✓ No orphaned processes found"
fi

# Clean up any orphaned Node processes
ORPHANED_NODE=$(ps aux | grep "node.*apollo" | grep -v grep | awk '{print $2}')
if [ ! -z "$ORPHANED_NODE" ]; then
    echo "Found orphaned Node processes, cleaning up..."
    echo "$ORPHANED_NODE" | xargs kill 2>/dev/null
    echo "✓ Cleaned up orphaned Node processes"
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo ""
