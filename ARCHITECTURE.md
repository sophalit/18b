# Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        TELEGRAM CLIENT                          │
│                    (Mobile/Desktop App)                         │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ Opens Mini App
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + TS)                        │
│  ┌────────────┬────────────┬────────────┬──────────────┐      │
│  │  Products  │    Cart    │   Orders   │   User       │      │
│  │   Page     │    Page    │    Page    │  Profile     │      │
│  └────────────┴────────────┴────────────┴──────────────┘      │
│                                                                  │
│  Components: ProductCard, Cart, OrderList                       │
│  Services: API Client with Telegram Auth                        │
│  Utils: Cart Storage (LocalStorage)                             │
│  Theme: Telegram WebApp Theme Integration                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTPS/REST API
                         │ Authorization: tma <initData>
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Express + TS)                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   API ROUTES                              │  │
│  │  /api/products  │  /api/orders  │  /api/user            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                         │                                        │
│  ┌──────────────────────▼──────────────────────────────────┐  │
│  │               MIDDLEWARE LAYER                           │  │
│  │  • CORS                                                  │  │
│  │  • Telegram Auth (Hash Validation)                      │  │
│  │  • Error Handler                                        │  │
│  │  • JSON Parser                                          │  │
│  └──────────────────────┬──────────────────────────────────┘  │
│                         │                                        │
│  ┌──────────────────────▼──────────────────────────────────┐  │
│  │                  MODELS LAYER                            │  │
│  │  • UserModel                                            │  │
│  │  • ProductModel                                         │  │
│  │  • OrderModel                                           │  │
│  └──────────────────────┬──────────────────────────────────┘  │
└────────────────────────┬┴────────────────────────────────────┬─┘
                         │                                      │
                         │ SQL Queries                         │
                         │ (mysql2 with connection pool)       │
                         │                                      │
                         ▼                                      │
┌─────────────────────────────────────────────────────────────┐ │
│                    MySQL DATABASE                           │ │
│  ┌────────────┬────────────┬────────────┬──────────────┐   │ │
│  │   users    │  products  │   orders   │ order_items  │   │ │
│  │            │            │            │              │   │ │
│  │ • id       │ • id       │ • id       │ • id         │   │ │
│  │ • tg_id    │ • name     │ • user_id  │ • order_id   │   │ │
│  │ • fname    │ • desc     │ • tg_uid   │ • product_id │   │ │
│  │ • lname    │ • price    │ • total    │ • quantity   │   │ │
│  │ • username │ • image    │ • status   │ • price      │   │ │
│  │ • created  │ • stock    │ • created  │              │   │ │
│  └────────────┴────────────┴────────────┴──────────────┘   │ │
└─────────────────────────────────────────────────────────────┘ │
                                                                 │
┌────────────────────────────────────────────────────────────────┘
│                    TELEGRAM BOT API
│                  (Bot Token Validation)
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. User Authentication Flow

```
User Opens Mini App
      │
      ▼
Telegram sends initData
      │
      ▼
Frontend includes initData in Authorization header
      │
      ▼
Backend validates hash with Bot Token
      │
      ├─── Valid ────▶ Create/Find User ──▶ Return User Data
      │
      └─── Invalid ──▶ Return 401 Unauthorized
```

### 2. Order Creation Flow

```
User adds products to cart (LocalStorage)
      │
      ▼
User clicks "Checkout"
      │
      ▼
Frontend sends POST /api/orders with items
      │
      ▼
Backend validates Telegram auth
      │
      ▼
Backend validates products and stock
      │
      ▼
Database Transaction Begins
      │
      ├─▶ Create Order Record
      │
      ├─▶ Create Order Items
      │
      ├─▶ Update Product Stock
      │
      └─▶ Commit Transaction
      │
      ▼
Return Order with Items
      │
      ▼
Frontend clears cart and shows success
```

### 3. Product Listing Flow

```
User opens Products page
      │
      ▼
Frontend sends GET /api/products
      │
      ▼
Backend queries products table
      │
      ▼
Return products array with images
      │
      ▼
Frontend renders ProductCard components
      │
      ▼
User sees product catalog
```

## Technology Stack Details

### Frontend Stack
```
┌─────────────────────────────────────┐
│ React 18                            │
│  └─ TypeScript                      │
│     └─ Vite (Build Tool)            │
│        └─ Telegram WebApp SDK       │
│           └─ CSS3 (Styling)         │
└─────────────────────────────────────┘
```

### Backend Stack
```
┌─────────────────────────────────────┐
│ Node.js 18+                         │
│  └─ Express.js                      │
│     └─ TypeScript                   │
│        └─ mysql2 (MySQL Client)     │
│           └─ crypto (Hash Validation)│
└─────────────────────────────────────┘
```

### Database Stack
```
┌─────────────────────────────────────┐
│ MySQL 8.0                           │
│  └─ InnoDB Engine                   │
│     └─ UTF8MB4 Charset              │
│        └─ Transaction Support       │
└─────────────────────────────────────┘
```

## Deployment Architecture

### Docker Compose Setup

```
┌──────────────────────────────────────────────────────────┐
│                    Docker Host                           │
│                                                           │
│  ┌────────────────────┐      ┌────────────────────┐    │
│  │  Backend Container │      │  MySQL Container   │    │
│  │                    │      │                    │    │
│  │  • Node.js App     │◀────▶│  • MySQL 8.0       │    │
│  │  • Port 3000       │      │  • Port 3306       │    │
│  │  • Frontend Build  │      │  • Volume: mysql_  │    │
│  │    in /public      │      │    data            │    │
│  └─────────┬──────────┘      └────────────────────┘    │
│            │                                             │
└────────────┼─────────────────────────────────────────────┘
             │
             │ Port 3000
             │
             ▼
      [External Access]
```

### Production Deployment

```
┌─────────────────────────────────────────────────────────────┐
│                      Internet                               │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Load Balancer / CDN                        │
│                     (HTTPS/SSL)                             │
└────────────────────────┬────────────────────────────────────┘
                         │
           ┌─────────────┼─────────────┐
           │             │             │
           ▼             ▼             ▼
    ┌──────────┐  ┌──────────┐  ┌──────────┐
    │ Backend  │  │ Backend  │  │ Backend  │
    │ Instance │  │ Instance │  │ Instance │
    │    #1    │  │    #2    │  │    #3    │
    └─────┬────┘  └─────┬────┘  └─────┬────┘
          │             │             │
          └─────────────┼─────────────┘
                        │
                        ▼
              ┌──────────────────┐
              │  MySQL Database  │
              │  (Managed/RDS)   │
              └──────────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Security Layers                         │
│                                                              │
│  1. Telegram Authentication                                 │
│     └─ Hash validation with Bot Token                      │
│     └─ User identity verification                          │
│                                                              │
│  2. CORS Protection                                         │
│     └─ Allowed origins configuration                       │
│     └─ Credentials handling                                │
│                                                              │
│  3. SQL Injection Prevention                                │
│     └─ Parameterized queries                               │
│     └─ mysql2 prepared statements                          │
│                                                              │
│  4. Environment Variables                                   │
│     └─ Secrets in .env files                               │
│     └─ No credentials in code                              │
│                                                              │
│  5. Input Validation                                        │
│     └─ Type checking with TypeScript                       │
│     └─ Request body validation                             │
│                                                              │
│  6. Error Handling                                          │
│     └─ No sensitive data in errors                         │
│     └─ Proper HTTP status codes                            │
└─────────────────────────────────────────────────────────────┘
```

## File Organization

```
Root
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── index.ts          (Config management)
│   │   │   ├── database.ts       (DB connection)
│   │   │   └── migrate.ts        (DB migrations)
│   │   ├── middleware/
│   │   │   ├── auth.ts           (Telegram auth)
│   │   │   └── error.ts          (Error handling)
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Product.ts
│   │   │   └── Order.ts
│   │   ├── routes/
│   │   │   ├── products.ts
│   │   │   ├── orders.ts
│   │   │   └── user.ts
│   │   ├── types/
│   │   │   └── index.ts          (TypeScript types)
│   │   └── server.ts             (Entry point)
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── Cart.tsx
│   │   │   └── OrderList.tsx
│   │   ├── pages/
│   │   │   ├── Products.tsx
│   │   │   ├── CartPage.tsx
│   │   │   └── Orders.tsx
│   │   ├── services/
│   │   │   └── api.ts            (API client)
│   │   ├── styles/
│   │   │   ├── index.css
│   │   │   ├── App.css
│   │   │   └── ... (component styles)
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   └── cart.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── Dockerfile
├── docker-compose.yml
├── package.json              (Monorepo root)
├── .gitignore
├── .env.example
├── README.md
├── QUICKSTART.md
├── DEPLOYMENT.md
├── API.md
├── CONTRIBUTING.md
├── PROJECT_SUMMARY.md
└── LICENSE
```

## Component Relationships

```
App.tsx
  ├── Products Page
  │     └── ProductCard (multiple)
  │           └── Add to Cart Button
  │
  ├── Cart Page
  │     └── Cart Component
  │           ├── Cart Items (multiple)
  │           │     ├── Quantity Controls
  │           │     └── Remove Button
  │           └── Checkout Button
  │
  └── Orders Page
        └── OrderList Component
              └── Order Cards (multiple)
                    ├── Order Header (status, ID)
                    └── Order Items (multiple)
```

## API Flow Chart

```
Client Request
      │
      ▼
CORS Middleware
      │
      ▼
JSON Parser
      │
      ▼
Auth Middleware (if required)
      │
      ├─ Valid ──▶ Route Handler
      │                 │
      │                 ▼
      │            Model Layer
      │                 │
      │                 ▼
      │            Database Query
      │                 │
      │                 ▼
      │            Return Data
      │
      └─ Invalid ─▶ 401 Response
      │
      ▼
Error Handler (if error occurs)
      │
      ▼
Response to Client
```

---

This architecture supports:
- ✅ Scalability (horizontal scaling)
- ✅ Security (multi-layer)
- ✅ Maintainability (clean separation)
- ✅ Testability (modular design)
- ✅ Performance (connection pooling, indexing)
- ✅ Reliability (transactions, error handling)
