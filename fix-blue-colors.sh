#!/bin/bash

# Script to replace seafoam-blue colors with more appropriate ACT brand colors
# This ensures 100% consistency with the ACT brand guidelines

echo "🎨 Replacing seafoam-blue colors with ACT brand colors..."
echo "=========================================================="

# Navigate to frontend directory
cd "$(dirname "$0")/frontend"

# Function to replace colors in a file
replace_blue_colors() {
    local file="$1"
    echo "Processing: $file"
    
    # Replace seafoam-blue with more appropriate ACT colors
    # Use spring-green for highlights and accents (more aligned with ACT brand)
    sed -i '' 's/bg-seafoam-blue/bg-spring-green/g' "$file"
    sed -i '' 's/text-seafoam-blue/text-spring-green/g' "$file"
    sed -i '' 's/border-seafoam-blue/border-spring-green/g' "$file"
    
    # Replace gradient from seafoam-blue to spring-green
    sed -i '' 's/from-seafoam-blue/from-spring-green/g' "$file"
    
    # Replace specific variants
    sed -i '' 's/bg-seafoam-blue-50/bg-spring-green-50/g' "$file"
    sed -i '' 's/bg-seafoam-blue-100/bg-spring-green-100/g' "$file"
    sed -i '' 's/bg-seafoam-blue-200/bg-spring-green-200/g' "$file"
    sed -i '' 's/bg-seafoam-blue-300/bg-spring-green-300/g' "$file"
    sed -i '' 's/bg-seafoam-blue-400/bg-spring-green-400/g' "$file"
    sed -i '' 's/bg-seafoam-blue-500/bg-spring-green-500/g' "$file"
    sed -i '' 's/bg-seafoam-blue-600/bg-spring-green-600/g' "$file"
    sed -i '' 's/bg-seafoam-blue-700/bg-spring-green-700/g' "$file"
    sed -i '' 's/bg-seafoam-blue-800/bg-spring-green-800/g' "$file"
    sed -i '' 's/bg-seafoam-blue-900/bg-spring-green-900/g' "$file"
    
    sed -i '' 's/text-seafoam-blue-50/text-spring-green-50/g' "$file"
    sed -i '' 's/text-seafoam-blue-100/text-spring-green-100/g' "$file"
    sed -i '' 's/text-seafoam-blue-200/text-spring-green-200/g' "$file"
    sed -i '' 's/text-seafoam-blue-300/text-spring-green-300/g' "$file"
    sed -i '' 's/text-seafoam-blue-400/text-spring-green-400/g' "$file"
    sed -i '' 's/text-seafoam-blue-500/text-spring-green-500/g' "$file"
    sed -i '' 's/text-seafoam-blue-600/text-spring-green-600/g' "$file"
    sed -i '' 's/text-seafoam-blue-700/text-spring-green-700/g' "$file"
    sed -i '' 's/text-seafoam-blue-800/text-spring-green-800/g' "$file"
    sed -i '' 's/text-seafoam-blue-900/text-spring-green-900/g' "$file"
    
    sed -i '' 's/border-seafoam-blue-50/border-spring-green-50/g' "$file"
    sed -i '' 's/border-seafoam-blue-100/border-spring-green-100/g' "$file"
    sed -i '' 's/border-seafoam-blue-200/border-spring-green-200/g' "$file"
    sed -i '' 's/border-seafoam-blue-300/border-spring-green-300/g' "$file"
    sed -i '' 's/border-seafoam-blue-400/border-spring-green-400/g' "$file"
    sed -i '' 's/border-seafoam-blue-500/border-spring-green-500/g' "$file"
    sed -i '' 's/border-seafoam-blue-600/border-spring-green-600/g' "$file"
    sed -i '' 's/border-seafoam-blue-700/border-spring-green-700/g' "$file"
    sed -i '' 's/border-seafoam-blue-800/border-spring-green-800/g' "$file"
    sed -i '' 's/border-seafoam-blue-900/border-spring-green-900/g' "$file"
    
    # Replace opacity variants
    sed -i '' 's/bg-seafoam-blue\/15/bg-spring-green\/15/g' "$file"
    sed -i '' 's/bg-seafoam-blue\/20/bg-spring-green\/20/g' "$file"
    sed -i '' 's/bg-seafoam-blue\/30/bg-spring-green\/30/g' "$file"
    sed -i '' 's/bg-seafoam-blue\/50/bg-spring-green\/50/g' "$file"
    
    # Replace hover states
    sed -i '' 's/hover:text-seafoam-blue/hover:text-spring-green/g' "$file"
    sed -i '' 's/hover:bg-seafoam-blue/hover:bg-spring-green/g' "$file"
    sed -i '' 's/hover:border-seafoam-blue/hover:border-spring-green/g' "$file"
    
    # Replace focus states
    sed -i '' 's/focus:ring-seafoam-blue/focus:ring-spring-green/g' "$file"
    sed -i '' 's/focus:border-seafoam-blue/focus:border-spring-green/g' "$file"
    
    # Replace specific patterns
    sed -i '' 's/data-\[state=checked\]:bg-seafoam-blue/data-[state=checked]:bg-spring-green/g' "$file"
    
    echo "✅ Completed: $file"
}

# Process all TypeScript/TSX files
echo "Processing TypeScript/TSX files..."
find app -name "*.tsx" -o -name "*.ts" | while read file; do
    if [[ "$file" != *"node_modules"* ]] && [[ "$file" != *".next"* ]]; then
        replace_blue_colors "$file"
    fi
done

# Process CSS files
echo "Processing CSS files..."
find . -name "*.css" | while read file; do
    if [[ "$file" != *"node_modules"* ]] && [[ "$file" != *".next"* ]]; then
        replace_blue_colors "$file"
    fi
done

echo ""
echo "🎨 Blue color replacement completed!"
echo "===================================="
echo "✅ Replaced seafoam-blue with spring-green"
echo "✅ Updated all color variants and opacity levels"
echo "✅ Fixed hover and focus states"
echo "✅ Maintained ACT brand consistency"
echo ""
echo "📝 Summary of changes:"
echo "  • seafoam-blue → spring-green (primary accent)"
echo "  • All variants (50-900) updated"
echo "  • Opacity variants (/15, /20, /30, /50) updated"
echo "  • Hover and focus states updated"
echo ""
echo "🚀 Ready for deployment with consistent ACT branding!" 