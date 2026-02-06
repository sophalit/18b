# Quick Start Guide

Get your Telegram Mini App Shop up and running in minutes!

## Prerequisites

- Node.js 18+ and npm 9+
- MySQL 8.0+ (or use Docker Compose which includes MySQL)
- A Telegram Bot Token from [@BotFather](https://t.me/botfather)

## Option 1: Quick Start with Docker Compose (Recommended)

This is the fastest way to get started - everything runs in containers!

### Step 1: Clone and Configure

```bash
# Navigate to the project
cd telegram-mini-shop

# Copy environment file
cp .env.example .env

# Edit .env and add your Telegram Bot Token
# DB_PASSWORD=your_secure_password
# TELEGRAM_BOT_TOKEN=your_actual_bot_token_from_botfather
```

### Step 2: Start Everything

```bash
# Start MySQL and the application
docker-compose up -d

# Check logs
docker-compose logs -f backend
```

### Step 3: Initialize Database

```bash
# Run migrations (one-time setup)
docker-compose exec backend npm run migrate
```

### Step 4: Access the Application

- Backend API: http://localhost:3000
- Health Check: http://localhost:3000/health

That's it! Your shop is running! 🎉

## Option 2: Manual Setup (Development)

If you prefer to run things manually without Docker:

### Step 1: Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Step 2: Setup MySQL Database

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE telegram_shop;
exit;
```

### Step 3: Configure Environment

```bash
# Configure backend
cd backend
cp .env.example .env
# Edit .env with your MySQL credentials and Telegram Bot Token
```

### Step 4: Run Migrations

```bash
# Still in backend directory
npm run migrate
```

### Step 5: Start Development Servers

```bash
# From project root, run both servers simultaneously
npm run dev

# Or run them separately:
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend  
npm run dev:frontend
```

### Step 6: Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Health Check: http://localhost:3000/health

## Configure Your Telegram Bot

### Step 1: Create a Bot

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Send `/newbot` and follow the prompts
3. Copy the Bot Token you receive
4. Add this token to your `.env` file as `TELEGRAM_BOT_TOKEN`

### Step 2: Configure Mini App

1. In BotFather, send `/mybots`
2. Select your bot
3. Choose "Bot Settings" → "Menu Button"
4. Choose "Edit Menu Button URL"
5. Set the URL to your deployed app (or use ngrok for local testing)

### For Local Testing with ngrok:

```bash
# Install ngrok
npm install -g ngrok

# Expose your local server
ngrok http 3000

# Use the https URL provided by ngrok in BotFather
```

## Verify Everything Works

### Test Backend API

```bash
# Check health
curl http://localhost:3000/health

# Get products
curl http://localhost:3000/api/products
```

Expected response for products:
```json
[
  {
    "id": 1,
    "name": "Smartphone Pro",
    "description": "Latest flagship smartphone with amazing features",
    "price": 699.99,
    "image_url": "https://images.unsplash.com/...",
    "stock": 50
  },
  ...
]
```

### Test in Telegram

1. Open your bot in Telegram
2. Click the Menu Button (should open your Mini App)
3. You should see the product catalog
4. Try adding products to cart
5. Complete a test order

## Common Issues

### Database Connection Failed

```bash
# Check MySQL is running
mysql -u root -p

# Verify credentials in backend/.env match your MySQL setup
```

### Cannot connect to backend

```bash
# Ensure backend is running on port 3000
netstat -an | grep 3000

# Check backend/.env has correct PORT setting
```

### Telegram authentication issues

```bash
# Verify TELEGRAM_BOT_TOKEN is correct in .env
# Make sure Mini App URL is set correctly in BotFather
# For local dev, use ngrok to expose your local server
```

## Next Steps

1. **Customize Products**: Edit the sample products in `backend/src/config/migrate.ts`
2. **Style the App**: Modify CSS files in `frontend/src/styles/`
3. **Add Features**: Extend the API with new endpoints
4. **Deploy**: Follow `DEPLOYMENT.md` for production deployment

## Development Tips

### Hot Reload

Both frontend and backend support hot reload in development mode:
- Frontend: Changes automatically refresh in browser
- Backend: Changes automatically restart the server

### Database Reset

To reset the database:

```bash
# Drop and recreate database
mysql -u root -p
DROP DATABASE telegram_shop;
CREATE DATABASE telegram_shop;
exit;

# Run migrations again
cd backend
npm run migrate
```

### View Logs

Docker Compose:
```bash
docker-compose logs -f backend
```

Manual:
```bash
# Backend logs appear in terminal where you ran `npm run dev:backend`
# Frontend logs appear in browser console
```

## Resources

- [Telegram Bot API Documentation](https://core.telegram.org/bots/api)
- [Telegram Mini Apps Documentation](https://core.telegram.org/bots/webapps)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)

## Need Help?

Check the following files:
- `README.md` - Full project documentation
- `DEPLOYMENT.md` - Deployment guide
- Issues on GitHub repository

Happy coding! 🚀
