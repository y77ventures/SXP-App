#!/usr/bin/env bash
# ============================================================
# SwimXP Connect — Local Development Setup Script
# Usage: bash scripts/setup.sh
# ============================================================

set -e

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}"
echo "  ╔═══════════════════════════════════════╗"
echo "  ║     SwimXP Connect — Setup Script     ║"
echo "  ╚═══════════════════════════════════════╝"
echo -e "${NC}"

# ── 1. Check prerequisites ──────────────────────────────────
echo -e "${YELLOW}[1/5] Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
  echo -e "${RED}✗ Node.js not found. Install from https://nodejs.org${NC}"
  exit 1
fi
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo -e "${RED}✗ Node.js 18+ required. Found: $(node -v)${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v)${NC}"

if ! command -v pnpm &> /dev/null; then
  echo -e "${YELLOW}  pnpm not found — installing...${NC}"
  npm install -g pnpm
fi
echo -e "${GREEN}✓ pnpm $(pnpm -v)${NC}"

# ── 2. Install dependencies ─────────────────────────────────
echo -e "${YELLOW}[2/5] Installing dependencies...${NC}"
pnpm install
echo -e "${GREEN}✓ Dependencies installed${NC}"

# ── 3. Environment file ──────────────────────────────────────
echo -e "${YELLOW}[3/5] Setting up environment...${NC}"
if [ ! -f ".env" ]; then
  if [ -f ".env.example" ]; then
    cp .env.example .env
    echo -e "${GREEN}✓ .env created from .env.example${NC}"
    echo -e "${YELLOW}  ⚠  Edit .env and fill in your values before running the app${NC}"
  else
    echo -e "${YELLOW}  ⚠  No .env.example found — skipping${NC}"
  fi
else
  echo -e "${GREEN}✓ .env already exists${NC}"
fi

# ── 4. Database setup (optional) ────────────────────────────
echo -e "${YELLOW}[4/5] Database setup (optional)...${NC}"
if command -v psql &> /dev/null; then
  read -p "  Set up local PostgreSQL database? (y/N) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    DB_NAME="swimxp_dev"
    echo "  Creating database: $DB_NAME"
    createdb "$DB_NAME" 2>/dev/null || echo "  (database may already exist)"
    echo "  Running schema migration..."
    psql -d "$DB_NAME" -f database/schema.sql
    read -p "  Seed with development data? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      psql -d "$DB_NAME" -f database/seed.sql
      echo -e "${GREEN}  ✓ Database seeded${NC}"
    fi
    echo -e "${GREEN}✓ Database ready: $DB_NAME${NC}"
  else
    echo "  Skipping database setup (app runs on mock data without it)"
  fi
else
  echo "  PostgreSQL not found — skipping (app runs on mock data)"
fi

# ── 5. Type check ────────────────────────────────────────────
echo -e "${YELLOW}[5/5] Running type check...${NC}"
pnpm check && echo -e "${GREEN}✓ TypeScript: no errors${NC}"

# ── Done ─────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}╔═══════════════════════════════════════╗"
echo -e "║          Setup complete! 🎉           ║"
echo -e "╚═══════════════════════════════════════╝${NC}"
echo ""
echo -e "  Start the dev server:  ${CYAN}pnpm dev${NC}"
echo -e "  Open in browser:       ${CYAN}http://localhost:3000${NC}"
echo ""
