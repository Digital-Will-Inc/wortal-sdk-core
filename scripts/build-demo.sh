#!/bin/bash

DEMO_DIR="demo"
SDK_DIR="../dist"

cd "$DEMO_DIR" || exit

# Remove the old bundle
if [ -f demo.zip ]; then
  rm demo.zip
fi

# Find the latest build
latest_sdk=$(find "$SDK_DIR"/wortal-core-*.js | head -n 1)
if [ -z "$latest_sdk" ]; then
  echo "No wortal-core.js file found in $SDK_DIR"
  exit 1
fi

# Copy the latest build into the demo directory
cp "$latest_sdk" .

# Get a reference to the copied file
moved_sdk=$(find wortal-core-*.js | head -n 1)
if [ -z "$latest_sdk" ]; then
  echo "No wortal-core.js file found in $DEMO_DIR"
  exit 1
fi

# Trim the version number to make it easier to include in index.html
mv "$moved_sdk" "wortal-core.js"

zip -r demo.zip ./*
