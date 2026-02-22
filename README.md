# VocabCards - AI-Powered English Vocabulary Learning

A modern web application for learning English vocabulary using AI-generated flashcards with spaced repetition algorithm.

## Features

✨ **AI-Generated Flashcards**
- Generate up to 100 vocabulary cards using OpenAI API
- Customizable difficulty levels (Basic, Standard, Advanced)
- Support for Vietnamese translations

🃏 **Flashcard Features**
- Interactive flip cards
- Text-to-speech pronunciation
- Example sentences
- Phonetic transcription

🧠 **Spaced Repetition System (SRS)**
- SM-2 algorithm implementation
- Smart review scheduling
- Learning progress tracking
- Difficulty-based intervals

👤 **User Management**
- User registration and authentication
- Personal API key management (optional)
- Progress tracking per deck
- Encrypted storage of API keys

📊 **Dashboard**
- View all created decks
- Quick statistics
- Cards due for review today

## Tech Stack

**Frontend:**
- Next.js 15+
- React 19
- TypeScript
- Tailwind CSS
- NextAuth.js

**Backend:**
- Next.js API Routes
- Prisma ORM
- PostgreSQL
- OpenAI API

**Infrastructure:**
- Node.js runtime
- Database: PostgreSQL
- Environment-based configuration

## Installation

### Prerequisites
- Node.js 18+
- PNPM (or npm/yarn)
- PostgreSQL database
- OpenAI API key (optional - can use system key or user key)

### Setup Steps

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Configure the following in `.env.local`:
   ```
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/vocabcards"

   # OpenAI
   OPENAI_API_KEY="sk-xxx..."  # Optional system API key

   # NextAuth
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"

   # Encryption
   ENCRYPTION_KEY="your-encryption-key-for-user-api-keys"
   ```

3. **Setup database**
   ```bash
   pnpm dlx prisma generate
   pnpm dlx prisma migrate dev
   ```

4. **Run development server**
   ```bash
   pnpm dev
   ```

   Visit `http://localhost:3000`

## Database Schema

### Users
- id, email, password (hashed), name
- encryptedApiKey (optional personal OpenAI key)

### Decks
- id, owner_id, topic, title, difficulty, language

### Cards
- id, deck_id, word, part_of_speech, definition, example_sentence, phonetic, vietnamese

### UserProgress (SRS tracking)
- id, user_id, card_id
- easiness_factor, interval, repetitions
- next_review_date, is_known, review_count

### APIKeyUsage
- Tracks API token usage and estimated costs

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/signin` - Sign in (NextAuth)
- `POST /api/auth/signout` - Sign out

### Flashcards
- `POST /api/generate` - Generate new deck with flashcards
- `GET /api/decks` - Get user's decks
- `GET /api/decks/:id` - Get specific deck with cards
- `DELETE /api/decks/:id` - Delete deck

### Learning
- `POST /api/cards/:id/review` - Submit review for a card (SM-2 algorithm)
- `GET /api/review/:deckId` - Get cards due for review

### Settings
- `POST /api/settings/api-key` - Save user's personal API key
- `GET /api/settings/api-key` - Check if user has personal API key

## Spaced Repetition Algorithm (SM-2)

The app implements the SuperMemo 2 (SM-2) algorithm:

- **Quality Rating**: 0-5 (0=forgotten, 5=perfect)
- **Easiness Factor**: Ranges from 1.3 to 2.5
- **Interval**: Days until next review
- **Repetitions**: Number of successful repetitions

Review scheduling automatically adjusts based on user performance.

## API Key Management

### System Key (recommended for testing)
- Set `OPENAI_API_KEY` in environment
- All users share the same API quota

### User Key (production)
- Users can set personal OpenAI API key in Settings
- Key is encrypted using AES-256
- Used instead of system key if available

Priority: User Key > System Key

## Security Considerations

✅ **API Key Protection**
- Never exposed to frontend
- AES-256 encryption in database
- Secure token-based authentication

✅ **Authentication**
- Password hashing with bcrypt
- NextAuth.js session management
- Protected API routes

✅ **Data Privacy**
- User progress isolated by user_id
- Encrypted API keys
- No logging of sensitive data

## Development

### Scripts
```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Generate Prisma client
pnpm dlx prisma generate

# Run migrations
pnpm dlx prisma migrate dev

# View database (Prisma Studio)
pnpm dlx prisma studio
```

### Project Structure
```
app/
  ├── api/                 # API routes
  ├── lib/                 # Utilities
  ├── ui/                  # UI components
  ├── login/               # Login page
  ├── register/            # Registration page
  ├── dashboard/           # Dashboard
  ├── generate/            # Generate flashcards
  ├── study/[id]/          # Study mode
  ├── settings/            # Settings
  └── layout.tsx           # Root layout
prisma/
  └── schema.prisma        # Database schema
```

## Future Enhancements (Phase 2+)

- [ ] Text-to-speech (TTS) improvements
- [ ] CSV/Anki export
- [ ] Public deck sharing
- [ ] Deck comments and ratings
- [ ] Mobile app (React Native)
- [ ] Offline support (PWA)
- [ ] Advanced analytics dashboard
- [ ] Gamification (streaks, badges)
- [ ] Collaborative learning

## Troubleshooting

### Database Connection Issues
```bash
# Check your DATABASE_URL in .env.local
# PostgreSQL must be running and accessible
pnpm dlx prisma db push
```

### OpenAI API Errors
- Verify `OPENAI_API_KEY` is valid and has credits
- Check API rate limits
- Ensure proper request format

### Authentication Issues
- Clear browser cookies
- Check `NEXTAUTH_SECRET` is set
- Verify `NEXTAUTH_URL` matches your environment

## License

MIT

## Contributing

Contributions welcome! Please submit PRs with tests.

---

Built with ❤️ for language learners everywhere 📚
