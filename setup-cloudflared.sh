#!/bin/bash
set -e # Exit immediately if any command fails

# 1. Input Validation & Help
appName=$1
domain=$2

if [ -z "$appName" ] || [ -z "$domain" ]; then
    echo "Usage: ./setup_tunnel.sh <tunnel_name> <domain>"
    echo "Example: ./setup_tunnel.sh my-app app.example.com"
    exit 1
fi

echo "--- Starting Cloudflare Tunnel Setup ---"

# 2. Login Check
# We check if the cert already exists to avoid opening the browser unnecessarily
if [ ! -f "$HOME/.cloudflared/cert.pem" ]; then
    echo ">> Authenticating..."
    cloudflared tunnel login
else
    echo ">> Already authenticated (cert.pem found)."
fi

# 3. Create Tunnel and Capture UUID automatically
echo ">> Creating tunnel '$appName'..."
# We define a temp file to catch the output so we can read the UUID from it
OUTFILE=$(mktemp)
cloudflared tunnel create "$appName" > "$OUTFILE" 2>&1 || true

# Read the UUID using grep from the output
UUID=$(grep -oE '[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}' "$OUTFILE" | head -n 1)

# Cleanup temp file
rm "$OUTFILE"

if [ -z "$UUID" ]; then
    echo "Error: Could not capture Tunnel UUID. Does the tunnel '$appName' already exist?"
    echo "If so, please delete it or use a different name."
    exit 1
fi

echo ">> Tunnel Created. UUID: $UUID"

# 4. Move Credentials to System Directory
# The credential file is created by cloudflared in ~/.cloudflared/<UUID>.json
# We need to move this to /etc/cloudflared so the service user can read it.
USER_CRED_PATH="$HOME/.cloudflared/$UUID.json"
SYSTEM_CRED_PATH="/etc/cloudflared/$UUID.json"

echo ">> Setting up system configuration..."
if [ ! -d "/etc/cloudflared" ]; then
    sudo mkdir -p /etc/cloudflared
fi

if [ -f "$USER_CRED_PATH" ]; then
    echo ">> Moving credentials to /etc/cloudflared/"
    sudo mv "$USER_CRED_PATH" "$SYSTEM_CRED_PATH"
else
    echo "Error: Credential file not found at $USER_CRED_PATH"
    exit 1
fi

# 5. Generate Config File Dynamically
# We write the config directly here. No need for an external config.yaml file.
# We point 'ingress' to the service running on localhost (defaulting to port 8080 here, change as needed)
TARGET_PORT="http://localhost:80"

echo ">> Generating /etc/cloudflared/config.yml..."
sudo tee /etc/cloudflared/config.yml > /dev/null <<EOF
tunnel: $UUID
credentials-file: $SYSTEM_CRED_PATH

ingress:
  - hostname: $domain
    service: $TARGET_PORT
  - service: http_status:404
EOF

echo ">> Config created pointing $domain to $TARGET_PORT"

# 6. Route DNS
echo ">> Routing DNS (CNAME $domain -> Tunnel)..."
cloudflared tunnel route dns "$UUID" "$domain"

# 7. Install and Start Service
echo ">> Installing System Service..."
# We ignore error if service is already installed
sudo cloudflared service install || echo "Service might already be installed."

echo ">> Starting Cloudflare Service..."
sudo systemctl start cloudflared
sudo systemctl enable cloudflared

echo "--- Setup Complete! ---"
echo "Tunnel '$appName' is active."
echo "Domain: $domain"
echo "Backend: $TARGET_PORT (Edit /etc/cloudflared/config.yml to change this)"
