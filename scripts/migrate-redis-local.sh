#!/bin/bash

# ============================================
# Local Script: Trigger Redis Migration on VPS
# ============================================
# Run this script from your local machine
# It will SSH to VPS and execute the migration

set -e

echo "🚀 Triggering Redis migration on VPS..."
echo ""

# Check if we have VPS host configured
if [ -z "$VPS_HOST" ]; then
    echo "⚠️  VPS_HOST not set. Please provide it:"
    read -p "VPS Host (e.g., your-vps-ip or domain): " VPS_HOST
fi

if [ -z "$VPS_USER" ]; then
    VPS_USER="root"
    echo "ℹ️  Using default SSH user: $VPS_USER"
fi

echo ""
echo "Connecting to: $VPS_USER@$VPS_HOST"
echo ""

# SSH to VPS and run migration
ssh "$VPS_USER@$VPS_HOST" << 'ENDSSH'
    set -e

    echo "📥 Pulling latest code..."
    cd ~/sanctum-gateway-track
    git fetch origin
    git checkout submission
    git pull origin submission

    echo ""
    echo "🚀 Running Redis migration script..."
    chmod +x scripts/setup-redis-vps.sh
    ./scripts/setup-redis-vps.sh
ENDSSH

echo ""
echo "════════════════════════════════════════════════════════"
echo "✅ Migration triggered successfully!"
echo "════════════════════════════════════════════════════════"
echo ""
echo "Next: Verify the application works by visiting:"
echo "  • Frontend: https://sanctum.rectorspace.com"
echo "  • Check dashboard loads correctly"
echo "  • Check WebSocket real-time updates"
echo ""
