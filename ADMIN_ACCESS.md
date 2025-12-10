# How to Access Admin Dashboard

## Step-by-Step Guide:

### 1. Start the Servers (if not already running)

**Backend:**
```bash
cd server
npm run dev
```
Server should run on: http://localhost:5000

**Frontend:**
```bash
npm run dev
```
Frontend should run on: http://localhost:3000

---

### 2. Login with Admin Account

Open your browser and go to: **http://localhost:3000**

Click "Login" and use these credentials:

```
Email: admin@afiyazone.com
Password: Admin@123
```

---

### 3. Access Admin Dashboard

After successful login, you will see:

**Option 1:** Purple **"Admin"** link in the main navigation bar (top of page)
- Desktop: Between navigation links
- Mobile: In the hamburger menu

**Option 2:** Purple **"Admin"** button next to your account name (top right)

Click either one to access the admin dashboard!

---

## What You'll See:

### Admin Dashboard has 4 tabs:

1. **Overview** 📊
   - Total Users
   - Total Products  
   - Total Orders
   - Total Revenue
   - Orders by Status

2. **Users** 👥
   - View all registered users
   - Delete users
   - See user roles

3. **Products** 📦
   - View all products
   - Add new products
   - Edit products
   - Delete products

4. **Orders** 🛒
   - View all customer orders
   - Update order status
   - Download invoices (TXT format)
   - Delete orders

---

## Troubleshooting:

### ❌ "Can't find admin page"
**Solution:** Make sure you're logged in with the admin account (admin@afiyazone.com)

### ❌ "Admin button not showing"
**Solution:** 
1. Logout and login again with admin credentials
2. Check browser console for errors
3. Make sure backend server is running

### ❌ "Access denied" error
**Solution:** The account you're using doesn't have admin role. Use admin@afiyazone.com

### ❌ "Can't see any data"
**Solution:** Make sure MongoDB is connected (check server console)

---

## Quick Test:

1. Open http://localhost:3000
2. Login with admin@afiyazone.com / Admin@123
3. Look for purple "Admin" text in navigation
4. Click it
5. You should see the admin dashboard!

---

## Admin Features:

✅ Full CRUD on Users  
✅ Full CRUD on Products  
✅ Full CRUD on Orders  
✅ Download Invoices  
✅ Update Order Status  
✅ View Statistics  
✅ Bilingual (English/Arabic)  
✅ Real-time MongoDB integration

---

**Note:** The admin role is stored in the database. Regular users created through signup will NOT have admin access.
