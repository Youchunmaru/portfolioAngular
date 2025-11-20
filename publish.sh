#!/bin/bash

# 1. "set -e" causes the script to exit immediately if ANY command fails.
# This prevents the script from deleting your live site if the build fails.
set -e

# 2. Define variables for paths (easier to change later)
# Replace '.' with the absolute path if you run this from outside the folder
PROJECT_DIR=$(pwd)
DIST_DIR="$PROJECT_DIR/dist/portfolio/browser/"
TARGET_DIR="/var/www/html/"

echo "--- Starting Deployment ---"

echo "1. Pulling latest code..."
git pull

echo "2. Installing dependencies..."
# 'npm ci' is better for CI/CD/Production than 'npm install'
npm ci

echo "3. Building Angular application..."
npm run prod

echo "4. Deploying files..."
# 3. Check if the build directory actually exists before deploying
if [ ! -d "$DIST_DIR" ]; then
    echo "Error: Build directory $DIST_DIR not found!"
    exit 1
fi

# 4. Use rsync instead of rm + cp
# -a: Archive mode (preserves permissions/dates)
# -v: Verbose (shows you what is happening)
# --delete: Deletes files in TARGET that are not in SOURCE (cleans up old files)
# This is much faster and safer than deleting the whole folder.
sudo rsync -av --delete "$DIST_DIR" "$TARGET_DIR"

echo "--- Deployment Successfully Finished ---"

# 5. Reload Nginx
# For static Angular sites, you usually don't need to restart Nginx,
# just the file update is enough. But if you really need it:
# 'systemctl reload' is better than restart (zero downtime)
sudo systemctl reload nginx
