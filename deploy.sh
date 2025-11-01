#!/bin/bash

# Exit on error
set -e

# Load environment variables
source .env.production

# Variables
DEPLOY_PATH="/var/www/bukidnimanang"
BACKUP_PATH="/var/backups/bukidnimanang"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Create backup
echo "Creating backup..."
mkdir -p $BACKUP_PATH
mysqldump -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME > $BACKUP_PATH/db_backup_$TIMESTAMP.sql
tar -czf $BACKUP_PATH/files_backup_$TIMESTAMP.tar.gz $DEPLOY_PATH

# Update code
echo "Updating code from repository..."
git pull origin main

# Install dependencies
echo "Installing dependencies..."
npm install

# Build application
echo "Building application..."
npm run build

# Database migrations
echo "Running database migrations..."
npm run migrate

# Restart PM2 processes
echo "Restarting application..."
pm2 reload ecosystem.config.js --env production

# Verify deployment
echo "Verifying deployment..."
curl -s -o /dev/null -w "%{http_code}" https://bukidnimanang.com

# Clean old backups (keep last 7 days)
echo "Cleaning old backups..."
find $BACKUP_PATH -name "db_backup_*" -mtime +7 -delete
find $BACKUP_PATH -name "files_backup_*" -mtime +7 -delete

echo "Deployment completed successfully!"