#!/bin/bash

# Quick Deployment Script for Lumos
# This script helps you push to GitHub

echo "🚀 Lumos Deployment Helper"
echo "=========================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    echo "✅ Git initialized"
    echo ""
fi

# Check if remote exists
if ! git remote | grep -q "origin"; then
    echo "⚠️  No GitHub remote found!"
    echo ""
    echo "Please create a repository on GitHub first, then run:"
    echo "  git remote add origin https://github.com/YOUR_USERNAME/lumos.git"
    echo ""
    read -p "Press Enter after you've added the remote, or Ctrl+C to cancel..."
fi

# Show current status
echo "📊 Current Git Status:"
git status --short
echo ""

# Ask for commit message
read -p "Enter commit message (or press Enter for default): " commit_msg
if [ -z "$commit_msg" ]; then
    commit_msg="Update: Lumos Campus Placement Portal"
fi

# Stage all changes
echo "📝 Staging all changes..."
git add .
echo "✅ Changes staged"
echo ""

# Commit
echo "💾 Committing changes..."
git commit -m "$commit_msg"
echo "✅ Changes committed"
echo ""

# Push
echo "🚀 Pushing to GitHub..."
git push -u origin main 2>/dev/null || git push -u origin master 2>/dev/null || {
    echo "⚠️  Could not push. Trying to set branch..."
    git branch -M main
    git push -u origin main
}

echo ""
echo "✅ Done! Your code is on GitHub!"
echo ""
echo "Next steps:"
echo "1. Go to vercel.com and import your repository"
echo "2. Add environment variables in Vercel dashboard"
echo "3. Deploy!"
echo ""
echo "See DEPLOYMENT_GUIDE.md for detailed instructions."

