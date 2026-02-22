#!/bin/bash
# VocabCards Quick Start Script
# This script sets up the development environment automatically

set -e  # Exit on error

echo "🚀 VocabCards Setup Script"
echo "================================"
echo ""

# Check prerequisites
echo "✓ Checking prerequisites..."
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required"; exit 1; }
command -v pnpm >/dev/null 2>&1 || { echo "❌ PNPM is required"; exit 1; }
command -v psql >/dev/null 2>&1 || { echo "⚠️  PostgreSQL client not found (optional)"; }

echo "✓ Prerequisites check complete"
echo ""

# Create environment file
echo "📝 Setting up environment variables..."
if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo "✓ Created .env.local"
    echo "  ⚠️  Please edit .env.local with your database URL and API keys"
else
    echo "✓ .env.local already exists"
fi
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install
echo "✓ Dependencies installed"
echo ""

# Setup database
echo "🗄️  Setting up database..."
pnpm dlx prisma generate
echo "✓ Prisma client generated"

# Check if database exists
read -p "Do you want to push the schema to your database? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    pnpm dlx prisma db push
    echo "✓ Database schema pushed"
fi
echo ""

# Seed database
read -p "Do you want to seed the database with demo data? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    pnpm db:seed
    echo "✓ Database seeded"
fi
echo ""

echo "================================"
echo "✨ Setup complete!"
echo ""
echo "📚 Next steps:"
echo "  1. Edit .env.local with your settings"
echo "  2. Run: pnpm dev"
echo "  3. Open: http://localhost:3000"
echo "  4. Login with: demo@example.com / demo123456"
echo ""
echo "📖 Documentation:"
echo "  - Setup guide: SETUP.md"
echo "  - Project summary: PROJECT_SUMMARY.md"
echo "  - Roadmap: ROADMAP.md"
echo ""
