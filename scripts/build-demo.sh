#!/bin/bash

DEMO_DIR="demo"
SDK_DIR="../dist"

cd "$DEMO_DIR" || exit

# Remove the old bundle.
rm -f demo.zip

# List the chunks. Skip Telegram as it will block the FB upload of the demo due to window.parent.postMessage calls.
chunks=("wortal-core.js" "wortal-common.js" "analytics.js" "addictinggames.js" "crazygames.js" "debug.js" "facebook.js"
"gamemonetize.js" "gamepix.js" "gd.js" "link.js" "poki.js" "viber.js" "wortal.js" "yandex.js")

# Loop through the array and copy chunks to the demo folder.
for chunk in "${chunks[@]}"; do
  file=$(find "$SDK_DIR/$chunk" | head -n 1)
  if [ -z "$file" ]; then
    echo "No $chunk chunk found in $SDK_DIR"
    exit 1
  fi
  cp "$file" .
done

# Create the bundle.
zip -r demo.zip ./*
