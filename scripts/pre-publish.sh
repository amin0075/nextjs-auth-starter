#!/bin/bash

echo "🔍 Pre-publish Checklist for nextjs-auth-starter"
echo "================================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Run this from the package root directory."
    exit 1
fi

# Check package name
PACKAGE_NAME=$(grep '"name"' package.json | cut -d'"' -f4)
echo "📦 Package name: $PACKAGE_NAME"

# Check version
VERSION=$(grep '"version"' package.json | cut -d'"' -f4)
echo "🏷️  Version: $VERSION"

# Build the package
echo "🔨 Building package..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi
echo "✅ Build successful"

# Check what files will be published
echo "📁 Files to be published:"
npm pack --dry-run | grep -E "^npm notice" | grep -v "Tarball" | grep -v "package size"

# Check for npm login
echo "👤 Checking npm login..."
npm whoami > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Logged in to npm as: $(npm whoami)"
else
    echo "❌ Not logged in to npm. Run 'npm login' first."
    exit 1
fi

# Check if package name is available
echo "🔍 Checking if package name is available..."
npm view $PACKAGE_NAME > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "⚠️  Package name '$PACKAGE_NAME' already exists. You may need to update the version."
else
    echo "✅ Package name '$PACKAGE_NAME' is available"
fi

echo ""
echo "🚀 Ready to publish!"
echo "Run: npm publish"
echo ""
echo "📋 Post-publish checklist:"
echo "  - Create GitHub repository"
echo "  - Push code with: git push origin main"
echo "  - Create GitHub release with tag v$VERSION"
echo "  - Update documentation"
