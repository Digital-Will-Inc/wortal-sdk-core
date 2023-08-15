#!/bin/bash
source .env

DEV_URL="https://html5gameportal.dev/api/v1/ofa/wortal/upload"
PROD_URL="https://html5gameportal.com/api/v1/ofa/wortal/upload"

# These are set based on environment
URL=""
TOKEN=""
GAME_ID=""

# Parse args to set the environment
while [[ $# -gt 0 ]]; do
  key="$1"

  case $key in
    --dev)
      if [ -z "$WORTAL_API_KEY_DEV" ]; then
        echo "WORTAL_API_KEY_DEV environment variable is missing or not set."
        exit 1
      fi

      if [ -z "$WORTAL_GAME_ID_DEV" ]; then
        echo "WORTAL_GAME_ID_DEV environment variable is missing or not set."
        exit 1
      fi

      URL="$DEV_URL"
      TOKEN="$WORTAL_API_KEY_DEV"
      GAME_ID="$WORTAL_GAME_ID_DEV"

      shift
      ;;
    --prod)
      if [ -z "$WORTAL_API_KEY_PROD" ]; then
        echo "WORTAL_API_KEY_PROD environment variable is missing or not set."
        exit 1
      fi

      if [ -z "$WORTAL_GAME_ID_PROD" ]; then
        echo "WORTAL_GAME_ID_PROD environment variable is missing or not set."
        exit 1
      fi

      URL="$PROD_URL"
      TOKEN="$WORTAL_API_KEY_PROD"
      GAME_ID="$WORTAL_GAME_ID_PROD"

      shift
      ;;
    *)
      echo "Unknown option: $key"
      exit 1
      ;;
  esac
done

# Create the payload
NOTES="Automated deployment"
BUILD="@./demo/demo.zip"

# Upload the bundle
curl -X POST "$URL" -H "Authorization: Token $TOKEN" -F "notes=$NOTES" -F "archive=$BUILD" -F "game_id=$GAME_ID"
