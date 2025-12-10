import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import {
  LayoutDashboard, Users, Package, ShoppingCart,
  Trash2, Download, DollarSign, TrendingUp,
  CheckCircle, AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { adminAPI } from '../services/api';

const translations = {
  en: {
    adminDashboard: 'Admin Dashboard',
    overview: 'Overview',
    users: 'Users',
    admins: 'Admins',
    products: 'Products',
    orders: 'Orders',
    totalUsers: 'Total Users',
    totalProducts: 'Total Products',
    totalOrders: 'Total Orders',
    totalRevenue: 'Total Revenue',
    ordersByStatus: 'Orders by Status',
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    // User Management
    userManagement: 'User Management',
    adminManagement: 'Admin Management',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    phone: 'Phone',
    role: 'Role',
    actions: 'Actions',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    admin: 'Admin',
    user: 'User',
    // Product Management
    productManagement: 'Product Management',
    addProduct: 'Add Product',
    productName: 'Product Name (EN)',
    productNameAr: 'Product Name (AR)',
    category: 'Category',
    price: 'Price',
    stock: 'Stock',
    description: 'Description',
    // Order Management
    orderManagement: 'Order Management',
    orderNumber: 'Order #',
    customer: 'Customer',
    date: 'Date',
    status: 'Status',
    total: 'Total',
    handledBy: 'Handled By',  // Added translation for "Handled By"
    updateStatus: 'Update Status',
    invoice: 'Invoice',
    downloadInvoice: 'Download Invoice',
    // Messages
    confirmDelete: 'Are you sure you want to delete this item?',
    userDeleted: 'User deleted successfully',
    productDeleted: 'Product deleted successfully',
    orderDeleted: 'Order deleted successfully',
    updateSuccess: 'Updated successfully',
    createSuccess: 'Created successfully',
    accessDenied: 'Access denied. Admin only.',
  },
  ar: {
    adminDashboard: 'لوحة تحكم المدير',
    overview: 'نظرة عامة',
    users: 'المستخدمين',
    admins: 'المشرفين',
    products: 'المنتجات',
    orders: 'الطلبات',
    totalUsers: 'إجمالي المستخدمين',
    totalProducts: 'إجمالي المنتجات',
    totalOrders: 'إجمالي الطلبات',
    totalRevenue: 'إجمالي الإيرادات',
    ordersByStatus: 'الطلبات حسب الحالة',
    pending: 'قيد الانتظار',
    processing: 'قيد المعالجة',
    shipped: 'تم الشحن',
    delivered: 'تم التوصيل',
    cancelled: 'ملغي',
    // User Management
    userManagement: 'إدارة المستخدمين',
    adminManagement: 'إدارة المشرفين',
    firstName: 'الاسم الأول',
    lastName: 'اسم العائلة',
    email: 'البريد الإلكتروني',
    phone: 'الهاتف',
    role: 'الدور',
    actions: 'الإجراءات',
    edit: 'تعديل',
    delete: 'حذف',
    save: 'حفظ',
    cancel: 'إلغاء',
    admin: 'مدير',
    user: 'مستخدم',
    // Product Management
    productManagement: 'إدارة المنتجات',
    addProduct: 'إضافة منتج',
    productName: 'اسم المنتج (إنجليزي)',
    productNameAr: 'اسم المنتج (عربي)',
    category: 'الفئة',
    price: 'السعر',
    stock: 'المخزون',
    description: 'الوصف',
    // Order Management
    orderManagement: 'إدارة الطلبات',
    orderNumber: 'رقم الطلب',
    customer: 'العميل',
    date: 'التاريخ',
    status: 'الحالة',
    total: 'المجموع',
    handledBy: ' dealt with by ',  // Added translation for "Handled By"
    updateStatus: 'تحديث الحالة',
    invoice: 'الفاتورة',
    downloadInvoice: 'تحميل الفاتورة',
    // Messages
    confirmDelete: 'هل أنت متأكد من حذف هذا العنصر؟',
    userDeleted: 'تم حذف المستخدم بنجاح',
    productDeleted: 'تم حذف المنتج بنجاح',
    orderDeleted: 'تم حذف الطلب بنجاح',
    updateSuccess: 'تم التحديث بنجاح',
    createSuccess: 'تم الإنشاء بنجاح',
    accessDenied: 'تم رفض الوصول. للمدراء فقط.',
  },
};

export function AdminDashboard() {
  const { language, user, setCurrentPage } = useApp();
  const t = translations[language];

  const [statistics, setStatistics] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]); // New state for filtered orders
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [orderSearchTerm, setOrderSearchTerm] = useState<string>(''); // New state for order search

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      toast.error(t.accessDenied);
      setCurrentPage('home');
      return;
    }
    loadDashboardData();
  }, [user]);

  // New useEffect for filtering orders
  useEffect(() => {
    if (orderSearchTerm) {
      const filtered = orders.filter(order =>
        order.orderNumber.toLowerCase().includes(orderSearchTerm.toLowerCase())
      );
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders);
    }
  }, [orders, orderSearchTerm]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [stats, usersData, productsData, ordersData] = await Promise.all([
        adminAPI.getStatistics(),
        adminAPI.getAllUsers(),
        adminAPI.getAllProducts(),
        adminAPI.getAllOrders(),
      ]);

      setStatistics(stats);
      setUsers(usersData.users);
      setProducts(productsData.products);
      setOrders(ordersData.orders);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Function to generate invoice (placeholder)
  const generateInvoice = (order: any) => {
    // In a real implementation, this would generate and download an invoice
    toast.info('Invoice generation feature coming soon');
    console.log('Generating invoice for order:', order);
  };

  // User Management Functions
  const handleDeleteUser = async (userId: string) => {
    if (!confirm(t.confirmDelete)) return;

    try {
      await adminAPI.deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
      toast.success(t.userDeleted);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleUpdateUser = async (userId: string, userData: any) => {
    try {
      const updated = await adminAPI.updateUser(userId, userData);
      setUsers(users.map(u => u.id === userId ? updated : u));
      setEditingUser(null);
      toast.success(t.updateSuccess);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Product Management Functions
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm(t.confirmDelete)) return;

    try {
      await adminAPI.deleteProduct(productId);
      setProducts(products.filter(p => p.id !== productId));
      toast.success(t.productDeleted);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleUpdateProduct = async (productId: string, productData: any) => {
    try {
      const updated = await adminAPI.updateProduct(productId, productData);
      setProducts(products.map(p => p.id === productId ? updated : p));
      setEditingProduct(null);
      toast.success(t.updateSuccess);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleCreateProduct = async (productData: any) => {
    try {
      const newProduct = await adminAPI.createProduct(productData);
      setProducts([...products, newProduct]);
      toast.success(t.createSuccess);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Order Management Functions
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const updated = await adminAPI.updateOrderStatus(orderId, status);
      setOrders(orders.map(o => o.id === orderId ? updated : o));
      toast.success(t.updateSuccess);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm(t.confirmDelete)) return;

    try {
      await adminAPI.deleteOrder(orderId);
      setOrders(orders.filter(o => o.id !== orderId));
      toast.success(t.orderDeleted);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Added CSS styles for admin info display */}
      <style>{`
        .order-admin-info {
          margin-top: 5px;
          padding: 8px 12px;
          background-color: #f8f9fa;
          border-radius: 4px;
          border-left: 3px solid #0d6efd;
        }
        
        .order-admin-info .created-by {
          color: #0d6efd;
          font-weight: 500;
          font-size: 0.85em;
        }
        
        .order-admin-info .updated-by {
          color: #28a745;
          font-weight: 500;
          font-size: 0.85em;
        }
      `}</style>

      {/* Top Bar */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">{t.adminDashboard}</h1>

            <button
              onClick={() => setCurrentPage('home')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              {language === 'ar' ? 'العودة إلى المتجر' : 'Back to Store'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="overview" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              {t.overview}
            </TabsTrigger>
            <TabsTrigger value="admins" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              {t.admins}
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              {t.users}
            </TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <Package className="w-4 h-4 mr-2" />
              {t.products}
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <ShoppingCart className="w-4 h-4 mr-2" />
              {t.orders}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-800">
                    {t.totalUsers}
                  </CardTitle>
                  <Users className="w-4 h-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-900">{statistics?.totalUsers || 0}</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-green-800">
                    {t.totalProducts}
                  </CardTitle>
                  <Package className="w-4 h-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-900">{statistics?.totalProducts || 0}</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-800">
                    {t.totalOrders}
                  </CardTitle>
                  <ShoppingCart className="w-4 h-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-900">{statistics?.totalOrders || 0}</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-yellow-800">
                    {t.totalRevenue}
                  </CardTitle>
                  <DollarSign className="w-4 h-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-900">
                    AED {(statistics?.totalRevenue || 0).toFixed(2)}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-green-800">{t.ordersByStatus}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <AlertCircle className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">{t.pending}</p>
                    <p className="text-xl font-bold text-gray-800">
                      {statistics?.ordersByStatus?.pending || 0}
                    </p>
                  </div>

                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-sm text-blue-600">{t.processing}</p>
                    <p className="text-xl font-bold text-blue-800">
                      {statistics?.ordersByStatus?.processing || 0}
                    </p>
                  </div>

                  <div className="text-center p-4 bg-indigo-50 rounded-lg">
                    <Package className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                    <p className="text-sm text-indigo-600">{t.shipped}</p>
                    <p className="text-xl font-bold text-indigo-800">
                      {statistics?.ordersByStatus?.shipped || 0}
                    </p>
                  </div>

                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-green-600">{t.delivered}</p>
                    <p className="text-xl font-bold text-green-800">
                      {statistics?.ordersByStatus?.delivered || 0}
                    </p>
                  </div>

                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <p className="text-sm text-red-600">{t.cancelled}</p>
                    <p className="text-xl font-bold text-red-800">
                      {statistics?.ordersByStatus?.cancelled || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admins Tab */}
          <TabsContent value="admins">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-800">{t.adminManagement}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">{t.firstName}</th>
                        <th className="text-left p-3">{t.lastName}</th>
                        <th className="text-left p-3">{t.email}</th>
                        <th className="text-left p-3">{t.phone}</th>
                        <th className="text-left p-3">{t.role}</th>
                        <th className="text-left p-3">{t.actions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users
                        .filter(user => user.role === 'admin')
                        .sort((a, b) => a.firstName.localeCompare(b.firstName))
                        .map((user) => (
                          <tr
                            key={user.id}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="p-3 font-medium">
                              {user.firstName}
                            </td>
                            <td className="p-3 font-medium">
                              {user.lastName}
                            </td>
                            <td className="p-3">
                              {user.email}
                            </td>
                            <td className="p-3">
                              {user.phone}
                            </td>
                            <td className="p-3">
                              <Badge className="bg-purple-100 text-purple-800">
                                {t.admin}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <Button
                                variant="outline"
                                size="sm"
                                className="mr-2"
                                onClick={() => setEditingUser(user.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-800">{t.userManagement}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">{t.firstName}</th>
                        <th className="text-left p-3">{t.lastName}</th>
                        <th className="text-left p-3">{t.email}</th>
                        <th className="text-left p-3">{t.phone}</th>
                        <th className="text-left p-3">{t.role}</th>
                        <th className="text-left p-3">{t.actions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users
                        .filter(user => user.role === 'user')
                        .sort((a, b) => a.firstName.localeCompare(b.firstName))
                        .map((user) => (
                          <tr
                            key={user.id}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="p-3 font-medium">
                              {user.firstName}
                            </td>
                            <td className="p-3 font-medium">
                              {user.lastName}
                            </td>
                            <td className="p-3">
                              {user.email}
                            </td>
                            <td className="p-3">
                              {user.phone}
                            </td>
                            <td className="p-3">
                              <Badge className="bg-green-100 text-green-800">
                                {t.user}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <Button
                                variant="outline"
                                size="sm"
                                className="mr-2"
                                onClick={() => setEditingUser(user.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-800">{t.productManagement}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">{language === 'ar' ? t.productNameAr : t.productName}</th>
                        <th className="text-left p-3">{t.category}</th>
                        <th className="text-left p-3">{t.price}</th>
                        <th className="text-left p-3">{t.stock}</th>
                        <th className="text-left p-3">{t.actions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((product) => (
                          <tr
                            key={product.id}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="p-3 font-medium">
                              {language === 'ar' && product.name_ar ? product.name_ar : product.name}
                            </td>
                            <td className="p-3">
                              {product.category}
                            </td>
                            <td className="p-3">
                              AED {product.price}
                            </td>
                            <td className="p-3">
                              {product.stock}
                            </td>
                            <td className="p-3">
                              <Button
                                variant="outline"
                                size="sm"
                                className="mr-2"
                                onClick={() => setEditingProduct(product.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-800">{t.orderManagement}</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Search input for orders */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search by order number..."
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={orderSearchTerm}
                    onChange={(e) => setOrderSearchTerm(e.target.value)}
                  />
                  {orderSearchTerm && (
                    <p className="text-sm text-gray-500 mt-1">
                      Showing results for "{orderSearchTerm}"
                    </p>
                  )}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">{t.orderNumber}</th>
                        <th className="text-left p-3">{t.customer}</th>
                        <th className="text-left p-3">{t.date}</th>
                        <th className="text-left p-3">{t.status}</th>
                        <th className="text-left p-3">{t.total}</th>
                        <th className="text-left p-3">Handled By</th>
                        <th className="text-left p-3">{t.actions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders // Use filteredOrders instead of orders
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .map((order) => (
                          <tr
                            key={order.id}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="p-3 font-medium">
                              #{order.orderNumber}
                            </td>
                            <td className="p-3">
                              {order.user?.firstName} {order.user?.lastName}
                            </td>
                            <td className="p-3">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-3">
                              <Badge className={
                                order.status === 'pending' ? 'bg-gray-100 text-gray-800' :
                                  order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                    order.status === 'shipped' ? 'bg-indigo-100 text-indigo-800' :
                                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                        'bg-red-100 text-red-800'
                              }>
                                {order.status}
                              </Badge>
                            </td>
                            <td className="p-3">
                              AED {order.total.toFixed(2)}
                            </td>
                            <td className="p-3">
                              <div className="order-admin-info">
                                {/* Display the admin who created the order */}
                                {order.createdBy && (
                                  <div className="created-by">
                                    Created by: {order.createdBy.firstName} {order.createdBy.lastName}
                                  </div>
                                )}
                                {/* Display the admin who last updated the order */}
                                {order.updatedBy && (
                                  <div className="updated-by">
                                    Updated by: {order.updatedBy.firstName} {order.updatedBy.lastName}
                                  </div>
                                )}
                                {!order.createdBy && !order.updatedBy && (
                                  <div className="text-xs text-gray-400">
                                    No admin info available
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="p-3">
                              <Button
                                variant="outline"
                                size="sm"
                                className="mr-2"
                                onClick={() => generateInvoice(order)}
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mr-2"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
























