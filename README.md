# 🛒 Telegram Mini App Shop

Telegram Mini App (shop-style) — TypeScript + Express + MySQL + React

## រចនាសម្ព័ន្ធ (Structure)

```
├── apps/
│   ├── api/     # Express + TypeScript + MySQL
│   ├── bot/     # grammY Telegram Bot
│   └── web/     # React + Vite + Tailwind CDN
├── docker-compose.yml
├── guide.html   # មគ្គុទ្ទេសពេញលេញ (Khmer)
└── package.json # npm workspaces
```

## តម្រូវការមុន (Prerequisites)

- Node.js 18+
- Docker & Docker Compose
- ngrok (សម្រាប់ Telegram testing)
- Telegram Bot Token (ពី @BotFather)

## ដំណើរការ Locally (Run Locally)

### 1. ដំឡើង dependencies

```bash
npm install
```

### 2. Start MySQL

```bash
docker compose up -d
```

### 3. Setup environment

```bash
# API
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env with your bot token

# Bot
cp apps/bot/.env.example apps/bot/.env
# Edit apps/bot/.env with your bot token and webapp URL

# Web
cp apps/web/.env.example apps/web/.env
```

### 4. Migrate & Seed Database

```bash
npm -w apps/api run migrate
npm -w apps/api run seed
```

### 5. Start all services

```bash
# Terminal 1 — API
npm run dev:api

# Terminal 2 — Web
npm run dev:web

# Terminal 3 — ngrok (expose web for Telegram)
ngrok http 5173

# Terminal 4 — Bot (update WEBAPP_URL first)
npm run dev:bot
```

### 6. Test in Telegram

1. សរសេរ `/start` ទៅ Bot
2. ចុច "🛒 Open Shop"
3. បន្ថែម products ទៅកន្ត្រក
4. ចុច Checkout
5. Bot ទទួល order confirmation

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | ❌ | Health check |
| GET | `/products` | ❌ | List active products |
| GET | `/me` | ✅ | Upsert & get user |
| POST | `/orders` | ✅ | Create order |

**Auth**: ផ្ញើ header `x-telegram-init-data` ជាមួយ `Telegram.WebApp.initData`

## Database Schema

- **users**: id, telegramId (unique), firstName, username, createdAt
- **products**: id, title, priceCents, imageUrl, active, createdAt
- **orders**: id, userId, totalCents, status, createdAt
- **order_items**: id, orderId, productId, qty, unitCents

## Deploy Checklist

### Web (Vercel / Netlify / Cloudflare Pages)
- [ ] Build: `npm -w apps/web run build`
- [ ] Output: `apps/web/dist`
- [ ] Env: `VITE_API_URL=https://your-api.example.com`

### API (Render / Railway / Fly.io)
- [ ] Build: `npm -w apps/api run build`
- [ ] Start: `node apps/api/dist/index.js`
- [ ] Env: `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME`, `TELEGRAM_BOT_TOKEN`, `CORS_ORIGIN`

### Bot (Render / Fly.io / VPS)
- [ ] Build: `npm -w apps/bot run build`
- [ ] Start: `node apps/bot/dist/index.js`
- [ ] Env: `TELEGRAM_BOT_TOKEN`, `WEBAPP_URL`

### ⚠️ សុវត្ថិភាព (Security)
- CORS ត្រូវកំណត់ CORS_ORIGIN ឲ្យត្រឹមត្រូវ
- Bot token មិនត្រូវ commit ទៅ git
- initData ត្រូវ validate ដោយ HMAC ជានិច្ច
- auth_date ត្រូវពិនិត្យថាមិនចាស់ (< 1 ម៉ោង)

## Hardening

- **CORS**: កំណត់ origin ជាក់លាក់ (មិនមែន `*`)
- **Rate Limiting**: 200 requests / 15 min per IP
- **Validation**: Zod schema validation សម្រាប់ request body
- **Error Handling**: Global error handler + console.error logging
- **Env Separation**: .env.example files សម្រាប់ reference

## Extension Ideas

- Admin product CRUD endpoints
- Payment integration (Stripe / etc.)
- Order status updates / notifications via bot
- Order history page ក្នុង Mini App