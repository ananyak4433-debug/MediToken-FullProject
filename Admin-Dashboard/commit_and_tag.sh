#!/bin/bash

# Exit on any command failure
set -e

# Define the path to the package.json file
PACKAGE_JSON_PATH="./package.json"

# Check if package.json exists
if [ ! -f "$PACKAGE_JSON_PATH" ]; then
  echo "Error: package.json not found."
  exit 1
fi

# Create the development release
node create-dev-release.js

# Extract the version from package.json
VERSION=$(grep '"version"' "$PACKAGE_JSON_PATH" | awk -F: '{ print $2 }' | sed 's/[", ]//g')

# Check if the version was successfully extracted
if [ -z "$VERSION" ]; then
  echo "Error: Failed to read version from package.json."
  exit 1
fi

# Print the version
echo "Current version: $VERSION"

# Define commit and tag details
COMMIT_MESSAGE="Release: $VERSION"
TAG_NAME="$VERSION"
TAG_MESSAGE="Version $VERSION release."

# Stage all changes
git add .

# Commit changes
git commit -m "$COMMIT_MESSAGE"

# Check if the tag already exists
if git rev-parse "$TAG_NAME" >/dev/null 2>&1; then
  echo "Error: Tag $TAG_NAME already exists."
  exit 1
fi

# Create the tag
git tag -a "$TAG_NAME" -m "$TAG_MESSAGE"

# # Optionally push the commit and tag
# echo "Would you like to push changes to the remote repository? (y/n)"
# read -r PUSH_CONFIRMATION
# if [[ "$PUSH_CONFIRMATION" =~ ^[Yy]$ ]]; then
#   # Get the current branch
#   CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

#   # Pull the latest changes from the remote branch
#   echo "Pulling the latest changes from the remote branch..."
#   git pull origin "$CURRENT_BRANCH" || {
#     echo "Error: Conflicts detected during 'git pull'. Resolve them before proceeding."
#     exit 1
#   }

#   # Check for unresolved conflicts
#   if git diff --name-only --diff-filter=U | grep -q '.'; then
#     echo "Error: Unresolved merge conflicts detected. Resolve them before pushing."
#     exit 1
#   fi

#   # Push the changes to the remote repository
#   echo "Pushing changes to the remote repository..."
#   git push origin "$CURRENT_BRANCH" --follow-tags
  
#   echo "Changes pushed to remote repository."
# else
#   echo "Skipping push to remote repository."
# fi

echo "Changes committed and tagged successfully."
