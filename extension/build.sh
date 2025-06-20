#!/bin/bash

# Build script for Wiki Spark Redirector Extension

echo "🚀 Building Wiki Spark Redirector Extension..."

# Create build directory
mkdir -p build

# Chrome Extension Build
echo "📦 Building Chrome extension..."
mkdir -p build/chrome
cp -r icons build/chrome/
cp manifest.json build/chrome/
cp background.js build/chrome/
cp content.js build/chrome/
cp popup.html build/chrome/
cp README.md build/chrome/

# Create Chrome extension zip
cd build/chrome
zip -r ../wikispark-redirector-chrome.zip . -x "*.DS_Store"
cd ../..

echo "✅ Chrome extension built: build/wikispark-redirector-chrome.zip"

# Firefox Extension Build
echo "📦 Building Firefox extension..."
mkdir -p build/firefox
cp -r icons build/firefox/
cp manifest-firefox.json build/firefox/manifest.json
cp background-firefox.js build/firefox/background.js
cp content.js build/firefox/
cp popup.html build/firefox/
cp README.md build/firefox/

# Create Firefox extension zip
cd build/firefox
zip -r ../wikispark-redirector-firefox.zip . -x "*.DS_Store"
cd ../..

echo "✅ Firefox extension built: build/wikispark-redirector-firefox.zip"

echo "🎉 Build complete! Extensions are ready in the build/ folder."
echo ""
echo "Installation instructions:"
echo "Chrome: Load unpacked extension from build/chrome/ folder"
echo "Firefox: Load temporary add-on using build/firefox/manifest.json"
echo ""
echo "For distribution:"
echo "Chrome Web Store: Upload build/wikispark-redirector-chrome.zip"
echo "Firefox Add-ons: Upload build/wikispark-redirector-firefox.zip"
