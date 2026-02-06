# Deployment Guide

This guide covers different deployment options for the Telegram Mini App Shop.

## Prerequisites

Before deploying, ensure you have:
- A Telegram Bot Token from [@BotFather](https://t.me/botfather)
- A MySQL database (local or cloud)
- Node.js 18+ and npm 9+ (for manual deployment)
- Docker and Docker Compose (for containerized deployment)

## Environment Setup

1. Create a `.env` file in the project root (copy from `.env.example`):
```bash
cp .env.example .env
```

2. Update the environment variables:
```env
DB_PASSWORD=your_secure_password
DB_NAME=telegram_shop
TELEGRAM_BOT_TOKEN=your_actual_bot_token
ALLOWED_ORIGINS=https://your-domain.com
```

## Deployment Options

### Option 1: Docker Compose (Recommended)

This is the easiest way to deploy the application with all dependencies.

1. Make sure Docker and Docker Compose are installed
2. Update the `.env` file with your configuration
3. Run the deployment:

```bash
docker-compose up -d
```

4. Check the logs:
```bash
docker-compose logs -f
```

5. The application will be available at `http://localhost:3000`

To stop:
```bash
docker-compose down
```

### Option 2: Manual Deployment

#### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in `backend/` directory:
```bash
cp .env.example .env
```

4. Update backend `.env` with your MySQL credentials

5. Run database migrations:
```bash
npm run migrate
```

6. Build the backend:
```bash
npm run build
```

7. Start the backend:
```bash
npm start
```

#### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Build the frontend:
```bash
npm run build
```

4. The build output will be in `frontend/dist/`

5. Copy the build to the backend's public directory:
```bash
cp -r dist/* ../backend/dist/public/
```

### Option 3: Cloud Deployment (Heroku, Railway, etc.)

1. Build the Docker image:
```bash
docker build -t telegram-shop .
```

2. Push to your container registry

3. Deploy to your cloud provider with the required environment variables

## Database Setup

If using an external MySQL database:

1. Create the database:
```sql
CREATE DATABASE telegram_shop;
```

2. Update the `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` in your `.env` file

3. Run migrations:
```bash
cd backend
npm run migrate
```

## Telegram Bot Configuration

1. Go to [@BotFather](https://t.me/botfather)
2. Select your bot
3. Choose "Bot Settings" → "Menu Button" → "Configure menu button"
4. Set the URL to your deployed application (e.g., `https://your-domain.com`)
5. Alternatively, use "Mini App" settings

## Production Checklist

- [ ] Update `TELEGRAM_BOT_TOKEN` with your actual bot token
- [ ] Set a secure `DB_PASSWORD`
- [ ] Update `ALLOWED_ORIGINS` to your production domain
- [ ] Enable HTTPS for your domain
- [ ] Run database migrations
- [ ] Test the application end-to-end
- [ ] Set up monitoring and logging
- [ ] Configure backups for the database

## Monitoring

Check application health:
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{"status":"ok","timestamp":"2024-01-01T00:00:00.000Z"}
```

## Troubleshooting

### Database Connection Issues
- Verify MySQL is running
- Check database credentials in `.env`
- Ensure database exists
- Check network connectivity

### Telegram Authentication Issues
- Verify `TELEGRAM_BOT_TOKEN` is correct
- Ensure the bot is configured in BotFather
- Check that the Mini App URL is set correctly

### CORS Issues
- Verify `ALLOWED_ORIGINS` includes your frontend domain
- Check that the frontend is using the correct API URL

## Scaling

For production workloads:
- Use a managed MySQL service (AWS RDS, Google Cloud SQL, etc.)
- Deploy multiple backend instances behind a load balancer
- Use Redis for session management (future enhancement)
- Enable CDN for static assets
- Implement rate limiting

## Security

- Never commit `.env` files to version control
- Use environment variables for all secrets
- Keep dependencies up to date
- Use HTTPS in production
- Implement rate limiting
- Regular security audits
