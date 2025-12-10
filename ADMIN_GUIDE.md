# Admin Dashboard Guide

## Admin Access

An admin account has been created with the following credentials:

**Email:** admin@afiyazone.com  
**Password:** Admin@123

## Features

The admin dashboard provides complete CRUD (Create, Read, Update, Delete) operations for managing the entire e-commerce platform.

### 1. Overview Tab
- **Total Users**: View count of all registered users
- **Total Products**: See total number of products in catalog
- **Total Orders**: Track all orders placed
- **Total Revenue**: Monitor total sales revenue
- **Orders by Status**: Visual breakdown of order statuses (pending, processing, shipped, delivered)

### 2. User Management
**Capabilities:**
- View all registered users
- See user details (name, email, phone, role)
- Delete users
- View user roles (admin/user)

**API Endpoints:**
- GET `/api/admin/users` - List all users
- PUT `/api/admin/users/:id` - Update user details
- DELETE `/api/admin/users/:id` - Delete a user

### 3. Product Management
**Capabilities:**
- View all products in the catalog
- See product details (name, category, price, stock)
- Add new products
- Update existing products
- Delete products

**API Endpoints:**
- GET `/api/admin/products` - List all products
- POST `/api/admin/products` - Create new product
- PUT `/api/admin/products/:id` - Update product
- DELETE `/api/admin/products/:id` - Delete product

**Product Schema:**
```json
{
  "name": {
    "en": "Product Name",
    "ar": "اسم المنتج"
  },
  "description": {
    "en": "Description",
    "ar": "الوصف"
  },
  "category": "supplements|cosmetics|herbal|accessories",
  "price": 29.99,
  "originalPrice": 39.99,
  "stock": 100,
  "images": ["url1", "url2"],
  "discount": 25,
  "isNew": false,
  "isFeatured": true,
  "isPopular": true
}
```

**Product Fields:**
- `name`: Product name in English and Arabic
- `description`: Product description in English and Arabic
- `category`: Product category (supplements, cosmetics, herbal, accessories)
- `price`: Current selling price
- `originalPrice`: Original price (for showing discounts)
- `stock`: Available inventory
- `images`: Array of image URLs
- `discount`: Discount percentage (0-100)
- `isNew`: Boolean flag for new products
- `isFeatured`: Boolean flag for featured products (shown on homepage)

### 4. Order Management & Invoices
**Capabilities:**
- View all customer orders
- See complete order details (items, customer, shipping address)
- Update order status (pending → processing → shipped → delivered)
- Mark orders as cancelled
- **Download Invoice** - Generate and download text invoices for each order
- Delete orders

**Order Statuses:**
- **Pending**: New orders awaiting processing
- **Processing**: Orders being prepared
- **Shipped**: Orders in transit
- **Delivered**: Successfully delivered orders
- **Cancelled**: Cancelled orders

**Invoice Features:**
Each invoice includes:
- Order number and date
- Customer information (name, email)
- Itemized list with quantities and prices
- Subtotal, shipping, tax breakdown
- Total amount
- Shipping address
- Payment method
- Current order status

**API Endpoints:**
- GET `/api/admin/orders` - List all orders
- PUT `/api/admin/orders/:id` - Update order status
- DELETE `/api/admin/orders/:id` - Delete order

## How to Access

1. **Login** with admin credentials
2. The **"Admin"** button will appear in the header (purple color)
3. Click "Admin" to access the dashboard
4. Navigate between tabs: Overview, Users, Products, Orders