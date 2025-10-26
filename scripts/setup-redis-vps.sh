#!/bin/bash

# ============================================
# Redis Migration Script - Upstash to Local VPS
# ============================================
# This script installs Redis on VPS and configures it for production use

set -e  # Exit on error

echo "🚀 Starting Redis migration to local VPS..."

# ============================================
# Step 1: Install Redis
# ============================================
echo ""
echo "📦 Step 1: Installing Redis..."

# Update package list
sudo apt update -qq

# Install Redis server
sudo apt install -y redis-server

echo "✅ Redis installed successfully!"

# ============================================
# Step 2: Configure Redis for Production
# ============================================
echo ""
echo "⚙️  Step 2: Configuring Redis..."

# Backup original config
sudo cp /etc/redis/redis.conf /etc/redis/redis.conf.backup

# Configure Redis settings
sudo tee -a /etc/redis/redis.conf > /dev/null <<EOF

# ===== Sanctum Gateway Custom Configuration =====
# Bind to localhost only (security)
bind 127.0.0.1 ::1

# Enable persistence
save 900 1
save 300 10
save 60 10000

# Memory management
maxmemory 256mb
maxmemory-policy allkeys-lru

# Logging
loglevel notice
logfile /var/log/redis/redis-server.log
EOF

echo "✅ Redis configured for production!"

# ============================================
# Step 3: Enable and Start Redis
# ============================================
echo ""
echo "🔄 Step 3: Starting Redis service..."

# Enable auto-start on boot
sudo systemctl enable redis-server

# Start Redis
sudo systemctl restart redis-server

# Wait for Redis to start
sleep 2

# Check status
if sudo systemctl is-active --quiet redis-server; then
    echo "✅ Redis is running!"
else
    echo "❌ Redis failed to start"
    sudo systemctl status redis-server
    exit 1
fi

# ============================================
# Step 4: Test Redis Connection
# ============================================
echo ""
echo "🧪 Step 4: Testing Redis connection..."

# Test ping
if redis-cli ping | grep -q "PONG"; then
    echo "✅ Redis connection test passed!"
else
    echo "❌ Redis connection test failed"
    exit 1
fi

# ============================================
# Step 5: Update Backend .env
# ============================================
echo ""
echo "📝 Step 5: Updating backend .env..."

cd ~/sanctum-gateway-track/src/backend

# Backup current .env
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)

# Update REDIS_URL to localhost
if grep -q "^REDIS_URL=" .env; then
    # Replace existing REDIS_URL
    sed -i 's|^REDIS_URL=.*|REDIS_URL=redis://localhost:6379|' .env
    echo "✅ Updated existing REDIS_URL"
else
    # Add REDIS_URL if not exists
    echo "REDIS_URL=redis://localhost:6379" >> .env
    echo "✅ Added REDIS_URL to .env"
fi

echo ""
echo "Current REDIS_URL:"
grep "^REDIS_URL=" .env

# ============================================
# Step 6: Restart Backend Service
# ============================================
echo ""
echo "♻️  Step 6: Restarting backend service..."

# Load NVM to access PM2
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

pm2 restart sanctum-backend

# Wait for restart
sleep 3

# Check if backend is running
if pm2 list | grep -q "sanctum-backend.*online"; then
    echo "✅ Backend restarted successfully!"
else
    echo "❌ Backend restart failed"
    pm2 logs sanctum-backend --lines 20
    exit 1
fi

# ============================================
# Step 7: Verify Migration Success
# ============================================
echo ""
echo "✅ Step 7: Verifying migration..."

# Load NVM (in case it's not loaded)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# Show PM2 status
echo ""
echo "📊 PM2 Status:"
pm2 list

echo ""
echo "📊 Redis Status:"
sudo systemctl status redis-server --no-pager -l

echo ""
echo "📊 Redis Info:"
redis-cli info | grep -E "redis_version|uptime_in_seconds|connected_clients|used_memory_human"

echo ""
echo "════════════════════════════════════════════════════════"
echo "✅ Redis migration completed successfully!"
echo "════════════════════════════════════════════════════════"
echo ""
echo "Summary:"
echo "  • Redis installed: ✓"
echo "  • Redis running: ✓"
echo "  • Auto-start enabled: ✓"
echo "  • Backend updated: ✓"
echo "  • Service restarted: ✓"
echo ""
echo "Old Upstash URL backed up in .env.backup.*"
echo "Redis now running locally on localhost:6379"
echo ""
