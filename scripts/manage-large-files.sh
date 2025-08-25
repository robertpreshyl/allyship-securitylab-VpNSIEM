#!/bin/bash

# NetBird SIEM - Large File Management Script
# This script helps manage large files that exceed GitHub's 100MB limit

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔒 NetBird SIEM - Large File Manager${NC}"
echo "=========================================="

# Check if file exists and get its size
if [ $# -eq 0 ]; then
    echo -e "${RED}❌ Usage: $0 <file_path>${NC}"
    echo "Example: $0 data/large-datasets/kibana-4625-full.csv"
    exit 1
fi

FILE_PATH="$1"
FILE_NAME=$(basename "$FILE_PATH")

if [ ! -f "$FILE_PATH" ]; then
    echo -e "${RED}❌ File not found: $FILE_PATH${NC}"
    exit 1
fi

# Get file size in MB
FILE_SIZE=$(du -m "$FILE_PATH" | cut -f1)
echo -e "${BLUE}📁 File: $FILE_NAME${NC}"
echo -e "${BLUE}📏 Size: ${FILE_SIZE}MB${NC}"

if [ "$FILE_SIZE" -gt 100 ]; then
    echo -e "${YELLOW}⚠️  File exceeds GitHub's 100MB limit${NC}"
    echo ""
    echo -e "${GREEN}📋 Recommended Actions:${NC}"
    echo "1. Move file to data/large-datasets/"
    echo "2. Create a GitHub Release with the file"
    echo "3. Update README to reference the release"
    echo ""
    
    # Ask user what to do
    read -p "Do you want to move this file to large-datasets? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        mkdir -p data/large-datasets
        mv "$FILE_PATH" "data/large-datasets/"
        echo -e "${GREEN}✅ File moved to data/large-datasets/${NC}"
        echo ""
        echo -e "${YELLOW}📝 Next steps:${NC}"
        echo "1. Create a GitHub Release:"
        echo "   - Go to your repository on GitHub"
        echo "   - Click 'Releases' → 'Create a new release'"
        echo "   - Upload the file from data/large-datasets/"
        echo "   - Tag it with a version (e.g., v1.0.0)"
        echo ""
        echo "2. Update the README to reference the release"
        echo "3. Commit the changes to the repository"
    fi
else
    echo -e "${GREEN}✅ File is under 100MB - can be committed normally${NC}"
    echo ""
    echo -e "${BLUE}💡 Tip: Use 'git add' and 'git commit' to add this file${NC}"
fi

echo ""
echo -e "${BLUE}🔧 Git LFS Status:${NC}"
git lfs status
