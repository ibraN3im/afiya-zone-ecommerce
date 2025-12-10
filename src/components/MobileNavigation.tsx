import { useState } from 'react';
import { Home, ShoppingBag, ShoppingCart, User, Menu, Info, Phone, Globe } from 'lucide-react';
import { useApp } from '../App';
import { Badge } from '../components/ui/badge';
import { NotificationBell } from '../components/NotificationBell';

interface Translation {
    home: string;
    shop: string;
    cart: string;
    account: string;
    language: string;
}

const translations: Record<'en' | 'ar', Translation> = {
    en: {
        home: '',
        shop: '',
        cart: '',
        account: '',
        language: '',
    },
    ar: {
        home: '',
        shop: '',
        cart: '',
        account: '',
        language: '',
    },
};

export function MobileNavigation() {
    const { currentPage, setCurrentPage, language, setLanguage, user, cart, setShowLoginModal } = useApp();
    const t = translations[language];
    const [showMenu, setShowMenu] = useState(false);

    // Calculate cart items count
    const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ar' : 'en');
    };

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-500 shadow-2xl rounded-t-3xl border-t-4 border-white/30">
            <div className="bottom-nav">
                {/* Home */}
                <button
                    onClick={() => setCurrentPage('home')}
                    className={`flex flex-col items-center justify-center py-3 px-1 ${currentPage === 'home'
                        ? 'bg-white/40 rounded-t-3xl'
                        : 'text-white hover:bg-white/20'
                        } transition-all duration-300 ease-out`}
                >
                    <Home className="w-6 h-6 drop-shadow" />
                    <span className="text-xs mt-1 font-semibold drop-shadow">{t.home}</span>
                </button>

                {/* Shop */}
                <button
                    onClick={() => setCurrentPage('shop')}
                    className={`flex flex-col items-center justify-center py-3 px-1 ${currentPage === 'shop'
                        ? 'bg-white/40 rounded-t-3xl'
                        : 'text-white hover:bg-white/20'
                        } transition-all duration-300 ease-out`}
                >
                    <ShoppingBag className="w-6 h-6 drop-shadow" />
                    <span className="text-xs mt-1 font-semibold drop-shadow">{t.shop}</span>
                </button>

                {/* Cart */}
                <button
                    onClick={() => setCurrentPage('cart')}
                    className={`flex flex-col items-center justify-center px-1 relative ${currentPage === 'cart'
                        ? 'bg-white/40 rounded-t-3xl'
                        : 'text-white hover:text-white'
                        } transition-all duration-300 ease-out`}
                >
                    <ShoppingCart className="w-6 h-6 drop-shadow" />
                    {cartItemsCount > 0 && (
                        <Badge className="absolute cart-counter bg-green-500 text-white text-xs min-w-[1.2rem] h-5 flex items-center justify-center">
                            {cartItemsCount}
                        </Badge>
                    )}
                    <span className="text-xs mt-1 font-semibold drop-shadow">{t.cart}</span>
                </button>

                {/* Account */}
                <button
                    onClick={() => user ? setCurrentPage('account') : setShowLoginModal(true)}
                    className={`flex flex-col items-center justify-center py-3 px-1 ${currentPage === 'account'
                        ? 'bg-white/40 rounded-t-3xl'
                        : 'text-white'
                        } transition-all duration-300 ease-out`}
                >
                    <User className="w-6 h-6 drop-shadow" />
                    {/* <span className="text-xs mt-1 font-semibold drop-shadow truncate px-1">{user ? user.name?.split(' ')[0] : t.account}</span> */}
                </button>

                {/* Scroll to Top */}
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="flex flex-col items-center justify-center py-3 px-1 text-white hover:bg-white/20 transition-all duration-300 ease-out"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                </button>

            </div>

            {/* Click outside to close menu */}
            {showMenu && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowMenu(false)}
                />
            )}
        </nav>
    );
}