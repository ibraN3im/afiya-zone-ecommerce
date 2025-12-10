# 🚀 Afiya Zone - API Endpoints Reference

## Base URL
```
http://localhost:5000
```

---

## 📍 Available Endpoints

### ✅ Server Info & Health

#### Get Server Information
```http
GET http://localhost:5000/
```

**Response:**
```json
{
  "message": "Afiya Zone API Server",
  "status": "Running",
  "version": "1.0.0",
  "endpoints": { ... }
}
```

#### Health Check
```http
GET http://localhost:5000/api/health
```

**Response:**
```json
{
  "status": "OK",
  "message": "Afiya Zone API is running",
  "timestamp": "2025-11-25T..."
}
```

---

### 🔐 Authentication

#### Register New User
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+966501234567",
  "newsletter": false
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+966501234567",
    "joinDate": "2025-11-25T..."
  }
}
```

#### Login User
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** Same as register

#### Get User Profile (Protected)
```http
GET http://localhost:5000/api/auth/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+966501234567",
  "joinDate": "2025-11-25T...",
  "addresses": []
}
```

#### Get All Users (Testing Only)
```http
GET http://localhost:5000/api/auth/users
```

**Response:**
```json
{
  "count": 5,
  "users": [
    {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+966501234567",
      "createdAt": "2025-11-25T..."
    }
  ]
}
```

---

### 📦 Products

#### Get All Products
```http
GET http://localhost:5000/api/products
```

**Optional Query Parameters:**
- `category` - Filter by category
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `minRating` - Minimum rating
- `search` - Search term
- `sortBy` - Sort field
- `isFeatured` - Filter for featured products only (true/false)

**Example:**
```http
GET http://localhost:5000/api/products?category=supplements&minPrice=10&maxPrice=100
```

#### Get Product by ID
```http
GET http://localhost:5000/api/products/:id
```

**Example:**
```http
GET http://localhost:5000/api/products/673f5ca8e5f1234567890abc
```

#### Create Product (Protected)
```http
POST http://localhost:5000/api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": {
    "en": "Product Name",
    "ar": "اسم المنتج"
  },
  "description": {
    "en": "Product description",
    "ar": "وصف المنتج"
  },
  "price": 29.99,
  "category": "supplements",
  "stock": 100,
  "images": ["url1", "url2"]
}
```

---

### 🛒 Orders

#### Create Order (Protected)
```http
POST http://localhost:5000/api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "product": "673f5ca8e5f1234567890abc",
      "quantity": 2,
      "price": 29.99
    }
  ],
  "shippingAddress": {
    "fullName": "John Doe",
    "phone": "+966501234567",
    "address": "123 Main St",
    "city": "Riyadh",
    "state": "Riyadh Region",
    "zipCode": "12345",
    "country": "saudi"
  },
  "paymentMethod": "credit_card",
  "subtotal": 59.98,
  "shipping": 9.99,
  "tax": 4.80,
  "total": 74.77,
  "notes": "Delivery: standard"
}
```

#### Get My Orders (Protected)
```http
GET http://localhost:5000/api/orders/my-orders
Authorization: Bearer <token>
```

#### Get Order by ID (Protected)
```http
GET http://localhost:5000/api/orders/:id
Authorization: Bearer <token>
```

---

## 🔑 Authentication Token

After login/register, you'll receive a token. Include it in the `Authorization` header for protected routes:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

The frontend automatically stores this token in `localStorage`.

---

## ⚠️ Common Errors

### 404 - Route not found
**Cause:** Wrong URL or missing `/api` prefix  
**Solution:** All routes except root (`/`) must start with `/api`

**Example of wrong URL:**
```
❌ http://localhost:5000/auth/login
✅ http://localhost:5000/api/auth/login
```

### 401 - Unauthorized
**Cause:** Missing or invalid token  
**Solution:** Include valid Bearer token in Authorization header

### 400 - Bad Request
**Cause:** Invalid data or validation error  
**Solution:** Check request body matches the expected format

### 500 - Server Error
**Cause:** Internal server error  
**Solution:** Check server logs in terminal

---

## 🧪 Testing Tools

### Option 1: Use test-api.html
Open `test-api.html` in your browser for a visual testing interface.

### Option 2: Use curl (Terminal)
```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@test.com","password":"test123","phone":"+966501234567"}'

# Get all users
curl http://localhost:5000/api/auth/users
```

### Option 3: Use Postman or Thunder Client (VS Code Extension)

---

## 📝 Notes

- ✅ Server runs on port **5000**
- ✅ Frontend runs on port **3000**
- ✅ All API routes require `/api` prefix (except root)
- ✅ MongoDB Atlas is used for data storage
- ✅ JWT tokens expire after 7 days

---

Last Updated: 2025-11-25
