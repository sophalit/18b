# Telegram Mini App Shop

A full-stack Telegram Mini App for an e-commerce shop built with TypeScript, Express, MySQL, and React.

## Features

- 🛍️ Product catalog with images and descriptions
- 🛒 Shopping cart functionality
- 📦 Order management
- 🔐 Telegram user authentication
- 🎨 Telegram theme integration
- 📱 Mobile-first responsive design

## Tech Stack

### Backend
- **Node.js** with **Express** - Web server
- **TypeScript** - Type-safe development
- **MySQL** - Database
- **mysql2** - MySQL client

### Frontend
- **React** - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Build tool
- **Telegram Mini App SDK** - Telegram integration

## Project Structure

```
telegram-mini-shop/
├── backend/          # Express backend API
│   ├── src/
│   │   ├── config/   # Configuration files
│   │   ├── models/   # Database models
│   │   ├── routes/   # API routes
│   │   ├── middleware/ # Custom middleware
│   │   └── server.ts # Entry point
│   └── package.json
├── frontend/         # React frontend
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/    # Page components
│   │   ├── services/ # API services
│   │   └── App.tsx   # Main app component
│   └── package.json
└── package.json      # Root package.json
```

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- MySQL >= 8.0

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd telegram-mini-shop
```

2. Install dependencies:
```bash
npm run install-all
```

3. Configure environment variables:

Create `.env` file in the `backend` directory:
```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=telegram_shop

# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token
```

4. Setup MySQL database:
```bash
mysql -u root -p
CREATE DATABASE telegram_shop;
```

5. Initialize the database:
```bash
cd backend
npm run migrate
```

## Development

Run both frontend and backend in development mode:
```bash
npm run dev
```

Or run them separately:
```bash
# Backend only
npm run dev:backend

# Frontend only
npm run dev:frontend
```

## Production Build

Build both frontend and backend:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## Deployment

### Using Docker

1. Build the Docker image:
```bash
docker build -t telegram-mini-shop .
```

2. Run the container:
```bash
docker run -p 3000:3000 \
  -e DB_HOST=your_db_host \
  -e DB_USER=your_db_user \
  -e DB_PASSWORD=your_db_password \
  -e DB_NAME=telegram_shop \
  -e TELEGRAM_BOT_TOKEN=your_bot_token \
  telegram-mini-shop
```

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Copy the following to your server:
   - `backend/dist/`
   - `backend/package.json`
   - `backend/package-lock.json`
   - `frontend/dist/`

3. Install production dependencies:
```bash
cd backend && npm install --production
```

4. Start the server:
```bash
NODE_ENV=production npm start
```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status (admin)

### User
- `GET /api/user/profile` - Get user profile
- `POST /api/user/validate` - Validate Telegram user

## Telegram Bot Setup

1. Create a new bot using [@BotFather](https://t.me/botfather)
2. Get your bot token
3. Set up the Mini App:
   - Go to BotFather
   - Select your bot
   - Choose "Mini App"
   - Set the URL to your deployed frontend

## License

MIT