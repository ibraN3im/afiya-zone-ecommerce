import { useState, useEffect } from 'react';
import { Bell, Package } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { ScrollArea } from './ui/scroll-area';
import { notificationsAPI } from '../services/api';
import { useApp } from '../App';
import { toast } from 'sonner';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  orderId?: string;
  orderNumber?: string;
  status?: string;
  isRead: boolean;
  createdAt: string;
}

const translations = {
  en: {
    notifications: 'Notifications',
    noNotifications: 'No notifications',
    markAllRead: 'Mark all as read',
    orderCreated: 'Order Created',
    orderStatusUpdated: 'Order Status Updated',
    newOrder: 'New Order',
    viewOrder: 'View Order',
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  },
  ar: {
    notifications: 'الإشعارات',
    noNotifications: 'لا توجد إشعارات',
    markAllRead: 'تحديد الكل كمقروء',
    orderCreated: 'تم إنشاء الطلب',
    orderStatusUpdated: 'تم تحديث حالة الطلب',
    newOrder: 'طلب جديد',
    viewOrder: 'عرض الطلب',
    pending: 'قيد الانتظار',
    processing: 'قيد المعالجة',
    shipped: 'تم الشحن',
    delivered: 'تم التوصيل',
    cancelled: 'ملغي',
  },
};

export function NotificationBell() {
  const { user, language, setCurrentPage, setNavigateToOrderId } = useApp();
  const t = translations[language];
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'orders'>('all');

  useEffect(() => {
    if (user) {
      loadNotifications();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(() => {
        loadNotifications();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [user]);

  // Play sound when new notifications arrive
  useEffect(() => {
    if (unreadCount > 0 && notifications.length > 0) {
      const latestNotification = notifications[0];
      if (!latestNotification.isRead) {
        // Play notification sound
        try {
          const audio = new Audio('/notification-sound.mp3');
          audio.play().catch(e => console.log('Sound play failed:', e));
        } catch (e) {
          console.log('Sound play failed:', e);
        }
      }
    }
  }, [unreadCount, notifications]);

  const loadNotifications = async (retryCount = 0) => {
    try {
      setLoading(true);
      const [notificationsData, countData] = await Promise.all([
        notificationsAPI.getAll(),
        notificationsAPI.getUnreadCount(),
      ]);

      setNotifications(notificationsData.notifications || []);
      setUnreadCount(countData.count || 0);
    } catch (error: any) {
      console.error('Failed to load notifications:', error);
      
      // Retry logic for network errors
      if (retryCount < 3 && (error.message.includes('Network Error') || error.message.includes('timeout'))) {
        setTimeout(() => {
          loadNotifications(retryCount + 1);
        }, 2000 * (retryCount + 1)); // Exponential backoff
      } else {
        toast.error(language === 'ar' ? 'فشل تحميل الإشعارات' : 'Failed to load notifications');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      try {
        await notificationsAPI.markAsRead(notification.id);
        setNotifications(prev =>
          prev.map(n =>
            n.id === notification.id ? { ...n, isRead: true } : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }

    // Navigate to account page to view orders
    if (notification.orderId) {
      setNavigateToOrderId(notification.orderId);
      setCurrentPage('account');
      setOpen(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success(language === 'ar' ? 'تم تحديد جميع الإشعارات كمقروءة' : 'All notifications marked as read');
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative text-gray-600 hover:text-green-700 flex items-center gap-2"
        >
          <Bell className={`w-5 h-5 ${loading ? 'animate-pulse' : ''}`} />
          {loading && (
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
          )}
          {unreadCount > 0 && (
            <Badge className="bg-green-500 text-white text-xs font-bold min-w-[1.25rem] h-5 flex items-center justify-center rounded-full shadow-lg animate-pulse absolute top-0 right-0" style={{ padding: '4px' }}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={`w-80 p-0 ${language === 'ar' ? 'rtl' : 'ltr'}`} align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">{t.notifications}</h3>
          <div className="flex items-center gap-2">
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="text-xs border rounded px-2 py-1 bg-white"
            >
              <option value="all">{language === 'ar' ? 'الكل' : 'All'}</option>
              <option value="unread">{language === 'ar' ? 'غير المقروء' : 'Unread'}</option>
              <option value="orders">{language === 'ar' ? 'الطلبات' : 'Orders'}</option>
            </select>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllRead}
                className="text-xs bg-green-100 hover:bg-green-200 text-green-800 rounded-full px-3 py-1 h-auto"
              >
                {t.markAllRead}
              </Button>
            )}
          </div>
        </div>
        <ScrollArea className="h-96 rounded-lg">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="abg flex items-center justify-center p-8 text-gray-500">
              {t.noNotifications}
            </div>
          ) : (
             <div className="divide-y border-t border-b border-gray-100 rounded-lg">
              {notifications
                .filter(notification => {
                  if (filter === 'unread') return !notification.isRead;
                  if (filter === 'orders') return notification.type.includes('order');
                  return true;
                })
                .map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 cursor-pointer transition-all duration-200 rounded-none first:rounded-t-lg last:rounded-b-lg ${
                      !notification.isRead 
                        ? 'bg-green-50 border-l-4 border-green-500 hover:bg-green-100' 
                        : 'bg-white hover:bg-gray-50'
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className={`text-sm font-semibold ${!notification.isRead ? 'text-green-800' : 'text-gray-700'}`}>
                            {notification.title}
                          </p>
                          {!notification.isRead && (
                            <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                          {notification.message}
                        </p>
                        {notification.orderNumber && (
                          <div className="inline-flex items-center gap-1.5 bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-md mb-2">
                            <Package className="w-3 h-3" />
                            <span>{t.viewOrder}: {notification.orderNumber}</span>
                          </div>
                        )}
                        <p className="text-xs text-gray-400">
                          {new Date(notification.createdAt).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {!notification.isRead && (
                          <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                        )}
                        <Bell className="w-4 h-4 text-gray-300" />
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

