import { useState, createContext, useContext, useEffect } from 'react';
import { Header } from './components/Header';
import { Homepage } from './components/Homepage';
import { Shop } from './components/Shop';
import { ProductDetail } from './components/ProductDetail';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { UserAccount } from './components/UserAccount';
import { AboutUs } from './components/AboutUs';
import { Contact } from './components/Contact';
import { PasswordReset } from './components/PasswordReset';
import './styles/final-consolidated.css';
import { authAPI } from './services/api';
import { LoginModal } from './components/LoginModal';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';
import { Toaster } from './components/ui/sonner';
import { MobileNavigation } from './components/MobileNavigation';

// Context for global state
interface AppContextType {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  language: 'en' | 'ar';
  setLanguage: (lang: 'en' | 'ar') => void;
  user: any;
  setUser: (user: any) => void;
  cart: any[];
  setCart: (cart: any[]) => void;
  selectedProduct: any;
  setSelectedProduct: (product: any) => void;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  navigateToOrderId: string | null;
  setNavigateToOrderId: (orderId: string | null) => void;
  resetToken: string | null;
  setResetToken: (token: string | null) => void;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export const useApp = () => useContext(AppContext);

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [navigateToOrderId, setNavigateToOrderId] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);

  // Check for reset token in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const resetTokenParam = urlParams.get('resetToken');
    if (resetTokenParam) {
      setResetToken(resetTokenParam);
      setCurrentPage('reset-password');
    }
  }, []);

  // Restore user from localStorage / token on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('authToken');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        // ignore parse errors
      }
    }

    if (token) {
      // Try to refresh profile using token; if it fails, clear auth
      authAPI.getProfile()
        .then((data: any) => {
          // `getProfile` returns user data
          setUser(data);
        })
        .catch(() => {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          setUser(null);
        });
    }
  }, []);

  const contextValue = {
    currentPage,
    setCurrentPage,
    language,
    setLanguage,
    user,
    setUser,
    cart,
    setCart,
    selectedProduct,
    setSelectedProduct,
    showLoginModal,
    setShowLoginModal,
    navigateToOrderId,
    setNavigateToOrderId,
    resetToken,
    setResetToken,
  };

  const renderCurrentPage = () => {
    // Handle password reset page
    if (currentPage === 'reset-password' || resetToken) {
      return <PasswordReset />;
    }

    switch (currentPage) {
      case 'home':
        return <Homepage />;
      case 'shop':
        return <Shop />;
      case 'product':
        return <ProductDetail />;
      case 'cart':
        return <Cart />;
      case 'checkout':
        return <Checkout />;
      case 'account':
        return <UserAccount />;
      case 'admin':
        return <AdminDashboard />;
      case 'about':
        return <AboutUs />;
      case 'contact':
        return <Contact />;
      default:
        return <Homepage />;
    }
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className={`min-h-screen bg-gradient-to-br from-green-50 to-white ${language === 'ar' ? 'rtl' : 'ltr'}`}>
        <Header />
        <main className="pt-20 pb-16 md:pb-0">
          {renderCurrentPage()}
        </main>
        <Footer />
        {showLoginModal && <LoginModal />}
        <Toaster />
        <MobileNavigation />
      </div>
    </AppContext.Provider>
  );
}
