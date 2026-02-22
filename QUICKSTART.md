# VocabCards - Quick Start Guide

## Installation (2 minutes)

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Setup Environment
```bash
cp .env.example .env.local
# Edit .env.local with your PostgreSQL URL and OpenAI API key
```

### 3. Setup Database
```bash
pnpm dlx prisma generate
pnpm dlx prisma db push
pnpm db:seed  # Optional: Create demo user
```

### 4. Start Development Server
```bash
pnpm dev
```

Visit **http://localhost:3000** 🎉

---

## First Login

**Demo User** (if you ran seed):
- Email: `demo@example.com`
- Password: `demo123456`

Or **Create New Account**:
- Go to `/register`
- Sign up with email and password

---

## First Flashcard Deck

1. Click "Generate New Deck" 📚
2. Enter a topic (e.g., "Business English")
3. Choose difficulty (Basic/Standard/Advanced)
4. Click "Generate Flashcards ✨"
5. Start studying! 🎓

---

## Quick Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Production server

# Database
pnpm db:push          # Push schema to DB
pnpm db:migrate dev   # Create migration
pnpm db:seed          # Seed demo data
pnpm db:studio        # Open Prisma Studio

# Type checking
pnpm tsc --noEmit     # Check TypeScript
```

---

## Configuration

### OpenAI API Setup

**Option 1: System Key** (shared by all users)
```env
OPENAI_API_KEY=sk-your-key
```

**Option 2: User Key** (recommended)
1. Go to `/settings`
2. Paste your OpenAI API key
3. Save (encrypted automatically)

Get API key: https://platform.openai.com/api-keys

### Database Setup

Create PostgreSQL database:
```bash
createdb vocabcards
```

Update `.env.local`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/vocabcards"
```

---

## Project Structure

```
app/
├── api/              # API routes
├── lib/              # Utilities
├── ui/               # Components
├── login/            # Login page
├── register/         # Sign up
├── dashboard/        # Main page
├── generate/         # Create deck
├── study/[id]/       # Learning
├── settings/         # Settings
└── import/           # Import CSV
```

---

## Features

✨ **AI Flashcard Generation**
- Uses OpenAI GPT-3.5
- Customizable difficulty
- Multi-language support

🧠 **Spaced Repetition**
- SM-2 algorithm
- Smart scheduling
- Progress tracking

🎨 **Responsive UI**
- Mobile-friendly
- Dark mode ready
- Smooth animations

🔐 **Secure API Keys**
- Encrypted storage
- Never exposed to frontend
- User-controlled

📂 **Import/Export**
- CSV import/export
- Deck backup
- Data portability

---

## Troubleshooting

### Database Connection Error
```bash
# Start PostgreSQL
brew services start postgresql  # macOS
sudo systemctl start postgresql  # Ubuntu
```

### OpenAI API Error
- Verify API key in `.env.local`
- Check account has credits
- Confirm rate limits

### Port Already in Use
```bash
# Use different port
pnpm dev -- -p 3001
```

### Clear All Data
```bash
# CAUTION: Deletes everything
pnpm dlx prisma migrate reset
```

---

## Next Steps

- 📖 Read [SETUP.md](SETUP.md) for detailed instructions
- 🗺️ Check [ROADMAP.md](ROADMAP.md) for upcoming features
- 📋 See [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for complete overview

---

## Support

- GitHub Issues: Report bugs
- Discussions: Ask questions
- Wiki: Detailed guides

---

Happy learning! 📚✨

**Need help?** Check the docs or open an issue.
