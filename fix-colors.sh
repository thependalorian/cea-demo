#!/bin/bash

# Script to fix color inconsistencies in the frontend
# This script replaces hardcoded hex colors with Tailwind CSS classes

echo "🎨 Fixing color inconsistencies in frontend files..."
echo "=================================================="

# Navigate to frontend directory
cd "$(dirname "$0")/frontend"

# Function to replace colors in a file
replace_colors() {
    local file="$1"
    echo "Processing: $file"
    
    # Replace background colors
    sed -i '' 's/bg-\[#EBE9E1\]/bg-sand-gray/g' "$file"
    sed -i '' 's/bg-\[#E0FFFF\]/bg-seafoam-blue/g' "$file"
    sed -i '' 's/bg-\[#B2DE26\]/bg-spring-green/g' "$file"
    sed -i '' 's/bg-\[#394816\]/bg-moss-green/g' "$file"
    sed -i '' 's/bg-\[#001818\]/bg-midnight-forest/g' "$file"
    
    # Replace text colors
    sed -i '' 's/text-\[#EBE9E1\]/text-sand-gray/g' "$file"
    sed -i '' 's/text-\[#E0FFFF\]/text-seafoam-blue/g' "$file"
    sed -i '' 's/text-\[#B2DE26\]/text-spring-green/g' "$file"
    sed -i '' 's/text-\[#394816\]/text-moss-green/g' "$file"
    sed -i '' 's/text-\[#001818\]/text-midnight-forest/g' "$file"
    
    # Replace border colors
    sed -i '' 's/border-\[#EBE9E1\]/border-sand-gray/g' "$file"
    sed -i '' 's/border-\[#E0FFFF\]/border-seafoam-blue/g' "$file"
    sed -i '' 's/border-\[#B2DE26\]/border-spring-green/g' "$file"
    sed -i '' 's/border-\[#394816\]/border-moss-green/g' "$file"
    sed -i '' 's/border-\[#001818\]/border-midnight-forest/g' "$file"
    
    # Replace gradient colors
    sed -i '' 's/from-\[#E0FFFF\]/from-seafoam-blue/g' "$file"
    sed -i '' 's/to-\[#EBE9E1\]/to-sand-gray/g' "$file"
    sed -i '' 's/from-\[#B2DE26\]/from-spring-green/g' "$file"
    sed -i '' 's/to-\[#394816\]/to-moss-green/g' "$file"
    
    # Replace opacity variants
    sed -i '' 's/bg-\[#B2DE26\]\/20/bg-spring-green\/20/g' "$file"
    sed -i '' 's/bg-\[#B2DE26\]\/10/bg-spring-green\/10/g' "$file"
    sed -i '' 's/bg-\[#394816\]\/10/bg-moss-green\/10/g' "$file"
    sed -i '' 's/bg-\[#EBE9E1\]\/30/bg-sand-gray\/30/g' "$file"
    sed -i '' 's/bg-\[#EBE9E1\]\/20/bg-sand-gray\/20/g' "$file"
    
    # Replace hover states
    sed -i '' 's/hover:bg-\[#001818\]/hover:bg-midnight-forest/g' "$file"
    sed -i '' 's/hover:bg-\[#394816\]/hover:bg-moss-green/g' "$file"
    sed -i '' 's/hover:bg-\[#B2DE26\]/hover:bg-spring-green/g' "$file"
    sed -i '' 's/hover:text-\[#001818\]/hover:text-midnight-forest/g' "$file"
    sed -i '' 's/hover:text-\[#394816\]/hover:text-moss-green/g' "$file"
    
    # Replace specific patterns in Avatar components
    sed -i '' 's/bg-\[#B2DE26\] flex items-center justify-center text-white/bg-spring-green flex items-center justify-center text-white/g' "$file"
    sed -i '' 's/bg-\[#394816\] flex items-center justify-center text-white/bg-moss-green flex items-center justify-center text-white/g' "$file"
    
    echo "✅ Completed: $file"
}

# Process all TypeScript/TSX files
echo "Processing TypeScript/TSX files..."
find app -name "*.tsx" -o -name "*.ts" | while read file; do
    if [[ "$file" != *"node_modules"* ]] && [[ "$file" != *".next"* ]]; then
        replace_colors "$file"
    fi
done

# Process CSS files
echo "Processing CSS files..."
find . -name "*.css" | while read file; do
    if [[ "$file" != *"node_modules"* ]] && [[ "$file" != *".next"* ]]; then
        replace_colors "$file"
    fi
done

echo ""
echo "🎨 Color consistency fixes completed!"
echo "====================================="
echo "✅ Replaced hardcoded hex colors with Tailwind CSS classes"
echo "✅ Updated background, text, border, and gradient colors"
echo "✅ Fixed hover states and opacity variants"
echo ""
echo "📝 Summary of changes:"
echo "  • #EBE9E1 → sand-gray"
echo "  • #E0FFFF → seafoam-blue"
echo "  • #B2DE26 → spring-green"
echo "  • #394816 → moss-green"
echo "  • #001818 → midnight-forest"
echo ""
echo "🚀 Ready for deployment with consistent branding!" 