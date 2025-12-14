import { useState, useEffect, useRef } from 'react';
import { useApp } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { User, Package, Heart, Edit3, Save, X, Eye, Bell, ShoppingBag, Tag, Mail, Star } from 'lucide-react';
import { toast } from 'sonner';
import { authAPI, ordersAPI, notificationsAPI } from '../services/api';
import { productsAPI } from '../services/api';

const translations = {
  en: {
    myAccount: 'My Account',
    profile: 'Profile',
    orders: 'Orders',
    wishlist: 'Wishlist',
    settings: 'Settings',
    personalInfo: 'Personal Information',
    contactInfo: 'Contact Information',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    phone: 'Phone',
    dateJoined: 'Member Since',
    edit: 'Edit',
    save: 'Save',
    cancel: 'Cancel',
    orderHistory: 'Order History',
    orderNumber: 'Order #',
    orderDate: 'Date',
    status: 'Status',
    total: 'Total',
    items: 'Items',
    viewOrder: 'View Details',
    noOrders: 'No orders yet',
    noOrdersDesc: 'Start shopping to see your orders here',
    myWishlist: 'My Wishlist',
    noWishlist: 'No items in wishlist',
    noWishlistDesc: 'Add products to your wishlist to see them here',
    addToCart: 'Add to Cart',
    removeFromWishlist: 'Remove',
    accountSettings: 'Account Settings',
    changePassword: 'Change Password',
    notifications: 'Notifications',
    privacy: 'Privacy & Security',
    language: 'Language',

    logout: 'Logout',
    profileUpdated: 'Profile updated successfully',
    orderDelivered: 'Delivered',
    orderShipped: 'Shipped',
    orderProcessing: 'Processing',
    orderCancelled: 'Cancelled',
    shopNow: 'Shop Now',
  },
  ar: {
    myAccount: 'حسابي',
    profile: 'الملف الشخصي',
    orders: 'الطلبات',
    wishlist: 'المفضلة',
    settings: 'الإعدادات',
    personalInfo: 'المعلومات الشخصية',
    contactInfo: 'معلومات التواصل',
    firstName: 'الاسم الأول',
    lastName: 'اسم العائلة',
    email: 'البريد الإلكتروني',
    phone: 'الهاتف',
    dateJoined: 'عضو منذ',
    edit: 'تعديل',
    save: 'حفظ',
    cancel: 'إلغاء',
    orderHistory: 'تاريخ الطلبات',
    orderNumber: 'رقم الطلب',
    orderDate: 'التاريخ',
    status: 'الحالة',
    total: 'المجموع',
    items: 'العناصر',
    viewOrder: 'عرض التفاصيل',
    noOrders: 'لا توجد طلبات بعد',
    noOrdersDesc: 'ابدأ التسوق لرؤية طلباتك هنا',
    myWishlist: 'مفضلتي',
    noWishlist: 'لا توجد عناصر في المفضلة',
    noWishlistDesc: 'أضف المنتجات إلى مفضلتك لرؤيتها هنا',
    addToCart: 'أضف للسلة',
    removeFromWishlist: 'إزالة',
    accountSettings: 'إعدادات الحساب',
    changePassword: 'تغيير كلمة المرور',
    privacy: 'الخصوصية والأمان',
    language: 'اللغة',
    currency: 'العملة',
    logout: 'تسجيل الخروج',
    profileUpdated: 'تم تحديث الملف الشخصي بنجاح',
    orderDelivered: 'تم التوصيل',
    orderShipped: 'تم الشحن',
    orderProcessing: 'قيد المعالجة',
    orderCancelled: 'ملغي',
    shopNow: 'تسوق الآن',
  },
};

// Sample order data

// Sample wishlist data
const sampleWishlist = [
  {
    id: 5,
    name: { en: 'Natural Body Lotion', ar: 'لوشن الجسم الطبيعي' },
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1723392197044-515b81ec57cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwc2tpbmNhcmUlMjBjb3NtZXRpY3N8ZW58MXx8fHwxNzU5MDc1NjI0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.5,
  },
  {
    id: 6,
    name: { en: 'Detox Green Tea', ar: 'شاي أخضر ديتوكس' },
    price: 16.99,
    image: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZXJiYWwlMjB0ZWElMjBlc3NlbnRpYWwlMjBvaWxzfGVufDF8fHx8MTc1OTA3NTYyN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.4,
  },
];

export function UserAccount() {
  const { language, user, setUser, setCurrentPage, cart, setCart, navigateToOrderId, setNavigateToOrderId } = useApp();
  const t = translations[language];

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [wishlist, setWishlist] = useState(sampleWishlist);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const orderRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Privacy settings state
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    dataSharing: false,
    marketingEmails: true,
    twoFactorAuth: false
  });

  // Settings state
  const [settings, setSettings] = useState({
    language: language,
    currency: 'UAE',
    notifications: {
      orderUpdates: true,
      promotions: true,
      newsletter: false
    }
  });

  // Notifications state
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch user's orders and notification settings when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch orders
        setOrdersLoading(true);
        const data = await ordersAPI.getMyOrders();
        setOrders(data);

        // Fetch notification settings
        await loadNotificationSettings();

        // Load notifications from database
        await loadNotifications();
      } catch (error: any) {
        console.error('Failed to fetch data:', error);
        toast.error('Failed to load data');
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  // Navigate to specific order when navigateToOrderId is set
  useEffect(() => {
    if (navigateToOrderId && orders.length > 0) {
      // Switch to orders tab
      setActiveTab('orders');

      // Wait for tab to switch and then scroll to order
      setTimeout(() => {
        const orderElement = orderRefs.current[navigateToOrderId];
        if (orderElement) {
          orderElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Highlight the order briefly
          orderElement.style.transition = 'box-shadow 0.3s ease';
          orderElement.style.boxShadow = '0 0 0 3px rgba(34, 197, 94, 0.5)';
          setTimeout(() => {
            orderElement.style.boxShadow = '';
            setNavigateToOrderId(null);
          }, 2000);
        } else {
          // Order not found, clear the navigation
          setNavigateToOrderId(null);
        }
      }, 100);
    }
  }, [navigateToOrderId, orders, setNavigateToOrderId]);

  // Reload notifications periodically
  useEffect(() => {
    const interval = setInterval(() => {
      loadNotifications();
    }, 30000); // Reload every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Settings handlers
  const handleLanguageChange = () => {
    const newLanguage = settings.language === 'en' ? 'ar' : 'en';
    setSettings(prev => ({ ...prev, language: newLanguage }));
    toast.success(`Language changed to ${newLanguage === 'en' ? 'English' : 'العربية'}`);
  };


  const handleNotificationChange = async (type: 'orderUpdates' | 'promotions' | 'newsletter') => {
    const newSettings = {
      ...settings.notifications,
      [type]: !settings.notifications[type]
    };

    // Update local state immediately for responsive UI
    setSettings(prev => ({
      ...prev,
      notifications: newSettings
    }));

    try {
      await authAPI.updateNotifications(newSettings);
      const status = newSettings[type];
      toast.success(`${type} notifications ${status ? 'enabled' : 'disabled'}`);
    } catch (error: any) {
      // Revert on error
      setSettings(prev => ({
        ...prev,
        notifications: settings.notifications
      }));
      toast.error(error.message || 'Failed to update notifications');
    }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (!passwordForm.currentPassword) {
      toast.error('Please enter your current password');
      return;
    }

    try {
      setIsLoading(true);
      await authAPI.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });

      toast.success('Password changed successfully');
      setShowPasswordForm(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrivacyChange = (setting: string, value: any) => {
    setPrivacySettings(prev => ({ ...prev, [setting]: value }));
    toast.success(`${setting} updated`);
  };

  // Load notification settings from database
  const loadNotificationSettings = async () => {
    try {
      const userProfile = await authAPI.getProfile();
      if (userProfile.notifications) {
        setSettings(prev => ({
          ...prev,
          notifications: userProfile.notifications
        }));
      }
    } catch (error) {
      console.error('Failed to load notification settings:', error);
    }
  };

  // Load notifications from database
  const loadNotifications = async () => {
    try {
      console.log('Loading notifications from database...');

      // Get notifications from database
      const notificationsData = await notificationsAPI.getAll();
      console.log('Database notifications:', notificationsData);

      // Get unread count
      const unreadData = await notificationsAPI.getUnreadCount();
      console.log('Unread count:', unreadData.count);

      setNotifications(notificationsData);
      setUnreadCount(unreadData.count);
    } catch (error) {
      console.error('Failed to load notifications:', error);
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  const handleViewOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleCloseOrderDetails = () => {
    setShowOrderDetails(false);
    setSelectedOrder(null);
  };

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      await notificationsAPI.markAsRead(notificationId);

      // Update local state
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      const updatedUser = await authAPI.updateProfile({
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        phone: editForm.phone,
      });

      setUser(updatedUser);
      setIsEditing(false);
      toast.success(t.profileUpdated);
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditForm({
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ')[1] || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
    setIsEditing(false);
  };

  const addToCart = (product: any) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    toast.success('Added to cart!');
  };

  const removeFromWishlist = (productId: number) => {
    setWishlist(wishlist.filter(item => item.id !== productId));
    toast.success('Removed from wishlist');
  };

  const handleRatingClick = async (productId: number, ratingValue: number) => {
    try {
      // Send the rating to the backend
      const response = await productsAPI.rateProduct(productId.toString(), ratingValue);

      toast.success(response.message || 'Thank you for your rating!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit rating. Please try again.');
    }
  };

  const handleLogout = () => {
    setUser(null);
    // Clear stored auth data
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    } catch (e) {
      // ignore
    }
    // Inform API helper to clear any auth state
    try { authAPI.logout(); } catch (e) { }
    setCurrentPage('home');
    toast.success('Logged out successfully');
  };

  type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<OrderStatus, { color: string; label: string }> = {
      pending: { color: 'bg-gray-100 text-gray-800', label: language === 'ar' ? 'قيد الانتظار' : 'Pending' },
      delivered: { color: 'bg-green-100 text-green-800', label: t.orderDelivered },
      shipped: { color: 'bg-blue-100 text-blue-800', label: t.orderShipped },
      processing: { color: 'bg-yellow-100 text-yellow-800', label: t.orderProcessing },
      cancelled: { color: 'bg-red-100 text-red-800', label: t.orderCancelled },
    };

    const config = statusConfig[status as OrderStatus] || statusConfig.pending;
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please login to view your account</p>
          <Button onClick={() => setCurrentPage('home')}>Go to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with notification icon */}

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-green-50 mb-8">
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              <User className="w-4 h-4 mr-2" />
              {t.profile}
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              <Package className="w-4 h-4 mr-2" />
              {t.orders}
            </TabsTrigger>
            <TabsTrigger
              value="wishlist"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              <Heart className="w-4 h-4 mr-2" />
              {t.wishlist}
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>

                  <CardTitle className="text-green-800 flex items-center justify-between">
                    {t.personalInfo}
                    {!isEditing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Edit3 className="w-4 h-4 mr-1" />
                        {t.edit}
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName" className="mb-2">{t.firstName}</Label>
                          <Input
                            id="firstName"
                            value={editForm.firstName}
                            onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                            className="text-gray-600 bg-white rounded-md px-2 py-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName" className="mb-2">{t.lastName}</Label>
                          <Input
                            id="lastName"
                            value={editForm.lastName}
                            onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                            className="text-gray-600 bg-white rounded-md px-2 py-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email" className="mb-2">{t.email}</Label>
                        <Input
                          id="email"
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="text-gray-600 bg-white rounded-md px-2 py-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone" className="mb-2">{t.phone}</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          className="text-gray-600 bg-white rounded-md px-2 py-1"
                        />
                      </div>

                      <div className="flex space-x-3 pt-4">
                        <Button
                          onClick={handleSaveProfile}
                          className="bg-green-600 hover:bg-green-700 text-white"
                          disabled={isLoading}
                        >
                          <Save className="w-4 h-4 mr-1" />
                          {isLoading ? 'Saving...' : t.save}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleCancelEdit}
                          disabled={isLoading}
                        >
                          <X className="w-4 h-4 mr-1" />
                          {t.cancel}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-gray-600 mb-2">{t.firstName}</Label>
                          <p className="text-gray-600 bg-white rounded-md px-2 py-1">{user.name?.split(' ')[0]}</p>
                        </div>
                        <div>
                          <Label className="text-gray-600 mb-2">{t.lastName}</Label>
                          <p className="text-gray-600 bg-white rounded-md px-2 py-1">{user.name?.split(' ')[1]}</p>
                        </div>
                        <div>
                          <Label className="text-gray-600 mb-2">{t.email}</Label>
                          <p className="text-gray-600 bg-white rounded-md px-2 py-1">{user.email}</p>
                        </div>
                        <div>
                          <Label className="text-gray-600 mb-2">{t.phone}</Label>
                          <p className="text-gray-600 bg-white rounded-md px-2 py-1">{user.phone}</p>
                        </div>
                        <div>
                          <Label className="text-gray-600 mb-2">{t.dateJoined}</Label>
                          <p className="text-gray-600 bg-white rounded-md px-2 py-1">{user.joinDate}</p>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-green-800">{t.accountSettings}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="account-settings-btns">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setShowPasswordForm(true)}
                    >
                      {t.changePassword}
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setShowPrivacySettings(true)}
                    >
                      {t.privacy}
                    </Button>
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={handleLogout}
                    >
                      {t.logout}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-800">{t.orderHistory}</CardTitle>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg text-gray-600 mb-2">{t.noOrders}</h3>
                    <p className="text-gray-500 mb-4">{t.noOrdersDesc}</p>
                    <Button
                      onClick={() => setCurrentPage('shop')}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {t.shopNow}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card
                        key={order._id || order.id}
                        ref={(el) => {
                          if (el) {
                            orderRefs.current[order._id || order.id] = el;
                          }
                        }}
                        className="border-green-100 order-history order-border"
                      >
                        <CardContent className="p-2">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h5 className="text-green-800">{t.orderNumber} {order.orderNumber || order.id}</h5>
                              <p className="text-gray-600 text-sm">
                                {new Date(order.createdAt || order.date).toLocaleDateString('en-US')}
                              </p>
                            </div>
                            <div className="text-right">
                              {getStatusBadge(order.status)}
                              <p className="text-green-700 mt-1">AED {order.total.toFixed(2)}</p>
                            </div>
                          </div>

                          <div className="space-y-2 mb-4">
                            {order.items.map((item: any, index: number) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>
                                  {item.name?.[language] || item.name?.en || 'Product'} × {item.quantity}
                                </span>
                                <span>AED {(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            className="border-green-600 text-green-600"
                            onClick={() => handleViewOrderDetails(order)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            {t.viewOrder}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-800">{t.myWishlist}</CardTitle>
              </CardHeader>
              <CardContent>
                {wishlist.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg text-gray-600 mb-2">{t.noWishlist}</h3>
                    <p className="text-gray-500 mb-4">{t.noWishlistDesc}</p>
                    <Button
                      onClick={() => setCurrentPage('shop')}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {t.shopNow}
                    </Button>
                  </div>
                ) : (
                  <div className="product-grid-container">
                    {wishlist.map((item) => (
                      <div key={item.id} className="product-grid-item list-view flex flex-row">
                        <div className="product-image-container flex-shrink-0">
                          <ImageWithFallback
                            src={item.image}
                            alt={item.name[language]}
                            className="product-image w-48 h-48 rounded-l-lg"
                          />
                        </div>
                        <div className="product-info flex flex-col justify-between flex-1">
                          <div className="p-2">
                            <h3 className="product-title">{item.name[language]}</h3>

                            {/* Rating */}
                            <div className="product-rating">
                              <div className="rating-stars">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`rating-star ${i < Math.floor(item.rating || 0)
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                      }`}
                                    onClick={() => handleRatingClick(item.id, i + 1)}
                                  />
                                ))}
                              </div>
                            </div>

                            <p className="product-price">AED {item.price}</p>
                          </div>
                          <div className="p-2 pt-0">
                            <div className="product-actions space-y-2">
                              <button
                                className="add-to-cart-btn w-full"
                                onClick={() => addToCart(item)}
                              >
                                {t.addToCart}
                              </button>
                              <button
                                className="w-full bg-red-100 hover:bg-red-200 text-red-600 py-2 px-4 rounded-md text-sm transition-colors"
                                onClick={() => removeFromWishlist(item.id)}
                              >
                                {t.removeFromWishlist}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>

      {/* Order Details Modal - Tailwind Design */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={handleCloseOrderDetails}
          ></div>

          {/* Modal */}
          <div className="flex items-center justify-center min-h-screen">
            <div
              className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto order-details-modal"
              onClick={(e) => e.stopPropagation()}
            >

              {/* Header */}
              <div className="order-details">
                {/* Order Information */}
                <div className="order-details-close">
                  <button
                    onClick={handleCloseOrderDetails}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Order Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Order Number:</p>
                      <p className="font-medium">#{selectedOrder.orderNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date:</p>
                      <p className="font-medium">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status:</p>
                      <div className="mt-1">
                        {getStatusBadge(selectedOrder.status)}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total:</p>
                      <p className="font-medium text-green-600">AED {selectedOrder.total?.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                {selectedOrder.shippingAddress && (
                  <div className="mb-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Shipping Address</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium">
                        {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}
                      </p>
                      <p className="text-gray-600">{selectedOrder.shippingAddress.address}</p>
                      <p className="text-gray-600">
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}
                      </p>
                      <p className="text-gray-600">{selectedOrder.shippingAddress.country}</p>
                      <p className="text-gray-600">Phone: {selectedOrder.shippingAddress.phone}</p>
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div className="mb-6">
                  <h6 className="text-md font-semibold text-gray-900 mb-4">Order Items</h6>
                  <div className="border border-gray-200 rounded-lg overflow-hidden table-view">
                    <table className="order-info-t">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="py-3 text-left text-gray-900">Product</th>
                          <th className="py-3 text-center text-gray-900">Quantity</th>
                          <th className="py-3 text-center text-gray-900">Price</th>
                          <th className="py-3 text-center text-gray-900">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items?.map((item: any, index: number) => (
                          <tr key={index}>
                            <td className="py-4">
                              <div className="flex items-center">
                                {item.image && (
                                  <img
                                    src={item.image}
                                    alt={item.name?.[language] || item.name?.en || 'Product'}
                                    className="w-12 h-12 object-cover rounded border border-gray-200 mr-1"
                                  />
                                )}
                                <div>
                                  <p className="font-11">
                                    {item.name?.[language] || item.name?.en || 'Product'}
                                  </p>
                                  {item.category && (
                                    <p className="font-11">{item.category}</p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 text-center">{item.quantity}</td>
                            <td className="py-4 text-right">AED {item.price?.toFixed(2)}</td>
                            <td className="py-4 text-right">
                              AED {(item.price * item.quantity).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <th colSpan={3} className="px-4 py-3 text-left text-sm font-medium text-green-600">
                            Total:
                          </th>
                          <th className="px-4 py-3 text-right text-sm text-green-600">
                            AED {selectedOrder.total?.toFixed(2)}
                          </th>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Order Timeline */}
                <div>

                  <h6 className="text-md font-semibold text-gray-900 mb-4">Order Timeline</h6>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Order Placed</p>
                        <p className="text-sm text-gray-600">
                          {new Date(selectedOrder.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Completed
                      </span>
                    </div>
                    {selectedOrder.status !== 'pending' && (
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Processing</p>
                          <p className="text-sm text-gray-600">Your order is being prepared</p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          In Progress
                        </span>
                      </div>
                    )}
                    {selectedOrder.status === 'delivered' && (
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Delivered</p>
                          <p className="text-sm text-gray-600">Order has been delivered</p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Completed
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-gray-200 px-6 py-4  flex justify-right items-center">
                    <button
                      onClick={handleCloseOrderDetails}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <div>.</div>                    </button>
                  </div>
                </div>

              </div>

              {/* Footer */}

            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setShowPasswordForm(false)}
          ></div>

          {/* Modal */}
          <div className="flex items-center justify-center min-h-screen p-4">
            <div
              className="relative bg-white rounded-lg shadow-xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
                  <button
                    onClick={() => setShowPasswordForm(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                <button
                  onClick={() => setShowPasswordForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordChange}
                  disabled={isLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Changing...' : 'Change'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Settings Modal */}
      {showPrivacySettings && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setShowPrivacySettings(false)}
          ></div>

          {/* Modal */}
          <div className="flex items-center justify-center min-h-screen p-4">
            <div
              className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">{t.privacy}</h3>
                  <button
                    onClick={() => setShowPrivacySettings(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Profile Visibility</p>
                    <p className="text-sm text-gray-600">Control who can see your profile</p>
                  </div>
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={privacySettings.profileVisibility}
                    onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="friends">Friends Only</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Data Sharing</p>
                    <p className="text-sm text-gray-600">Share anonymous usage data to improve our services</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={privacySettings.dataSharing}
                      onChange={(e) => handlePrivacyChange('dataSharing', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Marketing Emails</p>
                    <p className="text-sm text-gray-600">Receive promotional offers and updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={privacySettings.marketingEmails}
                      onChange={(e) => handlePrivacyChange('marketingEmails', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={privacySettings.twoFactorAuth}
                      onChange={(e) => handlePrivacyChange('twoFactorAuth', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                <button
                  onClick={() => setShowPrivacySettings(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowPrivacySettings(false)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
