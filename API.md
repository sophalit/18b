# API Documentation

Complete REST API documentation for the Telegram Mini App Shop backend.

## Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-domain.com/api`

## Authentication

Most endpoints require Telegram authentication. Include the Telegram WebApp init data in the Authorization header:

```
Authorization: tma <telegram_init_data>
```

The backend validates the hash using your bot token to ensure the request comes from a legitimate Telegram user.

## Response Format

### Success Response
```json
{
  "data": { ... }
}
```

### Error Response
```json
{
  "error": "Error message"
}
```

---

## Products Endpoints

### Get All Products

Retrieve all available products.

**Endpoint**: `GET /products`

**Authentication**: Not required

**Response**: `200 OK`
```json
[
  {
    "id": 1,
    "name": "Smartphone Pro",
    "description": "Latest flagship smartphone with amazing features",
    "price": 699.99,
    "image_url": "https://example.com/image.jpg",
    "stock": 50,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### Get Product by ID

Retrieve a specific product by its ID.

**Endpoint**: `GET /products/:id`

**Authentication**: Not required

**Parameters**:
- `id` (path parameter) - Product ID

**Response**: `200 OK`
```json
{
  "id": 1,
  "name": "Smartphone Pro",
  "description": "Latest flagship smartphone with amazing features",
  "price": 699.99,
  "image_url": "https://example.com/image.jpg",
  "stock": 50,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

**Error**: `404 Not Found`
```json
{
  "error": "Product not found"
}
```

---

### Create Product (Admin)

Create a new product. Simplified for MVP - no authentication required.

**Endpoint**: `POST /products`

**Authentication**: Not required (should be protected in production)

**Request Body**:
```json
{
  "name": "New Product",
  "description": "Product description",
  "price": 99.99,
  "image_url": "https://example.com/image.jpg",
  "stock": 100
}
```

**Response**: `201 Created`
```json
{
  "id": 7,
  "name": "New Product",
  "description": "Product description",
  "price": 99.99,
  "image_url": "https://example.com/image.jpg",
  "stock": 100,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

**Error**: `400 Bad Request`
```json
{
  "error": "Name and price are required"
}
```

---

### Update Product (Admin)

Update an existing product.

**Endpoint**: `PUT /products/:id`

**Authentication**: Not required (should be protected in production)

**Parameters**:
- `id` (path parameter) - Product ID

**Request Body**:
```json
{
  "name": "Updated Product",
  "description": "Updated description",
  "price": 149.99,
  "image_url": "https://example.com/updated.jpg",
  "stock": 75
}
```

**Response**: `200 OK`
```json
{
  "id": 1,
  "name": "Updated Product",
  "description": "Updated description",
  "price": 149.99,
  "image_url": "https://example.com/updated.jpg",
  "stock": 75,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-02T00:00:00.000Z"
}
```

**Error**: `404 Not Found`

---

### Delete Product (Admin)

Delete a product.

**Endpoint**: `DELETE /products/:id`

**Authentication**: Not required (should be protected in production)

**Parameters**:
- `id` (path parameter) - Product ID

**Response**: `200 OK`
```json
{
  "message": "Product deleted successfully"
}
```

**Error**: `404 Not Found`

---

## Orders Endpoints

### Get User's Orders

Retrieve all orders for the authenticated user.

**Endpoint**: `GET /orders`

**Authentication**: Required (Telegram)

**Response**: `200 OK`
```json
[
  {
    "id": 1,
    "user_id": 1,
    "telegram_user_id": 123456789,
    "total_amount": 949.98,
    "status": "pending",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "items": [
      {
        "id": 1,
        "order_id": 1,
        "product_id": 1,
        "quantity": 2,
        "price": 699.99,
        "product_name": "Smartphone Pro",
        "product_image": "https://example.com/image.jpg"
      }
    ]
  }
]
```

**Error**: `401 Unauthorized`

---

### Get Order by ID

Retrieve a specific order by its ID.

**Endpoint**: `GET /orders/:id`

**Authentication**: Required (Telegram)

**Parameters**:
- `id` (path parameter) - Order ID

**Response**: `200 OK`
```json
{
  "id": 1,
  "user_id": 1,
  "telegram_user_id": 123456789,
  "total_amount": 949.98,
  "status": "pending",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z",
  "items": [
    {
      "id": 1,
      "order_id": 1,
      "product_id": 1,
      "quantity": 2,
      "price": 699.99,
      "product_name": "Smartphone Pro",
      "product_image": "https://example.com/image.jpg"
    }
  ]
}
```

**Error**: `404 Not Found` or `403 Forbidden`

---

### Create Order

Create a new order with items from the shopping cart.

**Endpoint**: `POST /orders`

**Authentication**: Required (Telegram)

**Request Body**:
```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 3,
      "quantity": 1
    }
  ]
}
```

**Response**: `201 Created`
```json
{
  "id": 1,
  "user_id": 1,
  "telegram_user_id": 123456789,
  "total_amount": 1699.97,
  "status": "pending",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z",
  "items": [
    {
      "id": 1,
      "order_id": 1,
      "product_id": 1,
      "quantity": 2,
      "price": 699.99,
      "product_name": "Smartphone Pro",
      "product_image": "https://example.com/image.jpg"
    }
  ]
}
```

**Errors**:

`400 Bad Request` - Missing or invalid items
```json
{
  "error": "Items are required"
}
```

`400 Bad Request` - Product not found
```json
{
  "error": "Product 5 not found"
}
```

`400 Bad Request` - Insufficient stock
```json
{
  "error": "Insufficient stock for product Smartphone Pro"
}
```

---

### Update Order Status (Admin)

Update the status of an order.

**Endpoint**: `PUT /orders/:id/status`

**Authentication**: Not required (should be protected in production)

**Parameters**:
- `id` (path parameter) - Order ID

**Request Body**:
```json
{
  "status": "processing"
}
```

**Valid status values**: `pending`, `processing`, `completed`, `cancelled`

**Response**: `200 OK`
```json
{
  "id": 1,
  "user_id": 1,
  "telegram_user_id": 123456789,
  "total_amount": 949.98,
  "status": "processing",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T12:00:00.000Z"
}
```

**Error**: `400 Bad Request` or `404 Not Found`

---

## User Endpoints

### Get User Profile

Retrieve the authenticated user's profile.

**Endpoint**: `GET /user/profile`

**Authentication**: Required (Telegram)

**Response**: `200 OK`
```json
{
  "id": 1,
  "telegram_id": 123456789,
  "first_name": "John",
  "last_name": "Doe",
  "username": "johndoe",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

**Error**: `401 Unauthorized`

---

### Validate Telegram User

Validate the Telegram authentication.

**Endpoint**: `POST /user/validate`

**Authentication**: Required (Telegram)

**Response**: `200 OK`
```json
{
  "valid": true,
  "user": {
    "id": 123456789,
    "first_name": "John",
    "last_name": "Doe",
    "username": "johndoe"
  }
}
```

**Error**: `401 Unauthorized`

---

## Health Check

### Check Server Status

Check if the server is running and healthy.

**Endpoint**: `GET /health`

**Authentication**: Not required

**Response**: `200 OK`
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |

---

## Rate Limiting

Currently no rate limiting is implemented. For production, consider:
- Implementing rate limiting middleware
- Setting appropriate limits per endpoint
- Using Redis for distributed rate limiting

---

## Examples

### Using cURL

```bash
# Get all products
curl http://localhost:3000/api/products

# Get product by ID
curl http://localhost:3000/api/products/1

# Create order (with Telegram auth)
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: tma query_id=xxx&user=xxx&auth_date=xxx&hash=xxx" \
  -d '{"items":[{"productId":1,"quantity":2}]}'
```

### Using JavaScript (Frontend)

```javascript
// Get products
const products = await fetch('/api/products').then(r => r.json());

// Create order with Telegram auth
const order = await fetch('/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `tma ${window.Telegram.WebApp.initData}`
  },
  body: JSON.stringify({
    items: [
      { productId: 1, quantity: 2 }
    ]
  })
}).then(r => r.json());
```

---

## Future Enhancements

- Payment gateway integration
- Order tracking
- Product categories
- Search and filters
- Reviews and ratings
- Admin dashboard
- Webhooks for order updates
