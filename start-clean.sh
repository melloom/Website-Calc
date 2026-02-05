#!/bin/bash

echo "🧹 Cleaning up existing processes..."

# Kill processes on ports 3000-3005
for port in 3000 3001 3002 3003 3004 3005; do
    pid=$(lsof -ti:$port 2>/dev/null)
    if [ ! -z "$pid" ]; then
        echo "🔪 Killing process $pid on port $port"
        kill -9 $pid 2>/dev/null
    fi
done

# Kill any existing next dev processes
echo "🔪 Killing existing Next.js processes..."
pkill -f "next dev" 2>/dev/null
pkill -f "next-server" 2>/dev/null

# Remove Next.js lock files
echo "🗑️  Removing Next.js lock files..."
rm -rf .next/dev/lock 2>/dev/null
rm -rf .next/cache 2>/dev/null

# Wait a moment for processes to fully terminate
sleep 2

echo "✅ Cleanup complete. Starting Next.js dev server..."
npm run dev:raw
