# Quick Start Guide

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager
- Afiya Zone backend server running on port 5000

## Installation

1. Navigate to the admin panel directory:
   ```bash
   cd admin-panel
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Development

Start the development server:
```bash
npm run dev
```

The admin panel will be available at http://localhost:3001

## Building for Production

Create a production build:
```bash
npm run build
```

The built files will be in the `dist` directory.

## Default Admin Credentials

Email: admin@afiyazone.com
Password: Admin@123

## Features Overview

### Dashboard
- View key metrics (total users, products, orders, revenue)
- See order status breakdown

### User Management
- View all registered users
- Add new admin users
- Delete users

### Product Management
- Add new products with multilingual support
- Edit existing products
- Delete products
- Manage product categories, prices, and stock

### Order Management
- View all orders
- Update order status
- Preview and download invoices
- Delete orders

## Currency
All prices are displayed in UAE Dirham (AED).