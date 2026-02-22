# VocabCards - Complete Setup Guide

This guide will help you set up the VocabCards application from scratch.

## Prerequisites

- **Node.js**: Version 18.0 or higher
- **PNPM**: Package manager (npm or yarn work too)
- **PostgreSQL**: Version 12 or higher
- **OpenAI API Key** (optional, for testing)

## Step 1: Environment Setup

### 1.1 Create Environment File
```bash
cp .env.example .env.local
```

### 1.2 Configure Database

First, set up a PostgreSQL database:

```bash
# Using PostgreSQL CLI
createdb vocabcards

# Update .env.local with your database URL
DATABASE_URL="postgresql://username:password@localhost:5432/vocabcards"
```

### 1.3 Configure Secret Keys

Generate secure random strings for:

```bash
# For NextAuth (use `openssl rand -base64 32` to generate)
NEXTAUTH_SECRET=your-generated-secret-here
NEXTAUTH_URL=http://localhost:3000

# For API key encryption (use `openssl rand -hex 16` to generate)
ENCRYPTION_KEY=your-encryption-key-here

# OpenAI API (optional, get from https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-your-api-key-here
```

## Step 2: Database Setup

### 2.1 Install Dependencies
```bash
pnpm install
```

### 2.2 Create Database Schema
```bash
# Generate Prisma client
pnpm dlx prisma generate

# Push schema to database
pnpm dlx prisma db push

# Or use migrations:
pnpm db:migrate
```

### 2.3 Seed Database (Optional)
```bash
pnpm db:seed
```

This creates a demo user:
- Email: `demo@example.com`
- Password: `demo123456`

## Step 3: Development Server

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 4: First Steps

1. **Register** a new account or use demo credentials
2. **Generate** a flashcard deck by clicking "Generate New Deck"
3. **Study** using the interactive flashcard interface
4. **Configure** your personal API key in Settings (optional)

## File Structure

```
vocabcards/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/               # Authentication
│   │   ├── cards/              # Card endpoints
│   │   ├── decks/              # Deck management
│   │   ├── generate/           # Flashcard generation
│   │   ├── review/             # SRS reviews
│   │   └── settings/           # User settings
│   ├── lib/                    # Utility functions
│   │   ├── auth.ts             # NextAuth configuration
│   │   ├── db.ts               # Prisma client
│   │   ├── llm.ts              # OpenAI integration
│   │   ├── srs.ts              # Spaced Repetition algorithm
│   │   ├── crypto.ts           # Encryption utilities
│   │   └── ...
│   ├── ui/                     # React components
│   │   ├── flashcard.tsx       # Flashcard display
│   │   ├── deck-card.tsx       # Deck card component
│   │   ├── deck-actions.tsx    # Action buttons
│   │   └── ...
│   ├── dashboard/              # Dashboard page
│   ├── generate/               # Generate page
│   ├── study/[id]/             # Study mode page
│   ├── settings/               # Settings page
│   ├── login/                  # Login page
│   ├── register/               # Registration page
│   └── layout.tsx              # Root layout
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Seed script
├── public/                     # Static files
├── middleware.ts               # NextAuth middleware
├── package.json                # Dependencies
└── README.md                   # Project README
```

## Configuration Options

### API Key Management

**Option 1: System API Key (Shared)**
```env
OPENAI_API_KEY=sk-xxx
# All users share the same API quota
```

**Option 2: User API Keys (Recommended)**
- Users configure their own API keys in Settings
- Keys are encrypted with AES-256
- Users control their API usage

**Priority**: User Key > System Key

### Difficulty Levels

When generating flashcards, choose:
- **Basic**: Beginner vocabulary, common words
- **Standard**: Intermediate level, moderate difficulty
- **Advanced**: Professional, academic vocabulary

### Languages

Currently supported for definitions:
- English
- Vietnamese

More languages can be added by modifying `SUPPORTED_LANGUAGES` in `app/lib/constants.ts`.

## Database Management

### Viewing Database

```bash
pnpm db:studio
```

Opens Prisma Studio UI at [http://localhost:5555](http://localhost:5555)

### Reset Database

```bash
# WARNING: Deletes all data
pnpm dlx prisma migrate reset
```

### Create Migration

```bash
pnpm dlx prisma migrate dev --name migration_name
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/signin` - Sign in (NextAuth handles this)
- `POST /api/auth/signout` - Sign out

### Flashcards
- `POST /api/generate` - Generate new deck
- `GET /api/decks` - Get user's decks
- `GET /api/decks/:id` - Get deck with cards
- `DELETE /api/decks/:id` - Delete deck
- `GET /api/decks/:id/export` - Export as CSV

### Learning
- `POST /api/cards/:id/review` - Submit review (SM-2)
- `GET /api/review/:deckId` - Get cards for review

### Settings
- `POST /api/settings/api-key` - Save API key
- `GET /api/settings/api-key` - Check API key status

### Import/Export
- `POST /api/decks/import` - Import from CSV
- `GET /api/decks/:id/export` - Export to CSV

## Deployment

### Vercel (Frontend)

1. Push to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy

### Self-Hosted (Railway, AWS, etc.)

1. **Database**: PostgreSQL on managed service
2. **App**: Node.js runtime
3. **Environment**: Set all required variables
4. **Build**: `pnpm build && pnpm start`

Example: Railway
```bash
railway login
railway link
railway up
```

## Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution**: Ensure PostgreSQL is running
```bash
# macOS with Homebrew
brew services start postgresql

# Ubuntu
sudo systemctl start postgresql
```

### OpenAI API Error
```
Error: Invalid API key
```

**Solution**: 
- Check API key in `.env.local`
- Verify account has credits at https://platform.openai.com/account/billing/overview
- Check rate limits

### NextAuth Errors
```
error: jwt malformed
```

**Solution**: 
- Clear browser cookies
- Regenerate `NEXTAUTH_SECRET`
- Restart development server

### Prisma Client Error
```
error: schema.prisma was not yet generated
```

**Solution**:
```bash
pnpm dlx prisma generate
```

## Performance Optimization

### Caching (Future)
- Cache generated flashcards by topic
- Use Redis for session storage
- Client-side SWR for data fetching

### Rate Limiting (Future)
- Implement per-user API limits
- Track token usage costs
- Dashboard for usage analytics

### Database
- Add indexes on frequently queried columns
- Monitor query performance with Prisma Studio
- Consider connection pooling for production

## Security Checklist

- [ ] Change `NEXTAUTH_SECRET` to a unique, random string
- [ ] Change `ENCRYPTION_KEY` to a unique, random string
- [ ] Set `NEXTAUTH_URL` to your production domain
- [ ] Never commit `.env.local` to version control
- [ ] Use HTTPS in production
- [ ] Keep dependencies updated: `pnpm up`
- [ ] Regular database backups
- [ ] Monitor API usage and costs

## Development Tips

### Enable TypeScript Strict Mode
Update `tsconfig.json`:
```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

### View Console Logs
The Prisma client logs queries when `NODE_ENV` is not production. Disable with:
```typescript
// app/lib/db.ts
log: process.env.NODE_ENV === 'development' ? ['query'] : [],
```

### Test API Routes
Use curl or Postman:
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"topic":"Animals","count":10,"difficulty":"basic"}'
```

## Getting Help

- Check the main [README.md](README.md)
- Review Prisma docs: https://www.prisma.io/docs
- NextAuth docs: https://next-auth.js.org
- OpenAI API: https://platform.openai.com/docs
- Next.js: https://nextjs.org/docs

## Next Steps

After setup:
1. Customize the UI theme in `tailwind.config.ts`
2. Modify difficulty levels in `app/lib/constants.ts`
3. Add more supported languages
4. Implement additional SRS features
5. Add analytics and monitoring

Happy learning! 📚✨
